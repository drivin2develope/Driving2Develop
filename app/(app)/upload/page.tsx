import { PageHeader } from "@/components/ui";
import { UploadFlow } from "@/components/UploadFlow";
export const metadata = { title: "Upload" };
export default function UploadPage() {
  return (
    <div>
      <PageHeader eyebrow="Upload" title="Analyze a real recording" subtitle="Score a real-world field recording instead of a live roleplay." />
      <UploadFlow />
    </div>
  );
}
