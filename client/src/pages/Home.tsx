import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronDown, Mail, Phone, MapPin, Zap, Palette, Film, Sparkles, BarChart3, Lock, Code2, Users, TrendingUp } from "lucide-react";
import PortfolioGallery from "@/components/PortfolioGallery";

const SERVICES = [
  {
    icon: Palette,
    titleAr: "تصميم جرافيك بالذكاء الاصطناعي",
    titleEn: "AI Graphic Design",
    descriptionAr: "تصاميم احترافية وفريدة مدعومة بأحدث تقنيات الذكاء الاصطناعي",
    descriptionEn: "Professional and unique designs powered by cutting-edge AI technology",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663771944500/i3XRKZKLdjYEjhKVYg3vwe/service-graphic-design-GLCz8wpzdsomVYGPEFsDBU.webp",
  },
  {
    icon: Film,
    titleAr: "ريلز وفيديوهات قصيرة",
    titleEn: "Short Reels & Videos",
    descriptionAr: "محتوى فيديو جذاب وعالي الجودة مخصص لوسائل التواصل الاجتماعي",
    descriptionEn: "Engaging and high-quality video content for social media",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663771944500/i3XRKZKLdjYEjhKVYg3vwe/service-video-reels-7XcaRywyvYTmZ8ADLJxzLF.webp",
  },
  {
    icon: Sparkles,
    titleAr: "هوية بصرية شاملة",
    titleEn: "Brand Identity",
    descriptionAr: "بناء هوية بصرية قوية وموحدة تعكس قيم علامتك التجارية",
    descriptionEn: "Building strong and unified visual identity for your brand",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663771944500/i3XRKZKLdjYEjhKVYg3vwe/service-brand-identity-LWt3gTocb9cvjYrnxJqbG7.webp",
  },
  {
    icon: TrendingUp,
    titleAr: "محتوى وسائل التواصل",
    titleEn: "Social Media Content",
    descriptionAr: "محتوى مُحسَّن لجميع منصات التواصل الاجتماعي",
    descriptionEn: "Optimized content for all social media platforms",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663771944500/i3XRKZKLdjYEjhKVYg3vwe/service-social-media-UvSuRc7G3htEJhRS4zjvx9.webp",
  },
];

const GROWTH_STRATEGIES = [
  { titleAr: "تحسين التسويق الرقمي", titleEn: "Digital Marketing Optimization", icon: Zap },
  { titleAr: "تحليلات مدعومة بالذكاء الاصطناعي", titleEn: "AI-Powered Analytics", icon: BarChart3 },
  { titleAr: "تحسين معدل التحويل", titleEn: "Conversion Rate Optimization", icon: TrendingUp },
  { titleAr: "استراتيجية وسائل التواصل", titleEn: "Social Media Strategy", icon: Users },
];

const WORKFLOW_STAGES = [
  { titleAr: "الاكتشاف والاستراتيجية", titleEn: "Discovery & Strategy", step: 1 },
  { titleAr: "توليد الأفكار الإبداعية", titleEn: "Creative Ideation", step: 2 },
  { titleAr: "التصميم والتطوير", titleEn: "Design & Development", step: 3 },
  { titleAr: "المراجعة والتعليقات", titleEn: "Review & Feedback", step: 4 },
  { titleAr: "الإطلاق والتحسين", titleEn: "Launch & Optimization", step: 5 },
];

