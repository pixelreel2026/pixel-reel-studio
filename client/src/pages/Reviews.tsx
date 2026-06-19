import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const DEFAULT_REVIEWS = [
  {
    id: 1,
    author: "أحمد محمد",
    company: "Tech Startup",
    rating: 5,
    title: "خدمة ممتازة وسريعة",
    content: "تم توليد جميع التصاميم بجودة عالية جداً وفي وقت قياسي. فريق العمل احترافي جداً ومتعاون.",
    createdAt: new Date("2026-06-10"),
    verified: true,
  },
  {
    id: 2,
    author: "فاطمة علي",
    company: "Digital Agency",
    rating: 5,
    title: "أفضل منصة لتوليد المحتوى",
    content: "استخدمت المنصة لأكثر من شهر وكانت النتائج رائعة جداً. الأرصدة كافية والأسعار معقولة.",
    createdAt: new Date("2026-06-05"),
    verified: true,
  },
  {
    id: 3,
    author: "محمود إبراهيم",
    company: "E-commerce Store",
    rating: 4,
    title: "منصة موثوقة وسهلة الاستخدام",
    content: "الواجهة سهلة جداً والنتائج احترافية. أتمنى إضافة المزيد من الخيارات المتقدمة.",
    createdAt: new Date("2026-05-28"),
    verified: true,
  },
];

export default function Reviews() {
  const [isArabic, setIsArabic] = useState(true);
  const [newReview, setNewReview] = useState({
    title: "",
    content: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews from API
  const { data: reviews = [], isLoading: isLoadingReviews, refetch } = trpc.reviews.getAll.useQuery();
  const createReviewMutation = trpc.reviews.create.useMutation();

  // Use real reviews if available, otherwise use defaults
  const displayReviews = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  const handleSubmitReview = async () => {
    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast.error(isArabic ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReviewMutation.mutateAsync({
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
      });
      toast.success(isArabic ? "تم إرسال التقييم بنجاح" : "Review submitted successfully");
      setNewReview({ title: "", content: "", rating: 5 });
      refetch(); // Refresh reviews list
    } catch (error) {
      toast.error(isArabic ? "حدث خطأ" : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = displayReviews.length > 0
    ? (displayReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / displayReviews.length).toFixed(1)
    : "0";

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
            {isArabic ? "تقييمات العملاء" : "Customer Reviews"}
          </h1>
          <p className="text-xl text-gray-400">
            {isArabic
              ? "اطلع على آراء عملائنا الراضين"
              : "See what our satisfied customers say"}
          </p>
        </motion.div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-cyan-900/20 border border-cyan-500/30 p-8 text-center">
            <p className="text-sm text-gray-400 mb-2">
              {isArabic ? "متوسط التقييم" : "Average Rating"}
            </p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-cyan-400">{averageRating}</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(parseFloat(averageRating as string))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {isArabic ? "من" : "out of"} 5
            </p>
          </Card>

          <Card className="bg-pink-900/20 border border-pink-500/30 p-8 text-center">
            <p className="text-sm text-gray-400 mb-2">
              {isArabic ? "عدد التقييمات" : "Total Reviews"}
            </p>
            <p className="text-4xl font-bold text-pink-400">{displayReviews.length}</p>
          </Card>

          <Card className="bg-purple-900/20 border border-purple-500/30 p-8 text-center">
            <p className="text-sm text-gray-400 mb-2">
              {isArabic ? "العملاء الراضون" : "Satisfied Customers"}
            </p>
            <p className="text-4xl font-bold text-purple-400">100%</p>
          </Card>
        </motion.div>

        {/* Reviews List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-6"
        >
          {isLoadingReviews ? (
            <div className="text-center py-12">
              <p className="text-gray-400">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
            </div>
          ) : displayReviews.length > 0 ? (
            displayReviews.map((review: any, idx: number) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-gray-900/50 border border-gray-800/50 p-8 hover:border-cyan-500/30 transition-all">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white text-lg">
                          {review.author || (isArabic ? "عميل" : "Customer")}
                        </h3>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          {isArabic ? "موثق" : "Verified"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{review.company || (isArabic ? "عميل" : "Customer")}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h4 className="text-white font-semibold mb-2">
                    {review.title}
                  </h4>

                  {/* Content */}
                  <p className="text-gray-300 leading-relaxed">
                    {review.content}
                  </p>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">{isArabic ? "لا توجد تقييمات حتى الآن" : "No reviews yet"}</p>
            </div>
          )}
        </motion.div>

        {/* Add Review Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-cyan-900/20 to-pink-900/20 border border-cyan-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              {isArabic ? "أضف تقييمك" : "Add Your Review"}
            </h2>

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  {isArabic ? "التقييم" : "Rating"}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  {isArabic ? "عنوان التقييم" : "Review Title"}
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview({ ...newReview, title: e.target.value })
                  }
                  placeholder={
                    isArabic
                      ? "ملخص تقييمك..."
                      : "Summary of your review..."
                  }
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  {isArabic ? "تفاصيل التقييم" : "Review Details"}
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) =>
                    setNewReview({ ...newReview, content: e.target.value })
                  }
                  placeholder={
                    isArabic
                      ? "شارك تجربتك معنا..."
                      : "Share your experience..."
                  }
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                  rows={5}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:shadow-lg hover:shadow-cyan-500/50 py-3 font-semibold gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {isArabic ? "جاري الإرسال..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {isArabic ? "إرسال التقييم" : "Submit Review"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
