import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Zap,
  FileText,
  Settings,
  LogOut,
  Plus,
  Image,
  Video,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Dashboard() {
  const [isArabic, setIsArabic] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "settings">("overview");
  const { user, logout } = useAuth();

  const { data: credits } = trpc.credits.getBalance.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();
  const { data: transactions } = trpc.credits.getTransactions.useQuery();
  const { data: subscription } = trpc.subscriptions.getUserSubscription.useQuery();

  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success(isArabic ? "تم إنشاء المشروع بنجاح" : "Project created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateProject = (type: "image" | "video" | "design") => {
    createProject.mutate({
      name: `${type} Project - ${new Date().toLocaleDateString()}`,
      type,
    });
  };

  const handleLogout = async () => {
    await logout();
    toast.success(isArabic ? "تم تسجيل الخروج بنجاح" : "Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A]">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{isArabic ? "لوحة التحكم" : "Dashboard"}</h1>
            <p className="text-gray-400 text-sm">{isArabic ? "مرحباً" : "Welcome"}, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsArabic(!isArabic)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              {isArabic ? "EN" : "AR"}
            </button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              {isArabic ? "تسجيل خروج" : "Logout"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          {/* Credits Card */}
          <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-900/10 border border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">{isArabic ? "الأرصدة المتبقية" : "Credits Left"}</h3>
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-4xl font-bold text-white">{credits?.currentCredits || 0}</p>
            <p className="text-sm text-gray-400 mt-2">
              {isArabic ? "من" : "of"} {subscription?.currentCredits || 0}
            </p>
          </Card>

          {/* Projects Card */}
          <Card className="bg-gradient-to-br from-pink-900/30 to-pink-900/10 border border-pink-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">{isArabic ? "المشاريع" : "Projects"}</h3>
              <FileText className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-4xl font-bold text-white">{projects?.length || 0}</p>
            <p className="text-sm text-gray-400 mt-2">
              {isArabic ? "مشاريع نشطة" : "Active projects"}
            </p>
          </Card>

          {/* Used Credits Card */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">{isArabic ? "المستخدمة" : "Used"}</h3>
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-4xl font-bold text-white">{credits?.totalCreditsUsed || 0}</p>
            <p className="text-sm text-gray-400 mt-2">
              {isArabic ? "أرصدة مستخدمة" : "Credits used"}
            </p>
          </Card>

          {/* Plan Card */}
          <Card className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 border border-orange-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400">{isArabic ? "الخطة" : "Plan"}</h3>
              <Settings className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {subscription?.planId === 1 ? "Starter" : subscription?.planId === 2 ? "Pro" : "Enterprise"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {isArabic ? "الخطة الحالية" : "Current plan"}
            </p>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          {["overview", "projects", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === tab
                  ? "border-cyan-500 text-cyan-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab === "overview"
                ? isArabic
                  ? "نظرة عامة"
                  : "Overview"
                : tab === "projects"
                ? isArabic
                  ? "المشاريع"
                  : "Projects"
                : isArabic
                ? "الإعدادات"
                : "Settings"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {isArabic ? "إجراءات سريعة" : "Quick Actions"}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCreateProject("image")}
                  disabled={createProject.isPending}
                  className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/50 hover:border-cyan-400 p-8 rounded-lg transition-all group"
                >
                  <Image className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isArabic ? "توليد صورة" : "Generate Image"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {isArabic ? "إنشاء صور بالذكاء الاصطناعي" : "Create AI-powered images"}
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCreateProject("video")}
                  disabled={createProject.isPending}
                  className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/50 hover:border-pink-400 p-8 rounded-lg transition-all group"
                >
                  <Video className="w-12 h-12 text-pink-400 mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isArabic ? "توليد فيديو" : "Generate Video"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {isArabic ? "إنشاء فيديوهات احترافية" : "Create professional videos"}
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCreateProject("design")}
                  disabled={createProject.isPending}
                  className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 hover:border-purple-400 p-8 rounded-lg transition-all group"
                >
                  <Palette className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isArabic ? "تصميم" : "Design"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {isArabic ? "إنشاء تصاميم احترافية" : "Create stunning designs"}
                  </p>
                </motion.button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {isArabic ? "آخر المعاملات" : "Recent Transactions"}
              </h2>
              <Card className="bg-gray-900/50 border border-gray-800/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                          {isArabic ? "الوصف" : "Description"}
                        </th>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                          {isArabic ? "النوع" : "Type"}
                        </th>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                          {isArabic ? "الأرصدة" : "Credits"}
                        </th>
                        <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                          {isArabic ? "التاريخ" : "Date"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.slice(0, 5).map((tx, idx) => (
                        <tr key={idx} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition">
                          <td className="px-6 py-4 text-white">{tx.description}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                tx.type === "usage"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white">{tx.amount}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isArabic ? "مشاريعي" : "My Projects"}
              </h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {isArabic ? "مشروع جديد" : "New Project"}
              </Button>
            </div>

            {projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-gray-900/50 border border-gray-800/50 hover:border-cyan-500/30 p-6 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                        {project.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-800/30">
                      <span className="text-sm text-gray-400">
                        {isArabic ? "الأرصدة المستخدمة" : "Credits Used"}: {project.creditsUsed}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          project.status === "draft"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900/50 border border-gray-800/50 p-12 text-center">
                <p className="text-gray-400 mb-4">
                  {isArabic ? "لا توجد مشاريع حتى الآن" : "No projects yet"}
                </p>
                <Button onClick={() => handleCreateProject("image")}>
                  {isArabic ? "إنشاء أول مشروع" : "Create Your First Project"}
                </Button>
              </Card>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {isArabic ? "الإعدادات" : "Settings"}
            </h2>

            <Card className="bg-gray-900/50 border border-gray-800/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                {isArabic ? "معلومات الحساب" : "Account Information"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {isArabic ? "الاسم" : "Name"}
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
