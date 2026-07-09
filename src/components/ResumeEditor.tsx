"use client";

import { Download, Plus, Trash2 } from "lucide-react";
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

function cleanPdfTitle(value: string) {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]+/g, "")
    .replace(/\s+/g, " ") || "resume";
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

    try {
      const { default: jsPDF } = await import("jspdf");
      const pdfTitle = cleanPdfTitle(title);
      const pdf = new jsPDF({ format: "letter", orientation: "portrait", unit: "pt" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 54;
      const gap = 34;
      const sidebarWidth = 190;
      const mainX = margin + sidebarWidth + gap;
      const mainWidth = pageWidth - margin - mainX;
      const fullWidth = pageWidth - margin * 2;

      const colors = {
        accent: template === "modern" ? "#0f766e" : template === "minimal" ? "#78716c" : "#1e3a5f",
        body: "#1e293b",
        muted: "#64748b",
        title: "#020617",
      };

      const cursor = { y: margin };
      const sidebar = { y: margin };
      const main = { y: margin };

      const ensureSpace = (target: { y: number }, height: number) => {
        if (target.y + height > pageHeight - margin) {
          pdf.addPage();
          target.y = margin;
        }
      };

      const writeWrapped = (
        text: string,
        target: { y: number },
        x: number,
        width: number,
        size: number,
        color: string,
        lineGap = 14,
        font: "normal" | "bold" = "normal",
      ) => {
        if (!text.trim()) {
          return;
        }

        pdf.setFont("helvetica", font);
        pdf.setFontSize(size);
        pdf.setTextColor(color);

        const lines = pdf.splitTextToSize(text.trim(), width) as string[];
        ensureSpace(target, lines.length * lineGap + 6);
        pdf.text(lines, x, target.y);
        target.y += lines.length * lineGap + 8;
      };

      const skillPills = (skills: string[], target: { y: number }, x: number, width: number) => {
        let pillX = x;
        const pillGap = 7;
        const rowGap = 10;
        const pillHeight = 19;

        skills.forEach((skill) => {
          const label = skill.trim();

          if (!label) {
            return;
          }

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);

          const pillWidth = Math.min(pdf.getTextWidth(label) + 18, width);

          if (pillX > x && pillX + pillWidth > x + width) {
            pillX = x;
            target.y += pillHeight + rowGap;
          }

          ensureSpace(target, pillHeight + rowGap);
          pdf.setFillColor(template === "minimal" ? "#ffffff" : "#f1f5f9");
          pdf.setDrawColor(template === "minimal" ? "#d6d3d1" : "#f1f5f9");
          pdf.roundedRect(pillX, target.y - 12, pillWidth, pillHeight, template === "minimal" ? 0 : 4, template === "minimal" ? 0 : 4, "FD");
          pdf.setTextColor(colors.body);
          pdf.text(label, pillX + 9, target.y + 1);
          pillX += pillWidth + pillGap;
        });

        target.y += pillHeight + 8;
      };

      const section = (label: string, target: { y: number }, x: number, width: number) => {
        ensureSpace(target, 34);
        target.y += 12;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(colors.accent);
        pdf.text(label.toUpperCase(), x, target.y);
        target.y += 8;
        pdf.setDrawColor(colors.accent);
        pdf.setLineWidth(0.5);
        pdf.line(x, target.y, x + width, target.y);
        target.y += 18;
      };

      const item = (entry: ResumeSectionItem, target: { y: number }, x: number, width: number) => {
        ensureSpace(target, 70);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(colors.title);
        pdf.text(entry.title || "Untitled", x, target.y);

        const dates = [entry.start, entry.end].filter(Boolean).join(" - ");
        if (dates) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.setTextColor(colors.muted);
          pdf.text(dates, x + width, target.y, { align: "right" });
        }

        target.y += 15;
        if (entry.subtitle || entry.location) {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.setTextColor(colors.muted);
          pdf.text([entry.subtitle, entry.location].filter(Boolean).join(" | "), x, target.y);
          target.y += 15;
        }

        writeWrapped(entry.description, target, x, width, 10, colors.body, 13);
        target.y += 6;
      };

      pdf.setProperties({ title: pdfTitle, creator: "CVForge" });
      pdf.setFont("helvetica", template === "minimal" ? "normal" : "bold");
      pdf.setFontSize(template === "minimal" ? 30 : 34);
      pdf.setTextColor(colors.title);
      pdf.text(content.fullName || "Your Name", margin, cursor.y);
      cursor.y += 26;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(15);
      pdf.setTextColor(colors.accent);
      pdf.text(content.headline || "Professional headline", margin, cursor.y);
      cursor.y += 28;

      const contact = [content.email, content.phone, content.location, content.website].filter(Boolean).join("  |  ");
      writeWrapped(contact, cursor, margin, fullWidth, 10, colors.muted, 13);

      const contentTop = cursor.y + 14;

      if (template === "minimal") {
        section("Profile", cursor, margin, fullWidth);
        writeWrapped(content.summary, cursor, margin, fullWidth, 10, colors.body, 14);

        section("Skills", cursor, margin, fullWidth);
        skillPills(content.skills.split(",").map((skill) => skill.trim()).filter(Boolean), cursor, margin, fullWidth);

        if (content.links.length) {
          section("Links", cursor, margin, fullWidth);
          content.links.forEach((link) => writeWrapped(`${link.label}: ${link.url}`, cursor, margin, fullWidth, 10, colors.body, 14));
        }

        section("Experience", cursor, margin, fullWidth);
        content.experience.forEach((entry) => item(entry, cursor, margin, fullWidth));

        section("Projects", cursor, margin, fullWidth);
        content.projects.forEach((entry) => item(entry, cursor, margin, fullWidth));

        section("Education", cursor, margin, fullWidth);
        content.education.forEach((entry) => item(entry, cursor, margin, fullWidth));
      } else {
        sidebar.y = contentTop;
        main.y = contentTop;

        section("Profile", sidebar, margin, sidebarWidth);
        writeWrapped(content.summary, sidebar, margin, sidebarWidth, 10, colors.body, 14);

        section("Skills", sidebar, margin, sidebarWidth);
        skillPills(content.skills.split(",").map((skill) => skill.trim()).filter(Boolean), sidebar, margin, sidebarWidth);

        if (content.links.length) {
          section("Links", sidebar, margin, sidebarWidth);
          content.links.forEach((link) => writeWrapped(`${link.label}: ${link.url}`, sidebar, margin, sidebarWidth, 10, colors.body, 14));
        }

        section("Experience", main, mainX, mainWidth);
        content.experience.forEach((entry) => item(entry, main, mainX, mainWidth));

        section("Projects", main, mainX, mainWidth);
        content.projects.forEach((entry) => item(entry, main, mainX, mainWidth));

        section("Education", main, mainX, mainWidth);
        content.education.forEach((entry) => item(entry, main, mainX, mainWidth));
      }

      pdf.save(`${pdfTitle}.pdf`);
    } finally {
      window.setTimeout(() => setIsExporting(false), 500);
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
              <Download size={16} />
              {isExporting ? "Downloading" : "PDF"}
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
