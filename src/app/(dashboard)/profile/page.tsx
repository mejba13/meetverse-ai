"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Camera,
  Loader2,
  Check,
  Edit3,
  Shield,
  Crown,
  Calendar,
  Video,
  Clock,
  Sparkles,
  Zap,
  AlertTriangle,
  Trash2,
  Star,
  TrendingUp,
  BarChart3,
  Brain,
  Globe,
  X,
  Target,
  CreditCard,
  Bell,
  ChevronRight,
  Upload,
  ImagePlus,
} from "lucide-react";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { getInitials, cn } from "@/lib/utils";

// ============================================
// MOCK DATA
// ============================================
const userStats = [
  { icon: Video, label: "Total Meetings", value: "147", gradient: "from-cyan-500 to-blue-600" },
  { icon: Clock, label: "Hours Saved", value: "89.5", gradient: "from-[#9B5DE5] to-violet-600" },
  { icon: Zap, label: "Action Items", value: "234", gradient: "from-amber-500 to-orange-600" },
  { icon: Sparkles, label: "AI Summaries", value: "98", gradient: "from-emerald-500 to-green-600" },
];

const achievements = [
  { icon: Star, label: "Early Adopter", gradient: "from-amber-500 to-orange-500" },
  { icon: Video, label: "Meeting Pro", gradient: "from-cyan-500 to-blue-500" },
  { icon: Brain, label: "AI Enthusiast", gradient: "from-violet-500 to-purple-500" },
  { icon: Target, label: "Goal Crusher", gradient: "from-emerald-500 to-green-500" },
];

const planFeatures = {
  FREE: ["5 meetings per month", "30 min max duration", "Basic transcription", "Email support"],
  PRO: ["Unlimited meetings", "Unlimited duration", "AI summaries & action items", "100+ language support", "Priority support", "Custom integrations"],
  ENTERPRISE: ["Everything in Pro", "SSO & SAML authentication", "Admin dashboard", "Custom integrations", "Dedicated support", "SLA guarantee"],
};

const quickActions = [
  { icon: Shield, label: "Security Settings", description: "Enable 2FA, manage sessions", iconColor: "text-emerald-400" },
  { icon: Bell, label: "Notifications", description: "Configure alerts & emails", iconColor: "text-[#CAFF4B]" },
  { icon: CreditCard, label: "Billing", description: "Manage payment methods", iconColor: "text-[#9B5DE5]" },
  { icon: Globe, label: "Connected Apps", description: "Manage integrations", iconColor: "text-cyan-400" },
];

const recentActivity = [
  { type: "meeting", title: "Product Strategy Call", time: "2 hours ago" },
  { type: "summary", title: "AI Summary Generated", time: "3 hours ago" },
  { type: "action", title: "5 Action Items Created", time: "Yesterday" },
];

