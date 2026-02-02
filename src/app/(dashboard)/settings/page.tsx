"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ChevronRight,
  Info,
} from "lucide-react";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// FLOATING PARTICLES
// ============================================
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-400/30"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// SETTINGS SECTION COMPONENT
// ============================================
interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  children: React.ReactNode;
}

function SettingsSection({ icon: Icon, title, description, gradient, children }: SettingsSectionProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden bg-white/[0.02] border-white/[0.08] backdrop-blur-xl hover:border-white/[0.12] transition-all duration-300 group">
        {/* Gradient Border Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        <CardContent className="p-6">
          {/* Section Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-white/50">{description}</p>
            </div>
          </div>

          {/* Section Content */}
          <div className="space-y-4">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// SETTING ROW COMPONENT
// ============================================
interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ icon: Icon, label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/[0.05]">
          <Icon className="w-4 h-4 text-white/60" />
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
interface ThemeButtonProps {
  value: string;
  currentTheme: string | undefined;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function ThemeButton({ value, currentTheme, icon: Icon, label, onClick }: ThemeButtonProps) {
  const isActive = currentTheme === value;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border-cyan-500/50"
          : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12]"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTheme"
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className={`relative p-3 rounded-xl ${isActive ? "bg-gradient-to-br from-cyan-500 to-violet-500" : "bg-white/[0.08]"}`}>
        <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/60"}`} />
      </div>
      <span className={`text-sm font-medium ${isActive ? "text-white" : "text-white/60"}`}>{label}</span>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <Check className="w-4 h-4 text-cyan-400" />
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

  const { data: profile, isLoading } = trpc.user.me.useQuery();

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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-4 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </div>
          <p className="text-white/50 text-sm">Loading settings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24">
      <FloatingParticles />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-white/50">
            Customize your MeetVerse AI experience
          </p>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-purple-500/10 border-white/[0.08] backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Pro Tip</p>
                    <p className="text-xs text-white/50">Enable AI features for smarter meetings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Help
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Section */}
        <SettingsSection
          icon={Palette}
          title="Appearance"
          description="Customize the look and feel"
          gradient="from-pink-500 to-rose-600"
        >
          {/* Theme Selection */}
          <div className="space-y-3">
            <p className="text-sm text-white/60 mb-3">Theme</p>
            <div className="flex gap-3">
              <ThemeButton
                value="light"
                currentTheme={theme}
                icon={Sun}
                label="Light"
                onClick={() => setTheme("light")}
              />
              <ThemeButton
                value="dark"
                currentTheme={theme}
                icon={Moon}
                label="Dark"
                onClick={() => setTheme("dark")}
              />
              <ThemeButton
                value="system"
                currentTheme={theme}
                icon={Monitor}
                label="System"
                onClick={() => setTheme("system")}
              />
            </div>
          </div>
        </SettingsSection>

        {/* Localization Section */}
        <SettingsSection
          icon={Globe}
          title="Language & Region"
          description="Set your preferred language and timezone"
          gradient="from-emerald-500 to-green-600"
        >
          <SettingRow
            icon={Globe}
            label="Language"
            description="Select your preferred language"
          >
            <Select value={language} onValueChange={(v) => handleSettingChange(setLanguage, v)}>
              <SelectTrigger className="w-[180px] bg-white/[0.05] border-white/[0.1] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/[0.1]">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            icon={Clock}
            label="Timezone"
            description="Your local timezone for scheduling"
          >
            <Select value={timezone} onValueChange={(v) => handleSettingChange(setTimezone, v)}>
              <SelectTrigger className="w-[200px] bg-white/[0.05] border-white/[0.1] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/[0.1]">
                <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Control how you receive updates"
          gradient="from-amber-500 to-orange-600"
        >
          <SettingRow
            icon={Mail}
            label="Email Notifications"
            description="Receive meeting reminders and summaries"
          >
            <Switch
              checked={emailNotifications}
              onCheckedChange={(v) => handleSettingChange(setEmailNotifications, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>

          <SettingRow
            icon={Smartphone}
            label="Push Notifications"
            description="Get notified on your devices"
          >
            <Switch
              checked={pushNotifications}
              onCheckedChange={(v) => handleSettingChange(setPushNotifications, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>

          <SettingRow
            icon={BellRing}
            label="Meeting Reminders"
            description="Get reminded before meetings start"
          >
            <Switch
              checked={meetingReminders}
              onCheckedChange={(v) => handleSettingChange(setMeetingReminders, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>

          <SettingRow
            icon={FileText}
            label="Summary Emails"
            description="Receive AI-generated meeting summaries"
          >
            <Switch
              checked={summaryEmails}
              onCheckedChange={(v) => handleSettingChange(setSummaryEmails, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>
        </SettingsSection>

        {/* Meeting Defaults Section */}
        <SettingsSection
          icon={Video}
          title="Meeting Defaults"
          description="Default settings when joining meetings"
          gradient="from-cyan-500 to-blue-600"
        >
          <SettingRow
            icon={Video}
            label="Camera On by Default"
            description="Start with camera enabled"
          >
            <Switch
              checked={defaultVideoEnabled}
              onCheckedChange={(v) => handleSettingChange(setDefaultVideoEnabled, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>

          <SettingRow
            icon={Mic}
            label="Microphone On by Default"
            description="Start with microphone enabled"
          >
            <Switch
              checked={defaultAudioEnabled}
              onCheckedChange={(v) => handleSettingChange(setDefaultAudioEnabled, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>

          <SettingRow
            icon={Volume2}
            label="Speaker Test"
            description="Test your audio output"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]"
            >
              Test
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </SettingRow>
        </SettingsSection>

        {/* AI Features Section */}
        <SettingsSection
          icon={Brain}
          title="AI Features"
          description="Configure AI-powered capabilities"
          gradient="from-violet-500 to-purple-600"
        >
          <SettingRow
            icon={Sparkles}
            label="AI Assistant"
            description="Enable real-time meeting assistance"
          >
            <Switch
              checked={aiAssistant}
              onCheckedChange={(v) => handleSettingChange(setAiAssistant, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>

          <SettingRow
            icon={MessageSquare}
            label="Auto Transcription"
            description="Automatically transcribe meetings"
          >
            <Switch
              checked={autoTranscribe}
              onCheckedChange={(v) => handleSettingChange(setAutoTranscribe, v)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
            />
          </SettingRow>

          <SettingRow
            icon={Zap}
            label="Smart Suggestions"
            description="Get AI-powered meeting insights"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400 hover:bg-violet-500/30"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Pro
            </Button>
          </SettingRow>
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection
          icon={Shield}
          title="Privacy & Security"
          description="Manage your data and security settings"
          gradient="from-slate-500 to-zinc-600"
        >
          <SettingRow
            icon={Eye}
            label="Profile Visibility"
            description="Control who can see your profile"
          >
            <Select defaultValue="team">
              <SelectTrigger className="w-[140px] bg-white/[0.05] border-white/[0.1] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/[0.1]">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Team Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            icon={Lock}
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]"
            >
              Enable
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </SettingRow>

          <SettingRow
            icon={Calendar}
            label="Calendar Access"
            description="Manage connected calendars"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]"
            >
              Manage
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </SettingRow>

          <SettingRow
            icon={Users}
            label="Team Permissions"
            description="Configure team access levels"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]"
            >
              Configure
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </SettingRow>
        </SettingsSection>

        {/* Floating Save Button */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
              <Card className="bg-zinc-900/95 border-white/[0.1] backdrop-blur-xl shadow-2xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <p className="text-sm text-white/60">You have unsaved changes</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHasChanges(false)}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      Discard
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={updatePreferences.isPending}
                      className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:opacity-90"
                    >
                      {updatePreferences.isPending ? (
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
