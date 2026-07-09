"use client";

import { Plus, Printer, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { ResumePreview } from "@/components/ResumePreview";
import type { ResumeContent, ResumeSectionItem, ResumeTemplate } from "@/lib/resume";
import { templates } from "@/lib/resume";
import { cn } from "@/lib/utils";

type ResumeEditorProps = {
  initialTitle: string;
  initialTemplate: ResumeTemplate;
  initialContent: ResumeContent;
};

type SectionKey = "experience" | "education" | "projects";

const sectionLabels: Record<SectionKey, string> = {
  experience: "Experience",
  education: "Education",
  projects: "Projects",
};

function newItem(): ResumeSectionItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    subtitle: "",
    location: "",
    start: "",
    end: "",
    description: "",
  };
}

export function ResumeEditor({
  initialTitle,
  initialTemplate,
  initialContent,
}: ResumeEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [template, setTemplate] = useState<ResumeTemplate>(initialTemplate);
  const [content, setContent] = useState(initialContent);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [isExporting, setIsExporting] = useState(false);

  const sectionKeys = useMemo<SectionKey[]>(() => ["experience", "projects", "education"], []);

  function updateField(field: keyof ResumeContent, value: string) {
    setContent((current) => ({ ...current, [field]: value }));
  }

  function updateSection(section: SectionKey, id: string, field: keyof ResumeSectionItem, value: string) {
    setContent((current) => ({
      ...current,
      [section]: current[section].map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addSectionItem(section: SectionKey) {
    setContent((current) => ({ ...current, [section]: [...current[section], newItem()] }));
  }

  function removeSectionItem(section: SectionKey, id: string) {
    setContent((current) => ({
      ...current,
      [section]: current[section].filter((item) => item.id !== id),
    }));
  }

  async function exportPdf() {
    if (isExporting) {
      return;
    }

    setIsExporting(true);
    const pdfWindow = window.open("", "_blank");

    if (!pdfWindow) {
      window.alert("Please allow pop-ups for this site so the PDF preview can open.");
      setIsExporting(false);
      return;
    }

    pdfWindow.document.write("<p style='font-family: system-ui; padding: 24px;'>Preparing PDF preview...</p>");
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 46;
      const isModern = template === "modern";
      const isMinimal = template === "minimal";
      const bodyFont = isMinimal ? "times" : "helvetica";
      const accent: [number, number, number] = isModern ? [15, 118, 110] : [0, 105, 92];
      let y = margin;

      function setText(color: [number, number, number]) {
        pdf.setTextColor(color[0], color[1], color[2]);
      }

      function ensureSpace(height: number) {
        if (y + height > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      }

      function writeText(
        text: string,
        x: number,
        width: number,
        options: {
          color?: [number, number, number];
          font?: string;
          lineHeight?: number;
          size?: number;
          style?: "normal" | "bold";
        } = {},
      ) {
        if (!text.trim()) {
          return;
        }
        const size = options.size ?? 10;
        const lineHeight = options.lineHeight ?? size + 5;
        pdf.setFont(options.font ?? bodyFont, options.style ?? "normal");
        pdf.setFontSize(size);
        setText(options.color ?? [31, 41, 55]);
        const lines = pdf.splitTextToSize(text, width);
        ensureSpace(lines.length * lineHeight + 4);
        pdf.text(lines, x, y);
        y += lines.length * lineHeight;
      }

      function sectionTitle(label: string, x: number, width: number) {
        ensureSpace(28);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        setText(isMinimal ? [110, 98, 83] : [30, 64, 104]);
        pdf.text(label.toUpperCase(), x, y);
        if (!isMinimal) {
          pdf.setDrawColor(203, 213, 225);
          pdf.line(x, y + 8, x + width, y + 8);
        }
        y += 24;
      }

      function itemBlock(item: ResumeSectionItem, x: number, width: number) {
        ensureSpace(55);
        pdf.setFont(bodyFont, "bold");
        pdf.setFontSize(12);
        setText([2, 6, 23]);
        pdf.text(item.title || "Title", x, y);
        const date = [item.start, item.end].filter(Boolean).join(" - ");
        if (date) {
          pdf.setFont(bodyFont, "normal");
          pdf.setFontSize(9);
          setText([71, 85, 105]);
          pdf.text(date, x + width, y, { align: "right" });
        }
        y += 15;
        writeText(item.subtitle || "Organization", x, width, {
          color: [71, 85, 105],
          size: 10,
          lineHeight: 13,
        });
        if (item.description) {
          y += 3;
          writeText(item.description, x, width, { size: 10, lineHeight: 15 });
        }
        y += 8;
      }

      if (isModern) {
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, 128, "F");
        setText([255, 255, 255]);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(28);
        pdf.text(content.fullName || "Your Name", margin, 56);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(14);
        setText([204, 251, 241]);
        pdf.text(content.headline || "Professional headline", margin, 80);
        pdf.setFontSize(9);
        setText([226, 232, 240]);
        pdf.text(
          [content.email, content.phone, content.location, content.website].filter(Boolean).join("  |  "),
          margin,
          106,
        );
        y = 166;
      } else {
        pdf.setFont(isMinimal ? "times" : "helvetica", isMinimal ? "normal" : "bold");
        pdf.setFontSize(isMinimal ? 32 : 30);
        setText([2, 6, 23]);
        pdf.text(content.fullName || "Your Name", isMinimal ? pageWidth / 2 : margin, y, {
          align: isMinimal ? "center" : "left",
        });
        y += isMinimal ? 24 : 27;
        pdf.setFont(bodyFont, "normal");
        pdf.setFontSize(isMinimal ? 11 : 14);
        setText(isMinimal ? [120, 113, 108] : accent);
        pdf.text(content.headline || "Professional headline", isMinimal ? pageWidth / 2 : margin, y, {
          align: isMinimal ? "center" : "left",
        });
        y += 28;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        setText([71, 85, 105]);
        pdf.text(
          [content.email, content.phone, content.location, content.website].filter(Boolean).join("  |  "),
          isMinimal ? pageWidth / 2 : margin,
          y,
          { align: isMinimal ? "center" : "left" },
        );
        y += isMinimal ? 42 : 34;
      }

      const contentWidth = pageWidth - margin * 2;
      sectionTitle("Profile", margin, contentWidth);
      writeText(
        content.summary || "Write a concise summary that captures your strengths and direction.",
        margin,
        contentWidth,
        { size: isMinimal ? 11 : 10, lineHeight: isMinimal ? 17 : 15 },
      );
      y += 12;

      sectionTitle("Skills", margin, contentWidth);
      writeText(
        (content.skills || "Leadership, Communication, Strategy")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
          .join("  |  "),
        margin,
        contentWidth,
        { size: 10, lineHeight: 15 },
      );
      y += 12;

      if (content.links.length) {
        sectionTitle("Links", margin, contentWidth);
        content.links.forEach((link) => {
          writeText(`${link.label}: ${link.url}`, margin, contentWidth, { size: 10, lineHeight: 15 });
        });
        y += 12;
      }

      sectionTitle("Experience", margin, contentWidth);
      content.experience.forEach((item) => itemBlock(item, margin, contentWidth));

      sectionTitle("Projects", margin, contentWidth);
      content.projects.forEach((item) => itemBlock(item, margin, contentWidth));

      sectionTitle("Education", margin, contentWidth);
      content.education.forEach((item) => itemBlock(item, margin, contentWidth));

      const blobUrl = pdf.output("bloburl");
      pdfWindow.location.href = blobUrl.toString();
    } catch (error) {
      console.error(error);
      pdfWindow.close();
      window.alert("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <input
            className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-lg font-bold text-slate-950 md:max-w-md"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
          <div className="flex items-center gap-2">
            <Button className="md:hidden" onClick={() => setActiveView(activeView === "editor" ? "preview" : "editor")} variant="secondary">
              {activeView === "editor" ? "Preview" : "Editor"}
            </Button>
            <Button disabled={isExporting} onClick={exportPdf} variant="secondary">
              <Printer size={16} />
              {isExporting ? "Exporting" : "PDF"}
            </Button>
          </div>
          <p className="w-full text-right text-sm font-medium text-slate-500">
            Edits stay in this browser tab. Export to PDF when you are done.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,520px)_1fr]">
        <section className={cn("no-print space-y-5", activeView === "preview" && "hidden md:block")}>
          <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Template</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {templates.map((item) => (
                <button
                  className={cn(
                    "rounded-md border p-3 text-left transition",
                    template === item.id ? "border-teal-700 bg-teal-50" : "border-slate-200 hover:bg-slate-50",
                  )}
                  key={item.id}
                  onClick={() => setTemplate(item.id)}
                  type="button"
                >
                  <span className="block font-semibold text-slate-950">{item.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Personal details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["fullName", "Full name"],
                ["headline", "Headline"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["location", "Location"],
                ["website", "Website"],
              ].map(([field, label]) => (
                <label className="text-sm font-medium text-slate-700" key={field}>
                  {label}
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-slate-950"
                    onChange={(event) => updateField(field as keyof ResumeContent, event.target.value)}
                    value={String(content[field as keyof ResumeContent])}
                  />
                </label>
              ))}
            </div>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Summary
              <textarea
                className="mt-1 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                onChange={(event) => updateField("summary", event.target.value)}
                value={content.summary}
              />
            </label>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Skills, separated by commas
              <textarea
                className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                onChange={(event) => updateField("skills", event.target.value)}
                value={content.skills}
              />
            </label>
          </div>

          {sectionKeys.map((section) => (
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm" key={section}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-950">{sectionLabels[section]}</h2>
                <Button onClick={() => addSectionItem(section)} type="button" variant="secondary">
                  <Plus size={16} />
                  Add
                </Button>
              </div>
              <div className="mt-4 space-y-4">
                {content[section].map((item) => (
                  <div className="rounded-md border border-slate-200 p-3" key={item.id}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["title", "Title"],
                        ["subtitle", section === "education" ? "School" : "Company / context"],
                        ["location", "Location"],
                        ["start", "Start"],
                        ["end", "End"],
                      ].map(([field, label]) => (
                        <label className="text-sm font-medium text-slate-700" key={field}>
                          {label}
                          <input
                            className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-slate-950"
                            onChange={(event) =>
                              updateSection(section, item.id, field as keyof ResumeSectionItem, event.target.value)
                            }
                            value={String(item[field as keyof ResumeSectionItem])}
                          />
                        </label>
                      ))}
                    </div>
                    <label className="mt-3 block text-sm font-medium text-slate-700">
                      Description
                      <textarea
                        className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                        onChange={(event) => updateSection(section, item.id, "description", event.target.value)}
                        value={item.description}
                      />
                    </label>
                    <Button className="mt-3" onClick={() => removeSectionItem(section, item.id)} type="button" variant="danger">
                      <Trash2 size={16} />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className={cn("print-preview", activeView === "editor" && "hidden md:block")}>
          <ResumePreview content={content} template={template} />
        </section>
      </main>
    </div>
  );
}
