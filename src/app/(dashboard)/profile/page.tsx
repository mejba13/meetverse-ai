"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  User,
} from "lucide-react";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { getInitials, cn } from "@/lib/utils";

// ============================================
// ANIMATION VARIANTS (matches settings page)
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// GLASS CARD COMPONENT (matches settings page)
// ============================================
function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-carbon/80 backdrop-blur-xl",
        "border border-white/[0.06]",
        hover && "hover:border-lime/20 transition-all duration-400",
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// MOCK DATA
// ============================================
const userStats = [
  { icon: Video, label: "Total Meetings", value: "147", color: "text-cyan-400", bg: "bg-cyan-500/10", glow: "shadow-cyan-500/20" },
  { icon: Clock, label: "Hours Saved", value: "89.5", color: "text-purple", bg: "bg-purple/10", glow: "shadow-purple/20" },
  { icon: Zap, label: "Action Items", value: "234", color: "text-amber-400", bg: "bg-amber-500/10", glow: "shadow-amber-500/20" },
  { icon: Sparkles, label: "AI Summaries", value: "98", color: "text-lime", bg: "bg-lime/10", glow: "shadow-lime/20" },
];

const achievements = [
  { icon: Star, label: "Early Adopter", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: Video, label: "Meeting Pro", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { icon: Brain, label: "AI Enthusiast", color: "text-purple", bg: "bg-purple/10", border: "border-purple/20" },
  { icon: Target, label: "Goal Crusher", color: "text-lime", bg: "bg-lime/10", border: "border-lime/20" },
];

const planFeatures = {
  FREE: ["5 meetings per month", "30 min max duration", "Basic transcription", "Email support"],
  PRO: ["Unlimited meetings", "Unlimited duration", "AI summaries & action items", "100+ language support", "Priority support", "Custom integrations"],
  ENTERPRISE: ["Everything in Pro", "SSO & SAML authentication", "Admin dashboard", "Custom integrations", "Dedicated support", "SLA guarantee"],
};

const quickActions = [
  { icon: Shield, label: "Security Settings", description: "Enable 2FA, manage sessions", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Bell, label: "Notifications", description: "Configure alerts & emails", color: "text-lime", bg: "bg-lime/10" },
  { icon: CreditCard, label: "Billing", description: "Manage payment methods", color: "text-purple", bg: "bg-purple/10" },
  { icon: Globe, label: "Connected Apps", description: "Manage integrations", color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const recentActivity = [
  { type: "meeting", title: "Product Strategy Call", time: "2 hours ago" },
  { type: "summary", title: "AI Summary Generated", time: "3 hours ago" },
  { type: "action", title: "5 Action Items Created", time: "Yesterday" },
  { type: "meeting", title: "Design Review", time: "2 days ago" },
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
// LOCAL STORAGE HELPERS
// ============================================
function getLocalProfile() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("meetverse-profile");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveLocalProfile(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalProfile() || {};
    localStorage.setItem("meetverse-profile", JSON.stringify({ ...existing, ...data }));
  } catch {
    // Ignore storage errors
  }
}

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
  const [localProfile, setLocalProfile] = useState<Record<string, unknown> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved local profile on mount
  useEffect(() => {
    const saved = getLocalProfile();
    if (saved) setLocalProfile(saved);
  }, []);

  // tRPC utilities
  const utils = trpc.useUtils();

  const { data: profile } = trpc.user.me.useQuery(undefined, {
    retry: 1,
    staleTime: 30000,
  });

  // Merge: real profile > local overrides > mock data
  const baseProfile = profile || mockProfile;
  const displayProfile = {
    ...baseProfile,
    ...(localProfile || {}),
    image: (localProfile?.image as string) || baseProfile?.image || null,
    name: (localProfile?.name as string) || baseProfile?.name || "",
  };
  const subscriptionTier = displayProfile?.subscriptionTier || "FREE";

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
        setShowAvatarModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Avatar upload mutation
  const updateProfileImage = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      toast({ title: "Profile picture updated", description: "Your new profile picture has been saved." });
      setIsUploading(false);
      setShowAvatarModal(false);
      setAvatarPreview(null);
    },
    onError: () => {
      if (avatarPreview) {
        saveLocalProfile({ image: avatarPreview });
        setLocalProfile((prev) => ({ ...(prev || {}), image: avatarPreview }));
        toast({ title: "Profile picture updated", description: "Your photo has been saved locally." });
      }
      setIsUploading(false);
      setShowAvatarModal(false);
      setAvatarPreview(null);
    },
  });

  const handleAvatarUpload = async () => {
    if (!avatarPreview) return;
    setIsUploading(true);
    try {
      const typeMatch = avatarPreview.match(/data:([^;]+);/);
      const type = typeMatch ? typeMatch[1] : "image/jpeg";
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: avatarPreview, type }),
      });
      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();
      updateProfileImage.mutate({ image: url });
    } catch {
      saveLocalProfile({ image: avatarPreview });
      setLocalProfile((prev) => ({ ...(prev || {}), image: avatarPreview }));
      toast({ title: "Profile picture updated", description: "Your photo has been saved locally." });
      setIsUploading(false);
      setShowAvatarModal(false);
      setAvatarPreview(null);
    }
  };

  const handleCancelUpload = () => {
    setShowAvatarModal(false);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Profile name mutation
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
      setIsEditing(false);
      setIsSaving(false);
    },
    onError: () => {
      saveLocalProfile({ name });
      setLocalProfile((prev) => ({ ...(prev || {}), name }));
      toast({ title: "Profile updated", description: "Your profile has been saved locally." });
      setIsEditing(false);
      setIsSaving(false);
    },
  });

  const handleEdit = () => {
    setName(displayProfile?.name || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    updateProfile.mutate({ name: name.trim() });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(displayProfile?.name || "");
  };

  // Tier styling config
  const tierConfig = {
    FREE: { gradient: "from-slate-500 to-slate-600", badge: "bg-white/[0.05] text-white/60 border-white/[0.1]", iconColor: "text-white" },
    PRO: { gradient: "from-lime to-lime-500", badge: "bg-lime/10 text-lime border-lime/20", iconColor: "text-ink" },
    ENTERPRISE: { gradient: "from-amber-500 to-orange-500", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", iconColor: "text-white" },
  };
  const currentTier = tierConfig[subscriptionTier as keyof typeof tierConfig] || tierConfig.FREE;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen text-white pb-24"
    >
      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-purple/30 blur-2xl rounded-full" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-lime to-purple flex items-center justify-center shadow-xl shadow-lime/25">
              <User className="w-7 h-7 text-ink" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Profile</h1>
            <p className="text-white/40 text-sm mt-0.5">Manage your account and preferences</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* ============================================ */}
        {/* PROFILE HEADER CARD */}
        {/* ============================================ */}
        <motion.div variants={itemVariants}>
          <GlassCard hover={false}>
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-lime via-purple to-lime" />

            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-lime/5 to-purple/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
                {/* Avatar */}
                <div className="relative group flex-shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="sr-only"
                    id="avatar-upload"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-lime/30 to-purple/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-lime via-purple to-lime p-[2px] shadow-lg shadow-purple/20">
                    <div className="w-full h-full rounded-3xl bg-ink flex items-center justify-center text-3xl sm:text-4xl font-bold overflow-hidden">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : displayProfile?.image ? (
                        <img src={displayProfile.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="bg-gradient-to-br from-lime to-purple bg-clip-text text-transparent">
                          {getInitials(displayProfile?.name || displayProfile?.email || "U")}
                        </span>
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 z-10 w-10 h-10 rounded-xl bg-obsidian border border-white/[0.15] flex items-center justify-center hover:bg-lime/20 hover:border-lime/40 hover:shadow-glow-lime transition-all cursor-pointer shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-white/70 group-hover:text-lime transition-colors" />
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
                        className="text-xl sm:text-2xl font-bold h-12 bg-white/[0.03] border-white/[0.1] text-white placeholder:text-white/30 focus:border-lime/50 focus:ring-lime/20 max-w-sm"
                        autoFocus
                      />
                    ) : (
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {displayProfile?.name || "Set your name"}
                      </h2>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium w-fit", currentTier.badge)}
                    >
                      <Crown className="w-4 h-4" />
                      {subscriptionTier}
                    </motion.div>
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
                      Member since{" "}
                      {displayProfile?.createdAt
                        ? new Date(displayProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
                        : "Unknown"}
                    </span>
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-xl border cursor-default transition-colors",
                          achievement.bg, achievement.border,
                          "hover:bg-white/[0.05]"
                        )}
                      >
                        <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center", achievement.bg)}>
                          <achievement.icon className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5", achievement.color)} />
                        </div>
                        <span className="text-xs sm:text-sm text-white/70 font-medium">{achievement.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          key="editing"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex gap-3"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(202,255,75,0.25)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={isSaving || updateProfile.isPending}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-lime text-ink disabled:opacity-50 shadow-lg shadow-lime/20"
                          >
                            {(isSaving || updateProfile.isPending) ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                            ) : (
                              <><Check className="w-4 h-4" /> Save Changes</>
                            )}
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="edit-btn"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleEdit}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:border-lime/20 hover:text-white transition-all"
                        >
                          <Edit3 className="w-4 h-4" /> Edit Profile
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ============================================ */}
        {/* STATS GRID */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg", stat.bg, stat.glow)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", stat.color === "text-lime" ? "bg-lime" : stat.color === "text-purple" ? "bg-purple" : stat.color === "text-cyan-400" ? "bg-cyan-400" : "bg-amber-400")} />
                      <span className={cn("relative inline-flex h-2 w-2 rounded-full", stat.color === "text-lime" ? "bg-lime" : stat.color === "text-purple" ? "bg-purple" : stat.color === "text-cyan-400" ? "bg-cyan-400" : "bg-amber-400")} />
                    </span>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* ============================================ */}
        {/* MAIN CONTENT GRID */}
        {/* ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard hover={false} className="h-full">
              <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", currentTier.gradient)} />

              {/* Subtle glow decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-lime/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className={cn("w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", currentTier.gradient)}
                    >
                      <Crown className={cn("w-7 h-7", currentTier.iconColor)} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{subscriptionTier} Plan</h3>
                      <p className="text-sm text-white/40">Your current subscription</p>
                    </div>
                  </div>
                  {subscriptionTier !== "ENTERPRISE" && (
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(202,255,75,0.25)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-lime text-ink shadow-lg shadow-lime/20"
                    >
                      <TrendingUp className="w-4 h-4" /> Upgrade Plan
                    </motion.button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {(planFeatures[subscriptionTier as keyof typeof planFeatures] || planFeatures.FREE).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-lime" />
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: subscriptionTier === "FREE" ? "100%" : "24%" }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-lime to-purple"
                    />
                  </div>
                  {subscriptionTier === "FREE" && (
                    <p className="text-xs text-amber-400 mt-2">You&apos;ve reached your monthly limit. Upgrade to continue.</p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions & Activity Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Quick Actions */}
            <GlassCard hover={false}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple" />
                  </div>
                  <h3 className="font-semibold text-white">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group text-left"
                    >
                      <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center", action.bg)}>
                        <action.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", action.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{action.label}</p>
                        <p className="text-xs text-white/40 truncate">{action.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-lime group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard hover={false}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-lime/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-lime" />
                  </div>
                  <h3 className="font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-1">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors border-b border-white/[0.04] last:border-0"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          activity.type === "meeting" && "bg-cyan-500/10 text-cyan-400",
                          activity.type === "summary" && "bg-purple/10 text-purple",
                          activity.type === "action" && "bg-lime/10 text-lime"
                        )}
                      >
                        {activity.type === "meeting" && <Video className="w-4 h-4" />}
                        {activity.type === "summary" && <Brain className="w-4 h-4" />}
                        {activity.type === "action" && <Target className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{activity.title}</p>
                        <p className="text-xs text-white/40">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ============================================ */}
        {/* DANGER ZONE */}
        {/* ============================================ */}
        <motion.div variants={itemVariants}>
          <div className="relative rounded-2xl bg-red-500/[0.03] backdrop-blur-xl border border-red-500/15 overflow-hidden p-6">
            {/* Subtle red glow */}
            <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
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
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Confirm Delete
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="delete"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* AVATAR UPLOAD MODAL */}
      {/* ============================================ */}
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
              className="relative w-full max-w-md rounded-2xl bg-obsidian border border-white/[0.08] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-lime via-purple to-lime rounded-t-2xl" />

              {/* Close button */}
              <button
                onClick={handleCancelUpload}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime to-purple flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Update Profile Picture</h3>
                  <p className="text-sm text-white/40">Preview your new photo</p>
                </div>
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-lime/30 to-purple/30 rounded-3xl blur-xl opacity-60" />
                  <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-lime via-purple to-lime p-[2px]">
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  <Upload className="w-4 h-4" /> Choose Different
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(202,255,75,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAvatarUpload}
                  disabled={isUploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-lime text-ink disabled:opacity-50 shadow-lg shadow-lime/20"
                >
                  {isUploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Check className="w-4 h-4" /> Save Photo</>
                  )}
                </motion.button>
              </div>

              {/* Tip */}
              <p className="text-xs text-white/30 text-center mt-4">
                Recommended: Square image, at least 200x200 pixels
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
