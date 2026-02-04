"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Video,
  Mic,
  Loader2,
  Check,
  Settings,
  Palette,
  Globe,
  Clock,
  Volume2,
  Shield,
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  FileText,
  BellRing,
  Mail,
  Smartphone,
  Calendar,
  Users,
  Lock,
  Eye,
  Download,
  ChevronDown,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// ============================================
// ANIMATION VARIANTS
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
// GLASS CARD COMPONENT
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
        "bg-[#111111]/80 backdrop-blur-xl",
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
// CUSTOM TOGGLE SWITCH
// ============================================
function ToggleSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <motion.button
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors duration-300",
        checked ? "bg-lime" : "bg-white/[0.1]"
      )}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={cn(
          "absolute top-1 w-5 h-5 rounded-full shadow-md",
          checked ? "bg-ink" : "bg-white/60"
        )}
        animate={{ left: checked ? "calc(100% - 24px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

// ============================================
// CUSTOM SELECT DROPDOWN
// ============================================
function CustomSelect({
  value,
  options,
  onChange,
  className = "",
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("relative", className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm min-w-[140px] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
        whileTap={{ scale: 0.98 }}
      >
        <span>{selectedOption?.label || value}</span>
        <ChevronDown className={cn("w-4 h-4 text-white/50 transition-transform", isOpen && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-full rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-colors",
                    option.value === value
                      ? "bg-lime/10 text-lime"
                      : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SETTINGS SECTION COMPONENT
// ============================================
function SettingsSection({
  icon: Icon,
  title,
  iconBg = "bg-lime/10",
  iconColor = "text-lime",
  children,
}: {
  icon: React.ElementType;
  title: string;
  iconBg?: string;
  iconColor?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={itemVariants}>
      <GlassCard hover={false}>
        <div className="p-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
              <Icon className={cn("w-5 h-5", iconColor)} />
            </div>
            <h3 className="text-base font-medium text-white/70">{title}</h3>
          </div>

          {/* Section Content */}
          <div className="space-y-3">{children}</div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ============================================
// SETTING ROW COMPONENT
// ============================================
function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
          <Icon className="w-4 h-4 text-white/50" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-white/40">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ============================================
// THEME BUTTON COMPONENT
// ============================================
function ThemeButton({
  value,
  currentTheme,
  icon: Icon,
  label,
  onClick,
}: {
  value: string;
  currentTheme: string | undefined;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  const isActive = currentTheme === value;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex-1 flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-300",
        isActive
          ? "bg-lime/5 border-lime/30"
          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTheme"
          className="absolute inset-0 bg-lime/5 rounded-xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div
        className={cn(
          "relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
          isActive ? "bg-lime/20" : "bg-white/[0.05]"
        )}
      >
        <Icon className={cn("w-6 h-6", isActive ? "text-lime" : "text-white/50")} />
      </div>
      <span className={cn("text-sm font-medium relative", isActive ? "text-white" : "text-white/50")}>
        {label}
      </span>
      {isActive && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
          <Check className="w-4 h-4 text-lime" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ============================================
// MAIN SETTINGS PAGE
// ============================================
export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [summaryEmails, setSummaryEmails] = useState(true);
  const [defaultVideoEnabled, setDefaultVideoEnabled] = useState(true);
  const [defaultAudioEnabled, setDefaultAudioEnabled] = useState(true);
  const [aiAssistant, setAiAssistant] = useState(true);
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/New_York");

  // Fetch profile with error handling - don't block UI on failure
  const { data: profile, isLoading, isError } = trpc.user.me.useQuery(undefined, {
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000,
  });

  const updatePreferences = trpc.user.updatePreferences.useMutation({
    onSuccess: () => {
      setHasChanges(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle client-side mounting for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load preferences from profile when available
  useEffect(() => {
    if (profile?.preferences) {
      try {
        const prefs = JSON.parse(profile.preferences);
        if (prefs.emailNotifications !== undefined) setEmailNotifications(prefs.emailNotifications);
        if (prefs.defaultVideoEnabled !== undefined) setDefaultVideoEnabled(prefs.defaultVideoEnabled);
        if (prefs.defaultAudioEnabled !== undefined) setDefaultAudioEnabled(prefs.defaultAudioEnabled);
        if (prefs.language) setLanguage(prefs.language);
        if (prefs.timezone) setTimezone(prefs.timezone);
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [profile]);

  // Show error toast if profile fails to load (but don't block UI)
  useEffect(() => {
    if (isError) {
      toast({
        title: "Could not load preferences",
        description: "Using default settings. Your changes will still be saved.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  const handleSettingChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePreferences.mutate({
      emailNotifications,
      defaultVideoEnabled,
      defaultAudioEnabled,
      language,
      timezone,
    });
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "zh", label: "Chinese" },
    { value: "ko", label: "Korean" },
    { value: "pt", label: "Portuguese" },
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern (ET)" },
    { value: "America/Chicago", label: "Central (CT)" },
    { value: "America/Denver", label: "Mountain (MT)" },
    { value: "America/Los_Angeles", label: "Pacific (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
  ];

  // Only wait for client-side mounting (for theme hydration), not for data loading
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-lime/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-lime flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-ink" />
            </div>
          </div>
          <p className="text-white/40 text-sm">Loading settings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen text-white pb-24"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: 15 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-lime/30 blur-2xl rounded-full" />
            <div className="relative w-14 h-14 rounded-2xl bg-lime flex items-center justify-center shadow-xl shadow-lime/25">
              <Settings className="w-7 h-7 text-ink" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-white/40 text-sm mt-0.5">Customize your MeetVerse AI experience</p>
          </div>
        </div>

        {/* Subtle loading indicator when fetching profile */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-lime" />
              <span className="text-xs text-white/40">Syncing...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pro Tip Banner */}
      <motion.div variants={itemVariants} className="mb-6">
        <GlassCard hover={false} className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-lime/[0.03] via-transparent to-purple/[0.03]" />
          <div className="relative p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-lime" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Pro Tip</p>
                <p className="text-xs text-white/40">Enable AI features for smarter meetings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="space-y-5">
        {/* Appearance Section */}
        <SettingsSection icon={Palette} title="Customize the look and feel" iconBg="bg-rose-500/10" iconColor="text-rose-400">
          <div className="flex gap-3">
            <ThemeButton value="light" currentTheme={theme} icon={Sun} label="Light" onClick={() => setTheme("light")} />
            <ThemeButton value="dark" currentTheme={theme} icon={Moon} label="Dark" onClick={() => setTheme("dark")} />
            <ThemeButton value="system" currentTheme={theme} icon={Monitor} label="System" onClick={() => setTheme("system")} />
          </div>
        </SettingsSection>

        {/* Language & Region Section */}
        <SettingsSection icon={Globe} title="Set your preferred language and timezone" iconBg="bg-emerald-500/10" iconColor="text-emerald-400">
          <SettingRow icon={Globe} label="Language" description="Select your preferred language">
            <CustomSelect value={language} options={languageOptions} onChange={(v) => handleSettingChange(setLanguage, v)} />
          </SettingRow>
          <SettingRow icon={Clock} label="Timezone" description="Your local timezone for scheduling">
            <CustomSelect value={timezone} options={timezoneOptions} onChange={(v) => handleSettingChange(setTimezone, v)} className="min-w-[160px]" />
          </SettingRow>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection icon={Bell} title="Control how you receive updates" iconBg="bg-amber-500/10" iconColor="text-amber-400">
          <SettingRow icon={Mail} label="Email Notifications" description="Receive meeting reminders and summaries">
            <ToggleSwitch checked={emailNotifications} onCheckedChange={(v) => handleSettingChange(setEmailNotifications, v)} />
          </SettingRow>
          <SettingRow icon={Smartphone} label="Push Notifications" description="Get notified on your devices">
            <ToggleSwitch checked={pushNotifications} onCheckedChange={(v) => handleSettingChange(setPushNotifications, v)} />
          </SettingRow>
          <SettingRow icon={BellRing} label="Meeting Reminders" description="Get reminded before meetings start">
            <ToggleSwitch checked={meetingReminders} onCheckedChange={(v) => handleSettingChange(setMeetingReminders, v)} />
          </SettingRow>
          <SettingRow icon={FileText} label="Summary Emails" description="Receive AI-generated meeting summaries">
            <ToggleSwitch checked={summaryEmails} onCheckedChange={(v) => handleSettingChange(setSummaryEmails, v)} />
          </SettingRow>
        </SettingsSection>

        {/* Meeting Defaults Section */}
        <SettingsSection icon={Video} title="Default settings when joining meetings" iconBg="bg-sky-500/10" iconColor="text-sky-400">
          <SettingRow icon={Video} label="Camera On by Default" description="Start with camera enabled">
            <ToggleSwitch checked={defaultVideoEnabled} onCheckedChange={(v) => handleSettingChange(setDefaultVideoEnabled, v)} />
          </SettingRow>
          <SettingRow icon={Mic} label="Microphone On by Default" description="Start with microphone enabled">
            <ToggleSwitch checked={defaultAudioEnabled} onCheckedChange={(v) => handleSettingChange(setDefaultAudioEnabled, v)} />
          </SettingRow>
          <SettingRow icon={Volume2} label="Speaker Test" description="Test your audio output">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              Test
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </SettingRow>
        </SettingsSection>

        {/* AI Features Section */}
        <SettingsSection icon={Brain} title="Configure AI-powered capabilities" iconBg="bg-purple/10" iconColor="text-purple">
          <SettingRow icon={Sparkles} label="AI Assistant" description="Enable real-time meeting assistance">
            <ToggleSwitch checked={aiAssistant} onCheckedChange={(v) => handleSettingChange(setAiAssistant, v)} />
          </SettingRow>
          <SettingRow icon={MessageSquare} label="Auto Transcription" description="Automatically transcribe meetings">
            <ToggleSwitch checked={autoTranscribe} onCheckedChange={(v) => handleSettingChange(setAutoTranscribe, v)} />
          </SettingRow>
          <SettingRow icon={Zap} label="Smart Suggestions" description="Get AI-powered meeting insights">
            <Badge className="bg-purple/15 text-purple border-purple/20 text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Pro
            </Badge>
          </SettingRow>
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection icon={Shield} title="Manage your data and security settings" iconBg="bg-slate-500/10" iconColor="text-slate-400">
          <SettingRow icon={Eye} label="Profile Visibility" description="Control who can see your profile">
            <CustomSelect
              value="team"
              options={[
                { value: "public", label: "Public" },
                { value: "team", label: "Team Only" },
                { value: "private", label: "Private" },
              ]}
              onChange={() => setHasChanges(true)}
            />
          </SettingRow>
          <SettingRow icon={Lock} label="Two-Factor Authentication" description="Add an extra layer of security">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              Enable
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </SettingRow>
          <SettingRow icon={Calendar} label="Calendar Access" description="Manage connected calendars">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              Manage
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </SettingRow>
          <SettingRow icon={Users} label="Team Permissions" description="Configure team access levels">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/70 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              Configure
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </SettingRow>
        </SettingsSection>
      </div>

      {/* Floating Save Button */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <GlassCard hover={false} className="shadow-2xl shadow-black/50">
              <div className="p-4 flex items-center gap-4">
                <p className="text-sm text-white/50">You have unsaved changes</p>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setHasChanges(false)}
                    className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    Discard
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(202,255,75,0.25)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={updatePreferences.isPending}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-lime text-ink disabled:opacity-50"
                  >
                    {updatePreferences.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
