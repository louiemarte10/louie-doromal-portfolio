import type { Metadata } from "next";
import { BuilderClient } from "@/components/resume/BuilderClient";

export const metadata: Metadata = {
  title: "Build your resume",
  description:
    "Fill in your details and print a resume using the same A4 template as this portfolio.",
};

export default function BuildResumePage() {
  return <BuilderClient />;
}
