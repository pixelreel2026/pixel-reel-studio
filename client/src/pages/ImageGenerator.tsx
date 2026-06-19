import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Download, Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const STYLE_PRESETS = [
  { id: "realistic", label: "واقعي", labelEn: "Realistic" },
  { id: "cartoon", label: "كرتون", labelEn: "Cartoon" },
  { id: "anime", label: "أنيمي", labelEn: "Anime" },
  { id: "oil-painting", label: "رسم زيتي", labelEn: "Oil Painting" },
  { id: "watercolor", label: "ألوان مائية", labelEn: "Watercolor" },
  { id: "digital-art", label: "فن رقمي", labelEn: "Digital Art" },
  { id: "cyberpunk", label: "سايبربانك", labelEn: "Cyberpunk" },
  { id: "steampunk", label: "ستيمبانك", labelEn: "Steampunk" },
];

export default function ImageGenerator() {
  const [isArabic, setIsArabic] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);

  const generateMutation = trpc.imageGeneration.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedImage(data.imageUrl || null);
      // For now, we use the same image as a variation placeholder
      if (data.imageUrl) {
        setVariations([data.imageUrl]);
      }
      toast.success(isArabic ? "تم توليد الصورة بنجاح" : "Image generated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(isArabic ? "يرجى إدخال وصف الصورة" : "Please enter an image description");
      return;
    }

    generateMutation.mutate({
      prompt,
      style: selectedStyle,
    });
  };

  const isGenerating = generateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            {isArabic ? "مولد الصور بالذكاء الاصطناعي" : "AI Image Generator"}
          </h1>
          <p className="text-xl text-gray-400">
            {isArabic
              ? "أنشئ صوراً احترافية من خلال وصف بسيط"
              : "Create professional images from simple descriptions"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border border-gray-800/50 p-8">
              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  {isArabic ? "وصف الصورة" : "Image Description"}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    isArabic
                      ? "صف الصورة التي تريد توليدها..."
                      : "Describe the image you want to generate..."
                  }
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                  rows={6}
                />
                <p className="text-sm text-gray-400 mt-2">
                  {isArabic
                    ? "كلما كان الوصف أكثر تفصيلاً، كانت النتيجة أفضل"
                    : "The more detailed your description, the better the result"}
                </p>
              </div>

              {/* Style Selection */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  {isArabic ? "أسلوب الفن" : "Art Style"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedStyle === style.id
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {isArabic ? style.label : style.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:shadow-lg hover:shadow-cyan-500/50 py-3 font-semibold gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {isArabic ? "جاري التوليد..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    {isArabic ? "توليد الصورة" : "Generate Image"}
                  </>
                )}
              </Button>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-cyan-900/20 border border-cyan-500/30 p-6">
              <h3 className="text-white font-semibold mb-3">
                {isArabic ? "نصائح للحصول على أفضل النتائج" : "Tips for Best Results"}
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• {isArabic ? "كن محدداً في وصفك" : "Be specific in your description"}</li>
                <li>• {isArabic ? "أضف التفاصيل والألوان" : "Include details and colors"}</li>
                <li>• {isArabic ? "استخدم كلمات وصفية قوية" : "Use strong descriptive words"}</li>
                <li>• {isArabic ? "حدد الإضاءة والمزاج" : "Specify lighting and mood"}</li>
              </ul>
            </Card>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Main Generated Image */}
            {generatedImage ? (
              <Card className="bg-gray-900/50 border border-gray-800/50 overflow-hidden">
                <div className="aspect-square bg-gray-800/50 flex items-center justify-center relative group">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                    <Button size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      {isArabic ? "تحميل" : "Download"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerate}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {isArabic ? "إعادة" : "Retry"}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border border-gray-800/50 border-dashed aspect-square flex items-center justify-center">
                <div className="text-center">
                  <Wand2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {isArabic
                      ? "سيتم عرض الصورة المولدة هنا"
                      : "Generated image will appear here"}
                  </p>
                </div>
              </Card>
            )}

            {/* Variations */}
            {variations.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">
                  {isArabic ? "الاختلافات" : "Variations"}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {variations.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-gray-800/50 rounded-lg overflow-hidden cursor-pointer border border-gray-700/50 hover:border-cyan-500/50 transition-all"
                    >
                      <img
                        src={img}
                        alt={`Variation ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onClick={() => setGeneratedImage(img)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Credits Info */}
            <Card className="bg-pink-900/20 border border-pink-500/30 p-4">
              <p className="text-sm text-gray-300">
                {isArabic ? "كل صورة تستخدم" : "Each image uses"} <span className="text-pink-400 font-semibold">10 أرصدة</span>
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
