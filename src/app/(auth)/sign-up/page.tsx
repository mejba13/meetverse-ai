import Link from "next/link";
import { Video } from "lucide-react";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Sign Up",
  description: "Create your MeetVerse AI account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Video className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">MeetVerse AI</span>
          </Link>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold">
                Start your journey with MeetVerse AI
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Join thousands of teams using AI-powered meetings
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Real-time AI transcription",
                "Automatic meeting summaries",
                "Smart action item detection",
                "Calendar integrations",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-white/70">
            &copy; {new Date().getFullYear()} MeetVerse AI
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 lg:hidden mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600">
              <Video className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">MeetVerse AI</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Get started with your free account
            </p>
          </div>

          <SignUpForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
