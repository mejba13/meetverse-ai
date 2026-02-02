"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { getInitials, cn } from "@/lib/utils";

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// MOCK DATA FOR STATS
// ============================================
const userStats = {
  totalMeetings: 147,
  hoursInMeetings: 89.5,
  actionItemsCreated: 234,
  aiSummariesGenerated: 98,
};

const achievements = [
  { icon: Star, label: "Early Adopter", color: "from-amber-500 to-orange-500" },
  { icon: Video, label: "Meeting Pro", color: "from-cyan-500 to-blue-500" },
  { icon: Brain, label: "AI Enthusiast", color: "from-violet-500 to-purple-500" },
];

const planFeatures = {
  FREE: [
    "5 meetings per month",
    "30 min max duration",
    "Basic transcription",
  ],
  PRO: [
    "Unlimited meetings",
    "Unlimited duration",
    "AI summaries & action items",
    "100+ language support",
    "Priority support",
  ],
  ENTERPRISE: [
    "Everything in Pro",
    "SSO & SAML",
    "Admin dashboard",
    "Custom integrations",
    "Dedicated support",
  ],
};

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
      <Card className="border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/50">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: profile, isLoading } = trpc.user.me.useQuery();

  const [name, setName] = useState("");

  const handleEdit = () => {
    if (profile) {
      setName(profile.name || "");
    }
    setIsEditing(true);
  };

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfile.mutate({ name });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setName(profile.name || "");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  const subscriptionTier = profile?.subscriptionTier || "FREE";
  const tierColors = {
    FREE: "from-slate-500 to-slate-600",
    PRO: "from-cyan-500 to-violet-500",
    ENTERPRISE: "from-amber-500 to-orange-500",
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Profile Header Card */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-500" />

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl" />

            <CardContent className="p-8 relative">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Avatar Section */}
                <div className="relative group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 via-violet-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-violet-500/25">
                    {profile?.image ? (
                      <img src={profile.image} alt="Profile" className="w-full h-full rounded-3xl object-cover" />
                    ) : (
                      getInitials(profile?.name || profile?.email || "U")
                    )}
                  </div>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm"
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </Button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {isEditing ? (
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="text-2xl font-bold h-12 bg-white/[0.03] border-white/[0.08] text-white max-w-xs"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-white tracking-tight">
                        {profile?.name || "Set your name"}
                      </h1>
                    )}
                    <Badge className={cn(
                      "w-fit gap-1.5 px-3 py-1",
                      subscriptionTier === "PRO" && "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 border-cyan-500/30",
                      subscriptionTier === "ENTERPRISE" && "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
                      subscriptionTier === "FREE" && "bg-white/10 text-white/60 border-white/20"
                    )}>
                      <Crown className="w-3.5 h-3.5" />
                      {subscriptionTier}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-white/50">
                    <Mail className="w-4 h-4" />
                    <span>{profile?.email}</span>
                    <Badge variant="outline" className="ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })
                      : "Unknown"}</span>
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                      >
                        <div className={cn("w-5 h-5 rounded-md bg-gradient-to-br flex items-center justify-center", achievement.color)}>
                          <achievement.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-white/60">{achievement.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={updateProfile.isPending}
                          className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white"
                        >
                          {updateProfile.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleEdit}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Video}
            label="Total Meetings"
            value={userStats.totalMeetings}
            color="bg-gradient-to-br from-cyan-500 to-cyan-600"
          />
          <StatCard
            icon={Clock}
            label="Hours in Meetings"
            value={userStats.hoursInMeetings}
            color="bg-gradient-to-br from-violet-500 to-violet-600"
          />
          <StatCard
            icon={Zap}
            label="Action Items"
            value={userStats.actionItemsCreated}
            color="bg-gradient-to-br from-amber-500 to-orange-600"
          />
          <StatCard
            icon={Sparkles}
            label="AI Summaries"
            value={userStats.aiSummariesGenerated}
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm overflow-hidden">
              <div className={cn(
                "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r",
                tierColors[subscriptionTier as keyof typeof tierColors]
              )} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                        tierColors[subscriptionTier as keyof typeof tierColors]
                      )}>
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{subscriptionTier} Plan</h2>
                        <p className="text-sm text-white/50">Your current subscription</p>
                      </div>
                    </div>
                  </div>
                  {subscriptionTier !== "ENTERPRISE" && (
                    <Button className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-violet-500/25">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {planFeatures[subscriptionTier as keyof typeof planFeatures]?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Card className="border-white/[0.06] bg-white/[0.02]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-white">Security</h3>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    <Shield className="mr-2 h-4 w-4 text-cyan-400" />
                    Enable 2FA
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    <Globe className="mr-2 h-4 w-4 text-violet-400" />
                    Connected Apps
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/[0.06] bg-white/[0.02]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">Usage</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Meetings this month</span>
                    <span className="text-white font-medium">12 / unlimited</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">Danger Zone</h3>
                  <p className="text-sm text-white/50 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <AnimatePresence>
                    {showDeleteConfirm ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-3"
                      >
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Confirm Delete
                        </Button>
                      </motion.div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