// Mock profile for demo/development
const mockProfile = {
  id: "demo-user",
  name: "Alex Johnson",
  email: "alex.johnson@meetverse.ai",
  image: null,
  subscriptionTier: "PRO" as const,
  createdAt: new Date("2024-01-15"),
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");

  // tRPC utilities for cache invalidation
  const utils = trpc.useUtils();

  // tRPC query - renders immediately with mock data, updates when real data arrives
  const { data: profile } = trpc.user.me.useQuery(undefined, {
    retry: 1,
    staleTime: 30000,
  });

  // Use real profile or mock data
  const displayProfile = profile || mockProfile;
  const subscriptionTier = displayProfile?.subscriptionTier || "FREE";

  // Handle file selection for avatar
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
        return;
      }
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
        setShowAvatarModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mutation for updating profile image
  const updateProfileImage = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      toast({ title: "Profile picture updated", description: "Your new profile picture has been saved." });
      setIsUploading(false);
      setShowAvatarModal(false);
      setAvatarPreview(null);
    },
    onError: (error) => {
      toast({ title: "Failed to update profile picture", description: error.message, variant: "destructive" });
      setIsUploading(false);
    },
  });

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarPreview) return;
    setIsUploading(true);

    try {
      // Get file type from data URL
      const typeMatch = avatarPreview.match(/data:([^;]+);/);
      const type = typeMatch ? typeMatch[1] : "image/jpeg";

      // Upload to server
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: avatarPreview, type }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url } = await response.json();

      // Update profile with new image URL
      updateProfileImage.mutate({ image: url });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  // Cancel avatar upload
  const handleCancelUpload = () => {
    setShowAvatarModal(false);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({ title: "Failed to update profile", description: error.message, variant: "destructive" });
    },
  });

  const handleEdit = () => {
    setName(displayProfile?.name || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile.mutate({ name });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(displayProfile?.name || "");
  };

  // Tier configuration
  const tierConfig = {
    FREE: { gradient: "from-slate-500 to-slate-600", badge: "bg-white/[0.05] text-white/60 border-white/[0.1]" },
    PRO: { gradient: "from-[#CAFF4B] to-[#9EF01A]", badge: "bg-[#CAFF4B]/10 text-[#CAFF4B] border-[#CAFF4B]/20" },
    ENTERPRISE: { gradient: "from-amber-500 to-orange-500", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  };
  const currentTier = tierConfig[subscriptionTier as keyof typeof tierConfig] || tierConfig.FREE;

  // No loading state - always render with available data (mock or real)

  return (
    <div className="min-h-full relative pb-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-ink" />
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(202,255,75,0.15) 0%, transparent 60%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(155,93,229,0.2) 0%, transparent 60%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(202,255,75,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(202,255,75,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* ============================================ */}
        {/* PROFILE HEADER CARD */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] overflow-hidden"
        >
          {/* Gradient top border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B]" />

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#CAFF4B]/5 to-[#9B5DE5]/5 rounded-full blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                {/* Hidden file input - placed outside for better accessibility */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="sr-only"
                  id="avatar-upload"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/40 to-[#9B5DE5]/40 rounded-3xl blur-xl opacity-60 pointer-events-none" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B] p-[2px]">
                  <div className="w-full h-full rounded-3xl bg-ink flex items-center justify-center text-3xl sm:text-4xl font-bold overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : displayProfile?.image ? (
                      <img src={displayProfile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] bg-clip-text text-transparent">
                        {getInitials(displayProfile?.name || displayProfile?.email || "U")}
                      </span>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 z-10 w-10 h-10 rounded-xl bg-ink/90 border border-white/[0.15] flex items-center justify-center hover:bg-[#CAFF4B]/20 hover:border-[#CAFF4B]/40 transition-all cursor-pointer shadow-lg"
                >
                  <Camera className="w-5 h-5 text-white/80 hover:text-[#CAFF4B]" />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {isEditing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="text-xl sm:text-2xl font-bold h-12 bg-white/[0.03] border-white/[0.1] text-white placeholder:text-white/30 focus:border-[#CAFF4B]/50 max-w-sm"
                    />
                  ) : (
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {displayProfile?.name || "Set your name"}
                    </h2>
                  )}
                  <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium w-fit", currentTier.badge)}>
                    <Crown className="w-4 h-4" />
                    {subscriptionTier}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/50">
                    <Mail className="w-4 h-4" />
                    <span>{displayProfile?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">Verified</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Member since {displayProfile?.createdAt
                      ? new Date(displayProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                      : "Unknown"}
                  </span>
                </div>

                {/* Achievements */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                    >
                      <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br flex items-center justify-center", achievement.gradient)}>
                        <achievement.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm text-white/70 font-medium">{achievement.label}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancel} className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white">
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={updateProfile.isPending} className="bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] hover:opacity-90 text-black font-semibold">
                        {updateProfile.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Check className="mr-2 h-4 w-4" /> Save Changes</>}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEdit} className="bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] text-white">
                      <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* STATS GRID */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {userStats.map((stat, i) => (
            <div
              key={i}
              className="group relative rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", stat.gradient)}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#CAFF4B] animate-pulse" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ============================================ */}
        {/* MAIN CONTENT GRID */}
        {/* ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] overflow-hidden h-full">
              <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", currentTier.gradient)} />
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", currentTier.gradient)}>
                      <Crown className={cn("w-7 h-7", subscriptionTier === "PRO" ? "text-black" : "text-white")} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{subscriptionTier} Plan</h3>
                      <p className="text-sm text-white/40">Your current subscription</p>
                    </div>
                  </div>
                  {subscriptionTier !== "ENTERPRISE" && (
                    <Button className="bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] hover:opacity-90 text-black font-semibold shadow-lg shadow-[#CAFF4B]/20">
                      <TrendingUp className="mr-2 h-4 w-4" /> Upgrade Plan
                    </Button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {(planFeatures[subscriptionTier as keyof typeof planFeatures] || planFeatures.FREE).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-[#CAFF4B]/10 border border-[#CAFF4B]/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#CAFF4B]" />
                      </div>
                      <span className="text-white/60">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Usage Progress */}
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/50">Monthly Usage</span>
                    <span className="text-sm text-white font-medium">12 / {subscriptionTier === "FREE" ? "5" : "unlimited"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#CAFF4B] to-[#9B5DE5] transition-all duration-1000"
                      style={{ width: subscriptionTier === "FREE" ? "100%" : "24%" }}
                    />
                  </div>
                  {subscriptionTier === "FREE" && (
                    <p className="text-xs text-amber-400 mt-2">You&apos;ve reached your monthly limit. Upgrade to continue.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions & Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#9B5DE5]/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#9B5DE5]" />
                </div>
                <h3 className="font-semibold text-white">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group text-left"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
                      <action.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", action.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{action.label}</p>
                      <p className="text-xs text-white/40 truncate">{action.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#CAFF4B]/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#CAFF4B]" />
                </div>
                <h3 className="font-semibold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      activity.type === "meeting" && "bg-cyan-500/10 text-cyan-400",
                      activity.type === "summary" && "bg-[#9B5DE5]/10 text-[#9B5DE5]",
                      activity.type === "action" && "bg-[#CAFF4B]/10 text-[#CAFF4B]"
                    )}>
                      {activity.type === "meeting" && <Video className="w-4 h-4" />}
                      {activity.type === "summary" && <Brain className="w-4 h-4" />}
                      {activity.type === "action" && <Target className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{activity.title}</p>
                      <p className="text-xs text-white/40">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================ */}
        {/* DANGER ZONE */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-2xl bg-red-500/[0.02] border border-red-500/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Danger Zone</h3>
                <p className="text-sm text-white/50 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <AnimatePresence mode="wait">
                  {showDeleteConfirm ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-wrap gap-3"
                    >
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white">
                        Cancel
                      </Button>
                      <Button className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20">
                        <Trash2 className="mr-2 h-4 w-4" /> Confirm Delete
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="delete"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Avatar Upload Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleCancelUpload}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl bg-[#0d0d0d] border border-white/[0.08] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCancelUpload}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Update Profile Picture</h3>
                  <p className="text-sm text-white/40">Preview your new photo</p>
                </div>
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/40 to-[#9B5DE5]/40 rounded-3xl blur-xl opacity-60" />
                  <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B] p-[2px]">
                    <div className="w-full h-full rounded-3xl bg-ink overflow-hidden">
                      {avatarPreview && (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white"
                >
                  <Upload className="mr-2 h-4 w-4" /> Choose Different
                </Button>
                <Button
                  onClick={handleAvatarUpload}
                  disabled={isUploading}
                  className="flex-1 bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] hover:opacity-90 text-black font-semibold"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Save Photo
                    </>
                  )}
                </Button>
              </div>

              {/* Tip */}
              <p className="text-xs text-white/30 text-center mt-4">
                Recommended: Square image, at least 200x200 pixels
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
