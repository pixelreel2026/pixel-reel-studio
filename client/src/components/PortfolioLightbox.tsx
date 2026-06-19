import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  industry: string | null;
  imageUrl: string | null;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  clientName: string | null;
  results: string | null;
  createdAt: Date;
}

interface PortfolioLightboxProps {
  isOpen: boolean;
  item: PortfolioItem | null;
  items: PortfolioItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isArabic: boolean;
}

export default function PortfolioLightbox({
  isOpen,
  item,
  items,
  onClose,
  onNext,
  onPrev,
  isArabic,
}: PortfolioLightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const hasNext = currentIndex < items.length - 1;
  const hasPrev = currentIndex > 0;

  const getIndustryLabel = (industry: string | null) => {
    if (!industry) return isArabic ? "غير محدد" : "Uncategorized";
    if (industry === "graphic-design")
      return isArabic ? "تصميم جرافيك" : "Graphic Design";
    if (industry === "video-reels") return isArabic ? "ريلز وفيديو" : "Video Reels";
    if (industry === "brand-identity")
      return isArabic ? "هوية بصرية" : "Brand Identity";
    return industry;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Lightbox Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Content */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#2A2A2A] px-6 py-4 flex items-center justify-between z-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                  <p className="text-sm text-[#00D9FF] mt-1">
                    {getIndustryLabel(item.industry)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition"
                >
                  <X className="w-6 h-6 text-[#B0B0B0]" />
                </button>
              </div>

              {/* Main Content */}
              <div className="p-6 space-y-6">
                {/* Main Image */}
                <div className="space-y-4">
                  <div className="relative h-96 rounded-lg overflow-hidden bg-[#0A0A0A]">
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Before/After Comparison */}
                  {item.beforeImageUrl && item.afterImageUrl && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-[#B0B0B0]">
                        {isArabic ? "مقارنة قبل/بعد" : "Before/After Comparison"}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative rounded-lg overflow-hidden bg-[#0A0A0A] h-64">
                          <img
                            src={item.beforeImageUrl}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 bg-[#FF006E]/80 text-white text-xs px-3 py-1 rounded">
                            {isArabic ? "قبل" : "Before"}
                          </div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden bg-[#0A0A0A] h-64">
                          <img
                            src={item.afterImageUrl}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-[#00D9FF]/80 text-black text-xs px-3 py-1 rounded">
                            {isArabic ? "بعد" : "After"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-white">
                      {isArabic ? "الوصف" : "Description"}
                    </h3>
                    <p className="text-[#B0B0B0] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#2A2A2A]">
                  {item.clientName && (
                    <div>
                      <p className="text-xs font-medium text-[#B0B0B0] mb-2 uppercase">
                        {isArabic ? "العميل" : "Client"}
                      </p>
                      <p className="text-lg font-bold text-[#00D9FF]">
                        {item.clientName}
                      </p>
                    </div>
                  )}

                  {item.results && (
                    <div>
                      <p className="text-xs font-medium text-[#B0B0B0] mb-2 uppercase">
                        {isArabic ? "النتائج" : "Results"}
                      </p>
                      <p className="text-lg font-bold text-[#FF006E]">
                        {item.results}
                      </p>
                    </div>
                  )}

                  {item.industry && (
                    <div>
                      <p className="text-xs font-medium text-[#B0B0B0] mb-2 uppercase">
                        {isArabic ? "التصنيف" : "Category"}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {getIndustryLabel(item.industry)}
                      </p>
                    </div>
                  )}

                  {item.createdAt && (
                    <div>
                      <p className="text-xs font-medium text-[#B0B0B0] mb-2 uppercase">
                        {isArabic ? "التاريخ" : "Date"}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {new Date(item.createdAt).toLocaleDateString(
                          isArabic ? "ar-SA" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="sticky bottom-0 bg-[#0A0A0A] border-t border-[#2A2A2A] px-6 py-4 flex items-center justify-between">
                <Button
                  onClick={onPrev}
                  disabled={!hasPrev}
                  className={`flex items-center gap-2 ${
                    hasPrev
                      ? "bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white"
                      : "bg-[#1A1A1A] text-[#666] cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isArabic ? "السابق" : "Previous"}</span>
                </Button>

                <div className="text-sm text-[#B0B0B0]">
                  {currentIndex + 1} / {items.length}
                </div>

                <Button
                  onClick={onNext}
                  disabled={!hasNext}
                  className={`flex items-center gap-2 ${
                    hasNext
                      ? "bg-[#00D9FF] hover:bg-[#00B8D4] text-black"
                      : "bg-[#1A1A1A] text-[#666] cursor-not-allowed"
                  }`}
                >
                  <span>{isArabic ? "التالي" : "Next"}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Keyboard Hint */}
              <div className="bg-[#0A0A0A] px-6 py-3 border-t border-[#2A2A2A] text-center text-xs text-[#666]">
                {isArabic
                  ? "استخدم الأسهم أو ESC للإغلاق"
                  : "Use arrow keys or ESC to close"}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
