import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Loader, Download, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const VIDEO_TEMPLATES = [
  { id: "promo", label: "فيديو ترويجي", labelEn: "Promo Video", duration: "30s", credits: 50 },
  { id: "tutorial", label: "فيديو تعليمي", labelEn: "Tutorial", duration: "60s", credits: 75 },
  { id: "testimonial", label: "شهادة عميل", labelEn: "Testimonial", duration: "30s", credits: 40 },
  { id: "product", label: "عرض منتج", labelEn: "Product Showcase", duration: "45s", credits: 60 },
  { id: "social", label: "محتوى سوشيال", labelEn: "Social Media", duration: "15s", credits: 30 },
  { id: "animation", label: "رسوم متحركة", labelEn: "Animation", duration: "60s", credits: 100 },
];

export default function VideoGenerator() {
  const [isArabic, setIsArabic] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("promo");
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const selectedTemplateData = VIDEO_TEMPLATES.find((t) => t.id === selectedTemplate);

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error(isArabic ? "يرجى إدخال نص الفيديو" : "Please enter video script");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate video generation with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgress(i);
      }

      // Mock video URL
      setGeneratedVideo("https://via.placeholder.com/1280x720?text=Video+Generated");
      toast.success(isArabic ? "تم توليد الفيديو بنجاح" : "Video generated successfully");
    } catch (error) {
      toast.error(isArabic ? "حدث خطأ في توليد الفيديو" : "Error generating video");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            {isArabic ? "مولد الفيديوهات بالذكاء الاصطناعي" : "AI Video Generator"}
          </h1>
          <p className="text-xl text-gray-400">
            {isArabic
              ? "أنشئ فيديوهات احترافية في دقائق"
              : "Create professional videos in minutes"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Template Selection */}
            <Card className="bg-gray-900/50 border border-gray-800/50 p-8">
              <h3 className="text-white font-semibold mb-4">
                {isArabic ? "اختر قالب الفيديو" : "Choose Video Template"}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {VIDEO_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? "border-pink-500 bg-pink-500/10"
                        : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">
                        {isArabic ? template.label : template.labelEn}
                      </h4>
                      <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded">
                        {template.credits} {isArabic ? "رصيد" : "credits"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {template.duration}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Script Input */}
            <Card className="bg-gray-900/50 border border-gray-800/50 p-8">
              <label className="block text-white font-semibold mb-3">
                {isArabic ? "نص الفيديو" : "Video Script"}
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder={
                  isArabic
                    ? "اكتب نص الفيديو الذي تريده..."
                    : "Write your video script here..."
                }
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 resize-none"
                rows={8}
              />
              <p className="text-sm text-gray-400 mt-2">
                {isArabic
                  ? "اكتب النص الذي تريد أن يظهر في الفيديو"
                  : "Write the text you want to appear in the video"}
              </p>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/50 py-3 font-semibold gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {isArabic ? "جاري التوليد..." : "Generating..."}
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  {isArabic ? "توليد الفيديو" : "Generate Video"}
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    {isArabic ? "التقدم" : "Progress"}
                  </span>
                  <span className="text-sm font-semibold text-pink-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Preview & Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Video Preview */}
            {generatedVideo ? (
              <Card className="bg-gray-900/50 border border-gray-800/50 overflow-hidden">
                <div className="aspect-video bg-gray-800/50 flex items-center justify-center relative group">
                  <img
                    src={generatedVideo}
                    alt="Generated Video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                    <Button size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      {isArabic ? "تحميل" : "Download"}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border border-gray-800/50 border-dashed aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {isArabic
                      ? "سيتم عرض الفيديو هنا"
                      : "Video preview will appear here"}
                  </p>
                </div>
              </Card>
            )}

            {/* Template Info */}
            <Card className="bg-pink-900/20 border border-pink-500/30 p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  {isArabic ? "القالب المختار" : "Selected Template"}
                </p>
                <p className="text-lg font-semibold text-white">
                  {isArabic
                    ? selectedTemplateData?.label
                    : selectedTemplateData?.labelEn}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {isArabic ? "المدة" : "Duration"}
                  </p>
                  <p className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedTemplateData?.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {isArabic ? "الأرصدة" : "Credits"}
                  </p>
                  <p className="text-lg font-semibold text-pink-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {selectedTemplateData?.credits}
                  </p>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="bg-purple-900/20 border border-purple-500/30 p-6">
              <h4 className="text-white font-semibold mb-3">
                {isArabic ? "المميزات" : "Features"}
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ {isArabic ? "جودة 4K" : "4K Quality"}</li>
                <li>✓ {isArabic ? "موسيقى خلفية احترافية" : "Professional BGM"}</li>
                <li>✓ {isArabic ? "انتقالات سلسة" : "Smooth Transitions"}</li>
                <li>✓ {isArabic ? "تأثيرات بصرية" : "Visual Effects"}</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
