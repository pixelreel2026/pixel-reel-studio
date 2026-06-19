import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function PricingPlans() {
  const [isArabic, setIsArabic] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { isAuthenticated } = useAuth();
  const { data: plans, isLoading } = trpc.subscriptions.getPlans.useQuery();

  const handleSelectPlan = (planId: number) => {
    if (!isAuthenticated) {
      toast.error(isArabic ? "يرجى تسجيل الدخول أولاً" : "Please sign in first");
      return;
    }

    toast.success(isArabic ? "سيتم توجيهك إلى صفحة الدفع" : "Redirecting to checkout...");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            {isArabic ? "خطط الاشتراك" : "Pricing Plans"}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {isArabic
              ? "اختر الخطة المناسبة لاحتياجاتك وابدأ الإبداع الآن"
              : "Choose the perfect plan for your creative needs"}
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {isArabic ? "شهري" : "Monthly"}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === "yearly"
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {isArabic ? "سنوي" : "Yearly"}
              <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-1 rounded">
                {isArabic ? "توفير 20%" : "Save 20%"}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="text-center text-gray-400">
            {isArabic ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {plans?.map((plan, index) => (
              <motion.div key={plan.id} variants={cardVariants}>
                <Card
                  className={`relative h-full bg-gradient-to-br ${
                    index === 1
                      ? "from-cyan-900/30 to-pink-900/30 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20"
                      : "from-gray-900/50 to-gray-800/50 border border-gray-700/50"
                  } hover:border-cyan-500/30 transition-all duration-300 overflow-hidden group`}
                >
                  {/* Popular Badge */}
                  {index === 1 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                      {isArabic ? "الأشهر" : "POPULAR"}
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Icon */}
                    <div className="mb-6">
                      {index === 0 && (
                        <Zap className="w-12 h-12 text-cyan-400" />
                      )}
                      {index === 1 && (
                        <Crown className="w-12 h-12 text-pink-400" />
                      )}
                      {index === 2 && (
                        <Rocket className="w-12 h-12 text-purple-400" />
                      )}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {isArabic ? plan.description : plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-white">
                        ${(
                          (billingCycle === "monthly"
                            ? plan.monthlyPrice
                            : plan.yearlyPrice || plan.monthlyPrice * 12) / 100
                        ).toFixed(2)}
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        {billingCycle === "monthly"
                          ? isArabic
                            ? "شهري"
                            : "/month"
                          : isArabic
                          ? "سنوي"
                          : "/year"}
                      </p>
                    </div>

                    {/* Credits */}
                    <div className="mb-8 p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-cyan-400 font-semibold">
                        {plan.creditsPerMonth} {isArabic ? "رصيد شهري" : "Credits/Month"}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features && typeof plan.features === 'string' ? (
                        JSON.parse(plan.features).map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400">No features listed</div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(plan.id as any)}
                      className={`w-full py-3 font-semibold transition-all ${
                        index === 1
                          ? "bg-gradient-to-r from-cyan-500 to-pink-500 hover:shadow-lg hover:shadow-cyan-500/50"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {isArabic ? "اختر هذه الخطة" : "Choose Plan"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            {isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>

          <div className="space-y-4">
            {[
              {
                q: isArabic ? "هل يمكنني تغيير الخطة لاحقاً؟" : "Can I change my plan later?",
                a: isArabic
                  ? "نعم، يمكنك تغيير خطتك في أي وقت من لوحة التحكم"
                  : "Yes, you can upgrade or downgrade your plan anytime from your dashboard",
              },
              {
                q: isArabic ? "هل هناك فترة تجربة مجانية؟" : "Is there a free trial?",
                a: isArabic
                  ? "نعم، خطة المبتدئ مجانية تماماً مع 50 رصيد شهري"
                  : "Yes, our Starter plan is completely free with 50 credits per month",
              },
              {
                q: isArabic ? "ماذا يحدث إذا انتهت أرصدتي؟" : "What happens when I run out of credits?",
                a: isArabic
                  ? "يمكنك شراء أرصدة إضافية أو ترقية خطتك للحصول على المزيد"
                  : "You can purchase additional credits or upgrade your plan for more",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="bg-gray-900/50 border border-gray-700/50 p-6 hover:border-cyan-500/30 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
