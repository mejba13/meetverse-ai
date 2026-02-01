import Link from "next/link";
import { Video } from "lucide-react";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your MeetVerse AI account",
};

export default function SignInPage() {
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

          <div className="space-y-6">
            <blockquote className="space-y-4">
              <p className="text-2xl font-medium leading-relaxed">
                "MeetVerse AI has completely transformed how our team
                collaborates. The AI summaries save us hours every week."
              </p>
              <footer className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/20" />
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-white/70">
                    Product Lead, TechCorp
                  </div>
                </div>
              </footer>
            </blockquote>
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
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <SignInForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
