import { ArrowRight, CheckCircle2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-slate-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link className="flex items-center gap-2 font-bold" href="/">
          <span className="grid size-9 place-items-center rounded-md bg-teal-700 text-white">
            <FileText size={18} />
          </span>
          <span>
            CVForge
            <span className="block text-xs font-semibold text-slate-500">Founded by Ziad Sakr</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ButtonLink href="/builder">Open builder</ButtonLink>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-800">
            <Sparkles size={16} />
            No-login resume builder with no server storage
          </div>
          <h1 className="mt-6 text-5xl font-black tracking-normal text-slate-950 sm:text-6xl">
            Build a sharper resume without fighting the formatting.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            CVForge gives you reusable resumes, clean templates, live preview, and browser PDF
            export in one focused workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink className="h-12 px-5" href="/builder">
              Start building
              <ArrowRight size={18} />
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-medium text-slate-700 sm:grid-cols-3">
            {["No server storage", "Template switching", "Print-ready PDF"].map((item) => (
              <div className="flex items-center gap-2" key={item}>
                <CheckCircle2 className="text-teal-700" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
                Resume Preview
              </p>
              <h2 className="mt-2 text-3xl font-black">Jordan Lee</h2>
              <p className="text-teal-800">Full-stack Developer</p>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-[0.8fr_1.2fr]">
              <aside className="space-y-5">
                <div>
                  <h3 className="border-b pb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Profile
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Developer who turns messy workflows into calm, fast products.
                  </p>
                </div>
                <div>
                  <h3 className="border-b pb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Skills
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["React", "Node", "UX", "Docker"].map((skill) => (
                      <span
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
              <section className="space-y-5">
                {["Senior Developer", "Frontend Engineer", "Open Source Project"].map((role) => (
                  <div key={role}>
                    <h3 className="font-bold">{role}</h3>
                    <p className="text-sm leading-6 text-slate-600">
                      Shipped polished product experiences with reliable systems underneath.
                    </p>
                  </div>
                ))}
              </section>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <span className="grid size-12 shrink-0 place-items-center rounded-md bg-teal-50 text-teal-700">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <p className="font-bold">No sign-in required</p>
                <p className="text-sm text-slate-500">Open the builder and start editing</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <span className="grid size-12 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700">
                <FileText size={18} />
              </span>
              <div>
                <p className="font-bold">No shared dashboard</p>
                <p className="text-sm text-slate-500">Export your resume instead of saving it</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-slate-600">
          <p>CVForge</p>
          <p className="font-semibold text-slate-800">Founded by Ziad Sakr</p>
        </div>
      </footer>
    </main>
  );
}
