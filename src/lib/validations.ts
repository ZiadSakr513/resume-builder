import { z } from "zod";

const sectionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  description: z.string(),
});

const linkSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string(),
});

export const resumeContentSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  summary: z.string(),
  skills: z.string(),
  experience: z.array(sectionItemSchema),
  education: z.array(sectionItemSchema),
  projects: z.array(sectionItemSchema),
  links: z.array(linkSchema),
});

export const resumePayloadSchema = z.object({
  title: z.string().min(1, "Resume title is required.").max(80),
  template: z.enum(["classic", "modern", "minimal"]),
  content: resumeContentSchema,
});
