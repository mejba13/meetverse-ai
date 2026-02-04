"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Github, Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
  const strengthColors = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-[#34D399]",
    "bg-[#CAFF4B]"
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual sign up logic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push("/dashboard");
  }

  async function signUpWithProvider(provider: "google" | "github") {
    setIsLoading(true);
    // TODO: Implement OAuth sign up
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
            onClick={() => signUpWithProvider("google")}
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
            onClick={() => signUpWithProvider("github")}
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
          <Label htmlFor="name" className="text-white/60 text-sm font-medium">
            Full name
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[#9B5DE5] transition-colors" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 pl-11 bg-white/[0.02] border-white/[0.08] focus:border-[#9B5DE5]/50 focus:ring-[#9B5DE5]/20 text-white placeholder:text-white/25 rounded-xl transition-all duration-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/60 text-sm font-medium">
            Email address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[#9B5DE5] transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 pl-11 bg-white/[0.02] border-white/[0.08] focus:border-[#9B5DE5]/50 focus:ring-[#9B5DE5]/20 text-white placeholder:text-white/25 rounded-xl transition-all duration-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/60 text-sm font-medium">
            Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[#9B5DE5] transition-colors" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
              className="h-12 pl-11 bg-white/[0.02] border-white/[0.08] focus:border-[#9B5DE5]/50 focus:ring-[#9B5DE5]/20 text-white placeholder:text-white/25 rounded-xl transition-all duration-300"
            />
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 pt-2"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-white/[0.08]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-white/30">
                Password strength:{" "}
                <span className={`${
                  passwordStrength >= 4 ? "text-[#CAFF4B]" :
                  passwordStrength >= 3 ? "text-[#34D399]" :
                  passwordStrength >= 2 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too weak"}
                </span>
              </p>
            </motion.div>
          )}

          <p className="text-xs text-white/30 pt-1">
            Minimum 8 characters
          </p>
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
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Terms */}
      <p className="text-xs text-center text-white/30 leading-relaxed">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="text-[#CAFF4B] hover:text-[#d8ff7a] transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-[#CAFF4B] hover:text-[#d8ff7a] transition-colors">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
