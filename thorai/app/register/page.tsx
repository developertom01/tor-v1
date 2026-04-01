import type { Metadata } from "next";
import RegisterFlow from "./_components/RegisterFlow";

export const metadata: Metadata = {
  title: "Register Your Store — ThorAI",
  description: "Set up your verified ThorAI store in minutes with our AI-guided onboarding.",
};

export default function RegisterPage() {
  return <RegisterFlow />;
}
