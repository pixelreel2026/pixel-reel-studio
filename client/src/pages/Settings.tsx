import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Lock, User, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Settings() {
  const { user, logout } = useAuth();
  const [isArabic, setIsArabic] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    company: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    promotions: false,
    weeklyReport: true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(isArabic ? "تم حفظ البيانات بنجاح" : "Profile saved successfully");
    } catch (error) {
      toast.error(isArabic ? "حدث خطأ" : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(isArabic ? "تم تسجيل الخروج" : "Logged out successfully");
    } catch (error) {
      toast.error(isArabic ? "خطأ في تسجيل الخروج" : "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
            <SettingsIcon className="w-10 h-10" />
            {isArabic ? "الإعدادات" : "Settings"}
          </h1>
          <p className="text-gray-400">
            {isArabic ? "إدارة حسابك وتفضيلاتك" : "Manage your account and preferences"}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-4 border-b border-gray-800"
        >
          {[
            { id: "profile", label: isArabic ? "الملف الشخصي" : "Profile", icon: User },
            { id: "notifications", label: isArabic ? "الإخطارات" : "Notifications", icon: Bell },
            { id: "security", label: isArabic ? "الأمان" : "Security", icon: Lock },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-semibold flex items-center gap-2 transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-cyan-500 text-cyan-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <TabIcon className="w-5 h-5" />
              {tab.label}
            </button>
          );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeTab}
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card className="bg-gray-900/50 border border-gray-800/50 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {isArabic ? "معلومات الحساب" : "Account Information"}
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    {isArabic ? "الاسم" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    placeholder={isArabic ? "+966..." : "+1..."}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    {isArabic ? "الشركة" : "Company"}
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData({ ...profileData, company: e.target.value })
                    }
                    placeholder={isArabic ? "اسم الشركة" : "Company name"}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:shadow-lg hover:shadow-cyan-500/50 py-3 font-semibold gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      {isArabic ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isArabic ? "حفظ التغييرات" : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card className="bg-gray-900/50 border border-gray-800/50 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {isArabic ? "إعدادات الإخطارات" : "Notification Settings"}
              </h2>

              <div className="space-y-4">
                {[
                  {
                    key: "emailNotifications",
                    label: isArabic ? "إخطارات البريد الإلكتروني" : "Email Notifications",
                    desc: isArabic ? "تلقي الإخطارات عبر البريد الإلكتروني" : "Receive notifications via email",
                  },
                  {
                    key: "projectUpdates",
                    label: isArabic ? "تحديثات المشاريع" : "Project Updates",
                    desc: isArabic ? "إخطارات حول تحديثات مشاريعك" : "Notifications about your projects",
                  },
                  {
                    key: "promotions",
                    label: isArabic ? "العروض الترويجية" : "Promotions",
                    desc: isArabic ? "تلقي عروض خاصة وخصومات" : "Receive special offers and discounts",
                  },
                  {
                    key: "weeklyReport",
                    label: isArabic ? "التقرير الأسبوعي" : "Weekly Report",
                    desc: isArabic ? "تقرير أسبوعي عن استخدامك" : "Weekly usage report",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                  >
                    <div>
                      <p className="font-semibold text-white">{setting.label}</p>
                      <p className="text-sm text-gray-400">{setting.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        notificationSettings[setting.key as keyof typeof notificationSettings]
                      }
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [setting.key]: e.target.checked,
                        })
                      }
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card className="bg-gray-900/50 border border-gray-800/50 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {isArabic ? "إعدادات الأمان" : "Security Settings"}
              </h2>

              <div className="space-y-6">
                {/* Change Password */}
                <div className="border-b border-gray-700/50 pb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder={isArabic ? "كلمة المرور الحالية" : "Current password"}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="password"
                      placeholder={isArabic ? "كلمة المرور الجديدة" : "New password"}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="password"
                      placeholder={isArabic ? "تأكيد كلمة المرور" : "Confirm password"}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:shadow-lg hover:shadow-cyan-500/50 py-2 font-semibold">
                      {isArabic ? "تحديث كلمة المرور" : "Update Password"}
                    </Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-b border-gray-700/50 pb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isArabic ? "المصادقة الثنائية" : "Two-Factor Authentication"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {isArabic
                      ? "أضف طبقة أمان إضافية لحسابك"
                      : "Add an extra layer of security to your account"}
                  </p>
                  <Button variant="outline">
                    {isArabic ? "تفعيل المصادقة الثنائية" : "Enable 2FA"}
                  </Button>
                </div>

                {/* Logout */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {isArabic ? "تسجيل الخروج" : "Logout"}
                  </h3>
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 font-semibold gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {isArabic ? "تسجيل الخروج من جميع الأجهزة" : "Logout from all devices"}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
