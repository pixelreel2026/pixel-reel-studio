import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PortfolioLightbox from "./PortfolioLightbox";

type FilterType = "all" | "graphic-design" | "video-reels" | "brand-identity";

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

const FILTER_OPTIONS: { value: FilterType; labelAr: string; labelEn: string; icon: string }[] = [
  { value: "all", labelAr: "جميع الأعمال", labelEn: "All Works", icon: "🎨" },
  { value: "graphic-design", labelAr: "تصميم جرافيك", labelEn: "Graphic Design", icon: "✏️" },
  { value: "video-reels", labelAr: "ريلز وفيديو", labelEn: "Video Reels", icon: "🎬" },
  { value: "brand-identity", labelAr: "هوية بصرية", labelEn: "Brand Identity", icon: "🎭" },
];

interface PortfolioGalleryProps {
  isArabic: boolean;
}

export default function PortfolioGallery({ isArabic }: PortfolioGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fetch portfolio items
  const { data: portfolioItems = [], isLoading } = trpc.portfolio.list.useQuery();

  // Sample data for demonstration
  const samplePortfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: isArabic ? "تصميم هوية بصرية لشركة تقنية" : "Tech Company Brand Identity",
      description: isArabic ? "هوية بصرية شاملة تشمل الشعار والألوان والخطوط والمواد التسويقية" : "Complete brand identity including logo, colors, typography, and marketing materials",
      industry: "brand-identity",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop",
      afterImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop&brightness=1.2",
      clientName: "Tech Startup",
      results: isArabic ? "زيادة الوعي بالعلامة التجارية بنسبة 45%" : "45% increase in brand awareness",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: 2,
      title: isArabic ? "مقطع فيديو ترويجي احترافي" : "Professional Promotional Video",
      description: isArabic ? "مقطع فيديو عالي الجودة للترويج للمنتج الجديد مع تأثيرات احترافية" : "High-quality promotional video for new product launch with professional effects",
      industry: "video-reels",
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop",
      beforeImageUrl: null,
      afterImageUrl: null,
      clientName: "E-commerce Brand",
      results: isArabic ? "1.2 مليون مشاهدة في الأسبوع الأول" : "1.2M views in first week",
      createdAt: new Date("2024-02-10"),
    },
    {
      id: 3,
      title: isArabic ? "تصميم جرافيك لحملة إعلانية" : "Graphic Design Campaign",
      description: isArabic ? "مجموعة تصاميم جرافيكية للحملة الإعلانية الشاملة عبر جميع القنوات" : "Complete graphic design set for advertising campaign across all channels",
      industry: "graphic-design",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop&brightness=0.8",
      afterImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop",
      clientName: "Fashion Brand",
      results: isArabic ? "زيادة المبيعات بنسبة 67%" : "67% sales increase",
      createdAt: new Date("2024-01-20"),
    },
    {
      id: 4,
      title: isArabic ? "هوية بصرية لمطعم فاخر" : "Luxury Restaurant Branding",
      description: isArabic ? "تصميم هوية بصرية متكاملة للمطعم الفاخر تعكس الرقي والفخامة" : "Complete branding for luxury dining establishment reflecting elegance and sophistication",
      industry: "brand-identity",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop&brightness=0.7",
      afterImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop&brightness=1.1",
      clientName: "Fine Dining Restaurant",
      results: isArabic ? "زيادة الحجوزات بنسبة 85%" : "85% booking increase",
      createdAt: new Date("2024-02-05"),
    },
    {
      id: 5,
      title: isArabic ? "سلسلة ريلز لوسائل التواصل" : "Social Media Reels Series",
      description: isArabic ? "سلسلة من الريلز المتحركة للمنصات الاجتماعية مع محتوى جذاب" : "Animated reels series for social media platforms with engaging content",
      industry: "video-reels",
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop",
      beforeImageUrl: null,
      afterImageUrl: null,
      clientName: "Lifestyle Brand",
      results: isArabic ? "3.5 مليون تفاعل" : "3.5M engagements",
      createdAt: new Date("2024-02-08"),
    },
    {
      id: 6,
      title: isArabic ? "تصميم غلاف مجلة" : "Magazine Cover Design",
      description: isArabic ? "تصميم غلاف مجلة احترافي مع الرسوميات المتقدمة والتصميم الحديث" : "Professional magazine cover with advanced graphics and modern design",
      industry: "graphic-design",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop",
      beforeImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop&brightness=0.9",
      afterImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop",
      clientName: "Publishing House",
      results: isArabic ? "زيادة المبيعات بنسبة 52%" : "52% sales increase",
      createdAt: new Date("2024-01-25"),
    },
  ];

  // Use sample data if no real data is available
  const displayItems = portfolioItems.length > 0 ? portfolioItems : samplePortfolioItems;
  
  const itemsToShow = useMemo(() => {
    return displayItems.filter((item: any) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "graphic-design") {
        return item.industry === "graphic-design" || item.title.toLowerCase().includes("design");
      }
      if (activeFilter === "video-reels") {
        return item.industry === "video-reels" || item.title.toLowerCase().includes("reel") || item.title.toLowerCase().includes("video");
      }
      if (activeFilter === "brand-identity") {
        return item.industry === "brand-identity" || item.title.toLowerCase().includes("brand");
      }
      return true;
    });
  }, [displayItems, activeFilter]);

  const handleOpenLightbox = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };

  const handleNextItem = () => {
    if (!selectedItem) return;
    const currentIndex = itemsToShow.findIndex((i: any) => i.id === selectedItem.id);
    if (currentIndex < itemsToShow.length - 1) {
      setSelectedItem(itemsToShow[currentIndex + 1]);
    }
  };

  const handlePrevItem = () => {
    if (!selectedItem) return;
    const currentIndex = itemsToShow.findIndex((i: any) => i.id === selectedItem.id);
    if (currentIndex > 0) {
      setSelectedItem(itemsToShow[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-12">
      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {FILTER_OPTIONS.map((filter) => (
          <motion.button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              activeFilter === filter.value
                ? "bg-[#00D9FF] text-black shadow-lg shadow-[#00D9FF]/50"
                : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#B0B0B0] hover:border-[#00D9FF] hover:text-white"
            }`}
          >
            <span>{filter.icon}</span>
            <span>{isArabic ? filter.labelAr : filter.labelEn}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <div className="relative">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#00D9FF] animate-spin" />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {itemsToShow.map((item: any, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleOpenLightbox(item)}
              >
                <Card className="bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden hover:border-[#00D9FF] transition-all duration-300 h-full group cursor-pointer hover:shadow-lg hover:shadow-[#00D9FF]/20">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-[#0A0A0A]">
                    {item.beforeImageUrl && item.afterImageUrl && hoveredId === item.id ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex"
                      >
                        <div className="flex-1 overflow-hidden relative">
                          <img
                            src={item.beforeImageUrl}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-[#FF006E]/80 text-white text-xs px-2 py-1 rounded">
                            {isArabic ? "قبل" : "Before"}
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                          <img
                            src={item.afterImageUrl}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-[#00D9FF]/80 text-black text-xs px-2 py-1 rounded">
                            {isArabic ? "بعد" : "After"}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}

                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent flex items-end p-4"
                    >
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-[#00D9FF] text-black text-xs">
                            {item.industry === "graphic-design"
                              ? isArabic
                                ? "تصميم جرافيك"
                                : "Graphic Design"
                              : item.industry === "video-reels"
                              ? isArabic
                                ? "ريلز وفيديو"
                                : "Video Reels"
                              : isArabic
                              ? "هوية بصرية"
                              : "Brand Identity"}
                          </Badge>
                        </div>
                        <p className="text-white text-sm font-medium line-clamp-2">{item.title}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-white mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-[#B0B0B0] line-clamp-2">{item.description}</p>
                    </div>

                    {item.clientName && (
                      <div className="pt-2 border-t border-[#2A2A2A]">
                        <p className="text-xs text-[#B0B0B0] mb-1">
                          {isArabic ? "العميل:" : "Client:"}
                        </p>
                        <p className="text-sm font-medium text-[#00D9FF]">{item.clientName}</p>
                      </div>
                    )}

                    {item.results && (
                      <div className="pt-2 border-t border-[#2A2A2A]">
                        <p className="text-xs text-[#B0B0B0] mb-1">
                          {isArabic ? "النتائج:" : "Results:"}
                        </p>
                        <p className="text-sm font-medium text-[#FF006E]">{item.results}</p>
                      </div>
                    )}

                    {item.beforeImageUrl && item.afterImageUrl && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="flex items-center gap-1 text-xs text-[#00D9FF] pt-2"
                      >
                        <span>{isArabic ? "قارن قبل/بعد" : "Compare before/after"}</span>
                        <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && itemsToShow.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-[#B0B0B0]">
              {isArabic ? "لا توجد أعمال في هذه الفئة حالياً" : "No works in this category yet"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <PortfolioLightbox
        isOpen={isLightboxOpen}
        item={selectedItem}
        items={itemsToShow}
        onClose={() => setIsLightboxOpen(false)}
        onNext={handleNextItem}
        onPrev={handlePrevItem}
        isArabic={isArabic}
      />
    </div>
  );
}
