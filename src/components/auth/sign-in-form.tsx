"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Github, Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual sign in logic with NextAuth
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push("/dashboard");
  }

  async function signInWithProvider(provider: "google" | "github") {
    setIsLoading(true);
    // TODO: Implement OAuth sign in
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* OAuth Buttons */}
      <div className="grid gap-3">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => signInWithProvider("google")}
            className="w-full h-12 bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.08] hover:border-white/[0.15] text-white rounded-xl transition-all duration-300"
          >
            <Chrome className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => signInWithProvider("github")}
            className="w-full h-12 bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.08] hover:border-white/[0.15] text-white rounded-xl transition-all duration-300"
          >
            <Github className="mr-3 h-5 w-5" />
            Continue with GitHub
          </Button>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a0a] px-4 text-white/30 tracking-wider">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/60 text-sm font-medium">
            Email address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[#CAFF4B] transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 pl-11 bg-white/[0.02] border-white/[0.08] focus:border-[#CAFF4B]/50 focus:ring-[#CAFF4B]/20 text-white placeholder:text-white/25 rounded-xl transition-all duration-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white/60 text-sm font-medium">
              Password
            </Label>
            <a
              href="/forgot-password"
              className="text-sm text-[#CAFF4B] hover:text-[#d8ff7a] transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[#CAFF4B] transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 pl-11 bg-white/[0.02] border-white/[0.08] focus:border-[#CAFF4B]/50 focus:ring-[#CAFF4B]/20 text-white placeholder:text-white/25 rounded-xl transition-all duration-300"
            />
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#CAFF4B] hover:bg-[#d8ff7a] text-black font-medium rounded-xl shadow-lg shadow-[#CAFF4B]/20 transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
