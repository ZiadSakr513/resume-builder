export type ResumeSectionItem = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  start: string;
  end: string;
  description: string;
};

export type ResumeLink = {
  id: string;
  label: string;
  url: string;
};

export type ResumeContent = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  experience: ResumeSectionItem[];
  education: ResumeSectionItem[];
  projects: ResumeSectionItem[];
  links: ResumeLink[];
};

export const templates = [
  { id: "classic", name: "Classic", description: "Crisp, formal, ATS-friendly." },
  { id: "modern", name: "Modern", description: "Confident color and bold hierarchy." },
  { id: "minimal", name: "Minimal", description: "Quiet, spacious, editorial." },
] as const;

export type ResumeTemplate = (typeof templates)[number]["id"];

export const emptyResumeContent: ResumeContent = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  skills: "",
  experience: [],
  education: [],
  projects: [],
  links: [],
};

export const starterResumeContent: ResumeContent = {
  fullName: "Maya Carter",
  headline: "Product Designer",
  email: "maya@example.com",
  phone: "+1 555 0199",
  location: "New York, NY",
  website: "mayacarter.design",
  summary:
    "Product designer focused on clear, useful interfaces for fast-moving teams. Experienced in research, prototyping, and shipping design systems.",
  skills: "Product strategy, UX research, Figma, Design systems, Prototyping, Accessibility",
  experience: [
    {
      id: "exp-1",
      title: "Senior Product Designer",
      subtitle: "Northstar Labs",
      location: "Remote",
      start: "2023",
      end: "Present",
      description:
        "Led dashboard redesigns, improved onboarding completion by 24%, and partnered with engineering on a shared component library.",
    },
  ],
  education: [
    {
      id: "edu-1",
      title: "B.A. Interaction Design",
      subtitle: "State University",
      location: "Boston, MA",
      start: "2018",
      end: "2022",
      description: "Graduated with honors. Coursework in human-centered design and visual systems.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Hiring Flow Redesign",
      subtitle: "Case Study",
      location: "",
      start: "2024",
      end: "",
      description:
        "Mapped recruiter pain points and redesigned candidate review flows for faster decision making.",
    },
  ],
  links: [{ id: "link-1", label: "Portfolio", url: "https://mayacarter.design" }],
};

export function parseResumeContent(content: string | null | undefined): ResumeContent {
  if (!content) {
    return emptyResumeContent;
  }

  try {
    return { ...emptyResumeContent, ...JSON.parse(content) };
  } catch {
    return emptyResumeContent;
  }
}
