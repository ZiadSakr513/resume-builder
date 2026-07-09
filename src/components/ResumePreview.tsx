import { Mail, MapPin, Phone, Link as LinkIcon } from "lucide-react";
import type { ResumeContent, ResumeTemplate } from "@/lib/resume";
import { cn } from "@/lib/utils";

type ResumePreviewProps = {
  content: ResumeContent;
  template: ResumeTemplate;
};

function Section({
  title,
  children,
  accent,
  minimal = false,
}: {
  title: string;
  children: React.ReactNode;
  accent: string;
  minimal?: boolean;
}) {
  return (
    <section className={cn("space-y-3", minimal && "space-y-4")}>
      <h3
        className={cn(
          "border-b pb-2 text-xs font-bold uppercase tracking-[0.18em]",
          minimal && "border-0 pb-0 text-[11px] tracking-[0.24em]",
          accent,
        )}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ResumePreview({ content, template }: ResumePreviewProps) {
  const isModern = template === "modern";
  const isMinimal = template === "minimal";
  const isClassic = template === "classic";
  const accent = isModern
    ? "border-teal-700 text-teal-800"
    : isMinimal
      ? "text-stone-500"
      : "border-slate-300 text-slate-700";

  return (
    <article
      className={cn(
        "print-area mx-auto min-h-[980px] w-full max-w-[860px] bg-white p-10 text-slate-900 shadow-2xl shadow-slate-200",
        isModern && "border-t-[12px] border-teal-700",
        isMinimal && "max-w-[760px] p-14 font-serif shadow-none ring-1 ring-stone-200",
      )}
    >
      <header
        className={cn(
          "space-y-5",
          isModern && "-m-10 mb-9 bg-slate-950 p-8 text-white",
          isMinimal && "border-b border-stone-200 pb-8 text-center",
        )}
      >
        <div>
          <h1
            className={cn(
              "text-4xl font-bold tracking-normal",
              isMinimal && "text-5xl font-normal tracking-normal text-stone-950",
            )}
          >
            {content.fullName || "Your Name"}
          </h1>
          <p
            className={cn(
              "mt-2 text-lg",
              isModern ? "text-teal-100" : "text-teal-800",
              isMinimal && "text-base uppercase tracking-[0.24em] text-stone-500",
            )}
          >
            {content.headline || "Professional headline"}
          </p>
        </div>
        <div
          className={cn(
            "flex flex-wrap gap-x-5 gap-y-3 text-sm",
            isModern ? "text-slate-200" : "text-slate-600",
            isMinimal && "justify-center gap-x-6 text-stone-500",
          )}
        >
          {content.email ? (
            <span className="inline-flex items-center gap-1.5">
              {!isMinimal ? <Mail size={14} /> : null}
              {content.email}
            </span>
          ) : null}
          {content.phone ? (
            <span className="inline-flex items-center gap-1.5">
              {!isMinimal ? <Phone size={14} /> : null}
              {content.phone}
            </span>
          ) : null}
          {content.location ? (
            <span className="inline-flex items-center gap-1.5">
              {!isMinimal ? <MapPin size={14} /> : null}
              {content.location}
            </span>
          ) : null}
          {content.website ? (
            <span className="inline-flex items-center gap-1.5">
              {!isMinimal ? <LinkIcon size={14} /> : null}
              {content.website}
            </span>
          ) : null}
        </div>
      </header>

      <div
        className={cn(
          "mt-9 grid gap-10 md:grid-cols-[0.9fr_1.8fr]",
          isMinimal && "block space-y-10",
          isClassic && "md:gap-9",
        )}
      >
        <aside className={cn("space-y-8", isMinimal && "space-y-10")}>
          <Section accent={accent} title="Profile" minimal={isMinimal}>
            <p className={cn("text-sm leading-7 text-slate-700", isMinimal && "text-base leading-8 text-stone-700")}>
              {content.summary || "Write a concise summary that captures your strengths and direction."}
            </p>
          </Section>
          <Section accent={accent} title="Skills" minimal={isMinimal}>
            <div className={cn("flex flex-wrap gap-2.5", isMinimal && "gap-x-4 gap-y-2")}>
              {(content.skills || "Leadership, Communication, Strategy")
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span
                    className={cn(
                      "rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700",
                      isMinimal && "rounded-none border-b border-stone-300 bg-transparent px-0 py-0.5 text-sm text-stone-700",
                    )}
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </Section>
          {content.links.length ? (
            <Section accent={accent} title="Links" minimal={isMinimal}>
              <ul className={cn("space-y-2 text-sm leading-6 text-slate-700", isMinimal && "text-stone-700")}>
                {content.links.map((link) => (
                  <li key={link.id}>
                    <span className="font-semibold">{link.label}</span>: {link.url}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </aside>

        <main className={cn("space-y-9", isMinimal && "space-y-10")}>
          <Section accent={accent} title="Experience" minimal={isMinimal}>
            <div className="space-y-6">
              {content.experience.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
                    <div>
                      <h4 className={cn("font-bold", isMinimal && "text-lg font-semibold text-stone-950")}>
                        {item.title || "Role title"}
                      </h4>
                      <p className={cn("mt-1 text-sm font-medium text-slate-600", isMinimal && "text-stone-500")}>
                        {item.subtitle || "Company"}
                      </p>
                    </div>
                    <p className={cn("text-sm text-slate-500", isMinimal && "font-sans text-xs uppercase tracking-[0.18em]")}>
                      {[item.start, item.end].filter(Boolean).join(" - ")}
                    </p>
                  </div>
                  <p className={cn("mt-3 text-sm leading-7 text-slate-700", isMinimal && "text-base leading-8 text-stone-700")}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>
          <Section accent={accent} title="Projects" minimal={isMinimal}>
            <div className="space-y-6">
              {content.projects.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
                    <div>
                      <h4 className={cn("font-bold", isMinimal && "text-lg font-semibold text-stone-950")}>
                        {item.title || "Project title"}
                      </h4>
                      {item.subtitle || item.location ? (
                        <p className={cn("mt-1 text-sm font-medium text-slate-600", isMinimal && "text-stone-500")}>
                          {[item.subtitle, item.location].filter(Boolean).join(" | ")}
                        </p>
                      ) : null}
                    </div>
                    <p className={cn("text-sm text-slate-500", isMinimal && "font-sans text-xs uppercase tracking-[0.18em]")}>
                      {[item.start, item.end].filter(Boolean).join(" - ")}
                    </p>
                  </div>
                  <p className={cn("mt-2 text-sm leading-7 text-slate-700", isMinimal && "text-base leading-8 text-stone-700")}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>
          <Section accent={accent} title="Education" minimal={isMinimal}>
            <div className="space-y-6">
              {content.education.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
                    <div>
                      <h4 className={cn("font-bold", isMinimal && "text-lg font-semibold text-stone-950")}>
                        {item.title || "Degree"}
                      </h4>
                      <p className={cn("mt-1 text-sm font-medium text-slate-600", isMinimal && "text-stone-500")}>
                        {item.subtitle || "School"}
                      </p>
                    </div>
                    <p className={cn("text-sm text-slate-500", isMinimal && "font-sans text-xs uppercase tracking-[0.18em]")}>
                      {[item.start, item.end].filter(Boolean).join(" - ")}
                    </p>
                  </div>
                  <p className={cn("mt-3 text-sm leading-7 text-slate-700", isMinimal && "text-base leading-8 text-stone-700")}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
    </article>
  );
}
