import { ResumeEditor } from "@/components/ResumeEditor";
import { starterResumeContent } from "@/lib/resume";

export default function BuilderPage() {
  return (
    <ResumeEditor
      initialContent={starterResumeContent}
      initialTemplate="classic"
      initialTitle="Untitled resume"
    />
  );
}
