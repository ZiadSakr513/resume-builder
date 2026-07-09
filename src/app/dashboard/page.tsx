import { ArrowRight, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <Link className="flex items-center gap-2 font-bold" href="/">
            <span className="grid size-9 place-items-center rounded-md bg-teal-700 text-white">
              <FileText size={18} />
            </span>
            CVForge
          </Link>
          <ButtonLink href="/builder">
            Start builder
            <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">Private by design</p>
          <h1 className="mt-2 max-w-2xl text-5xl font-black tracking-normal">
            Build one resume at a time. Nothing is saved on the server.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            The editor keeps your work in the current browser tab only. When you are done, export
            the resume as a PDF and close the tab.
          </p>
          <div className="mt-8">
            <ButtonLink className="h-12 px-5" href="/builder">
              Create a resume
              <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-md bg-teal-50 text-teal-700">
              <ShieldCheck size={22} />
            </span>
            <div>
              <h2 className="text-2xl font-black">No shared resume dashboard</h2>
              <p className="mt-2 leading-7 text-slate-600">
                There are no saved resume cards, no edit-later list, and no public database of
                user-created resumes. This keeps the no-login version safer for public deployment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
