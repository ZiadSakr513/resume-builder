"use client";

import { Plus, Printer, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

  const sectionKeys = useMemo<SectionKey[]>(() => ["experience", "projects", "education"], []);

  useEffect(() => {
    document.title = cleanPdfTitle(title);
  }, [title]);

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

  function exportPdf() {
    document.title = cleanPdfTitle(title);
    window.print();
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
            <Button onClick={exportPdf} variant="secondary">
              <Printer size={16} />
              PDF
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
