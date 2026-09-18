import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { ResumeSheet } from "@/components/resume/ResumeSheet";
import { ownerContent } from "@/lib/resume-content";
import { profile } from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.role} in ${profile.location}.`,
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-ink py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-5 flex w-full max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 print:hidden">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-bone">
          ← Back to portfolio
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/resume/build"
            className="rounded-full border border-line px-4 py-2 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
          >
            Build your resume
          </Link>
          <PrintButton />
          <a
            href="/louie-doromal-resume.pdf"
            download
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-85"
          >
            Download PDF
          </a>
        </div>
      </div>

      <ResumeSheet content={ownerContent} />
    </div>
  );
}