export default function Home() {
  const [isArabic, setIsArabic] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    serviceType: "graphic-design",
    projectDescription: "",
    budgetRange: "5000-10000",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInquiry = trpc.inquiries.submit.useMutation({
    onSuccess: () => {
      toast.success(isArabic ? "تم إرسال الاستفسار بنجاح!" : "Inquiry submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        serviceType: "graphic-design",
        projectDescription: "",
        budgetRange: "5000-10000",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || (isArabic ? "حدث خطأ" : "An error occurred"));
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitInquiry.mutateAsync(formData);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-white ${isArabic ? "rtl" : "ltr"}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0A0A0A]/80 backdrop-blur-md z-50 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663771944500/i3XRKZKLdjYEjhKVYg3vwe/pixel-reel-logo-4DFWrKDKUnsDNNbXnMchdC.webp" 
              alt="Pixel & Reel" 
              className="w-10 h-10"
            />
            <span className="font-bold text-lg">Pixel & Reel</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection("services")}
              className="text-sm hover:text-[#00D9FF] transition"
            >
              {isArabic ? "الخدمات" : "Services"}
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="text-sm hover:text-[#00D9FF] transition"
            >
              {isArabic ? "معرض الأعمال" : "Portfolio"}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm hover:text-[#00D9FF] transition"
            >
              {isArabic ? "تواصل" : "Contact"}
            </button>
            <button
              onClick={() => setIsArabic(!isArabic)}
              className="px-3 py-1 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] transition text-xs"
            >
              {isArabic ? "EN" : "AR"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663771944500/i3XRKZKLdjYEjhKVYg3vwe/hero-background-K8t4mH2gHHMgprDs6pSBaD.webp"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00D9FF] via-white to-[#FF006E] bg-clip-text text-transparent"
          >
            AI-Powered Creativity Meets Human Excellence – Designs & Reels in Hours
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#B0B0B0] mb-8"
          >
            {isArabic
              ? "الإبداع المدعوم بالذكاء الاصطناعي يلتقي بالتميز البشري – تصاميم وريلز في ساعات"
              : "Transform your vision into stunning creative content with our AI-powered studio"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-[#00D9FF] hover:bg-[#00B8D4] text-black font-bold px-8 py-3 rounded-lg"
            >
              {isArabic ? "ابدأ الآن" : "Get Started"}
            </Button>
            <Button
              onClick={() => scrollToSection("services")}
              className="border border-[#00D9FF] bg-transparent hover:bg-[#00D9FF]/10 text-[#00D9FF] font-bold px-8 py-3 rounded-lg"
            >
              {isArabic ? "اعرف المزيد" : "Learn More"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#00D9FF] to-[#FF006E] bg-clip-text text-transparent"
          >
            {isArabic ? "خدماتنا الإبداعية" : "Our Creative Services"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group"
                >
                  <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#00D9FF] transition p-6 h-full cursor-pointer hover:shadow-lg hover:shadow-[#00D9FF]/20">
                    <img
                      src={service.image}
                      alt={isArabic ? service.titleAr : service.titleEn}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <Icon className="w-8 h-8 text-[#00D9FF] mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      {isArabic ? service.titleAr : service.titleEn}
                    </h3>
                    <p className="text-sm text-[#B0B0B0]">
                      {isArabic ? service.descriptionAr : service.descriptionEn}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Customer Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#FF006E] to-[#00D9FF] bg-clip-text text-transparent"
          >
            {isArabic ? "دعم العملاء الذكي" : "AI-Powered Customer Support"}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-8"
          >
            <p className="text-[#B0B0B0] mb-6">
              {isArabic
                ? "استفسر عن خدماتنا واحصل على عروض أسعار فورية من خلال محادثتنا الذكية"
                : "Ask about our services and get instant pricing quotes through our AI chat"}
            </p>
            <div className="bg-[#0A0A0A] rounded-lg p-6 min-h-64 flex items-center justify-center border border-[#2A2A2A]">
              <p className="text-[#B0B0B0] text-center">
                {isArabic ? "نظام الدعم الذكي قيد التطوير" : "Smart support system coming soon"}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Growth & Acquisition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#00D9FF] to-[#FF006E] bg-clip-text text-transparent"
          >
            {isArabic ? "نظام النمو وجذب العملاء" : "Growth & Customer Acquisition"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GROWTH_STRATEGIES.map((strategy, idx) => {
              const Icon = strategy.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#FF006E] transition p-6 h-full text-center">
                    <Icon className="w-10 h-10 text-[#FF006E] mx-auto mb-4" />
                    <h3 className="font-bold mb-2">
                      {isArabic ? strategy.titleAr : strategy.titleEn}
                    </h3>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#00D9FF] to-[#FF006E] bg-clip-text text-transparent"
          >
            {isArabic ? "معرض أعمالنا الإبداعية" : "Our Creative Portfolio"}
          </motion.h2>

          <PortfolioGallery isArabic={isArabic} />
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#FF006E] to-[#00D9FF] bg-clip-text text-transparent"
          >
            {isArabic ? "التعاون بين الفرق" : "Team Collaboration"}
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center flex-wrap">
            {WORKFLOW_STAGES.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex items-center"
              >
                <div className="bg-[#1A1A1A] border-2 border-[#00D9FF] rounded-full w-16 h-16 flex items-center justify-center font-bold text-[#00D9FF]">
                  {stage.step}
                </div>
                <div className="mx-4 text-center">
                  <p className="font-bold text-sm">{isArabic ? stage.titleAr : stage.titleEn}</p>
                </div>
                {idx < WORKFLOW_STAGES.length - 1 && (
                  <ChevronDown className="w-6 h-6 text-[#00D9FF] md:rotate-90" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & A/B Testing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#00D9FF] to-[#FF006E] bg-clip-text text-transparent"
          >
            {isArabic ? "التحليلات واختبار A/B" : "Analytics & A/B Testing"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: isArabic ? "معدل التفاعل" : "Engagement Rate", value: "87%", icon: TrendingUp },
              { label: isArabic ? "معدل التحويل" : "Conversion Rate", value: "12.5%", icon: BarChart3 },
              { label: isArabic ? "الوصول" : "Reach", value: "50K+", icon: Users },
              { label: isArabic ? "العائد على الاستثمار" : "ROI", value: "340%", icon: Zap },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6 text-center">
                    <Icon className="w-8 h-8 text-[#FF006E] mx-auto mb-4" />
                    <p className="text-3xl font-bold text-[#00D9FF] mb-2">{metric.value}</p>
                    <p className="text-sm text-[#B0B0B0]">{metric.label}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Future Expansion Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#FF006E] to-[#00D9FF] bg-clip-text text-transparent"
          >
            {isArabic ? "الأمان والتوسع المستقبلي" : "Security & Future Expansion"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                titleAr: "تكامل API",
                titleEn: "API Integration",
                descAr: "واجهات برمجية قوية وآمنة للتكامل مع أنظمتك",
                descEn: "Powerful and secure APIs for seamless integration",
              },
              {
                icon: Sparkles,
                titleAr: "حلول White-label",
                titleEn: "White-Label Solutions",
                descAr: "حلول مخصصة بعلامتك التجارية الخاصة",
                descEn: "Customized solutions with your branding",
              },
              {
                icon: Lock,
                titleAr: "أمان على مستوى المؤسسات",
                titleEn: "Enterprise Security",
                descAr: "تشفير من الدرجة الأولى والامتثال الكامل",
                descEn: "Enterprise-grade encryption and compliance",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#00D9FF] transition p-6">
                    <Icon className="w-10 h-10 text-[#00D9FF] mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      {isArabic ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-sm text-[#B0B0B0]">
                      {isArabic ? item.descAr : item.descEn}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact & Quote Form Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/50">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00D9FF] to-[#FF006E] bg-clip-text text-transparent"
          >
            {isArabic ? "اطلب عرض سعر" : "Request a Quote"}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? "الاسم الكامل" : "Full Name"}
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                      placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                      placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? "رقم الهاتف" : "Phone"}
                    </label>
                    <Input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                      placeholder={isArabic ? "أدخل رقم هاتفك" : "Enter your phone"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? "اسم الشركة" : "Company Name"}
                    </label>
                    <Input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                      placeholder={isArabic ? "أدخل اسم شركتك" : "Enter your company name"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? "نوع الخدمة" : "Service Type"}
                    </label>
                    <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                      <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                        <SelectItem value="graphic-design">{isArabic ? "تصميم جرافيك" : "Graphic Design"}</SelectItem>
                        <SelectItem value="video-reels">{isArabic ? "ريلز وفيديو" : "Video Reels"}</SelectItem>
                        <SelectItem value="brand-identity">{isArabic ? "هوية بصرية" : "Brand Identity"}</SelectItem>
                        <SelectItem value="social-media">{isArabic ? "محتوى سوشيال" : "Social Media"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isArabic ? "نطاق الميزانية" : "Budget Range"}
                    </label>
                    <Select value={formData.budgetRange} onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}>
                      <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                        <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50000+">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isArabic ? "وصف المشروع" : "Project Description"}
                  </label>
                  <Textarea
                    required
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="bg-[#0A0A0A] border-[#2A2A2A] text-white min-h-32"
                    placeholder={isArabic ? "اشرح مشروعك بالتفصيل" : "Describe your project in detail"}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00D9FF] hover:bg-[#00B8D4] text-black font-bold py-3 rounded-lg"
                >
                  {isSubmitting ? (isArabic ? "جاري الإرسال..." : "Sending...") : (isArabic ? "إرسال الاستفسار" : "Submit Inquiry")}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{isArabic ? "عن الشركة" : "About"}</h3>
              <p className="text-[#B0B0B0] text-sm">
                {isArabic
                  ? "Pixel & Reel هي وكالة إبداعية متخصصة في تقديم حلول تصميم وفيديو مدعومة بالذكاء الاصطناعي"
                  : "Pixel & Reel is a creative agency specializing in AI-powered design and video solutions"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{isArabic ? "تواصل معنا" : "Contact"}</h3>
              <div className="space-y-2 text-sm text-[#B0B0B0]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@pixelreel.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+971 4 XXX XXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{isArabic ? "دبي، الإمارات" : "Dubai, UAE"}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{isArabic ? "الروابط السريعة" : "Quick Links"}</h3>
              <ul className="space-y-2 text-sm text-[#B0B0B0]">
                <li><a href="#" className="hover:text-[#00D9FF] transition">{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</a></li>
                <li><a href="#" className="hover:text-[#00D9FF] transition">{isArabic ? "شروط الخدمة" : "Terms of Service"}</a></li>
                <li><a href="#" className="hover:text-[#00D9FF] transition">{isArabic ? "الأسئلة الشائعة" : "FAQ"}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#2A2A2A] pt-8 text-center text-sm text-[#B0B0B0]">
            <p>&copy; 2026 Pixel & Reel. {isArabic ? "جميع الحقوق محفوظة" : "All rights reserved"}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
