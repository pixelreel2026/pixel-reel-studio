/**
 * Subscription Plans Configuration
 * Defines all available subscription tiers and their features
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  monthlyPrice: number;
  yearlyPrice: number;
  creditsPerMonth: number;
  features: string[];
  featuresAr: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Starter",
    nameAr: "مبتدئ",
    description: "Perfect for trying out Pixel & Reel",
    descriptionAr: "مثالي لتجربة Pixel & Reel",
    monthlyPrice: 0,
    yearlyPrice: 0,
    creditsPerMonth: 50,
    features: [
      "50 credits per month",
      "AI Image Generation",
      "Basic Designs",
      "Community Support",
      "Portfolio Gallery",
    ],
    featuresAr: [
      "50 رصيد شهري",
      "توليد صور بالذكاء الاصطناعي",
      "تصاميم أساسية",
      "دعم المجتمع",
      "معرض الأعمال",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    nameAr: "احترافي",
    description: "For creative professionals and small teams",
    descriptionAr: "للمحترفين والفرق الصغيرة",
    monthlyPrice: 2999, // $29.99
    yearlyPrice: 29990, // $299.90
    creditsPerMonth: 500,
    features: [
      "500 credits per month",
      "Advanced AI Image Generation",
      "Video & Reels Creation",
      "Multiple Design Styles",
      "Project Management",
      "Priority Support",
      "Commercial License",
      "API Access",
    ],
    featuresAr: [
      "500 رصيد شهري",
      "توليد صور متقدم",
      "إنشاء الفيديوهات والريلز",
      "أنماط تصميم متعددة",
      "إدارة المشاريع",
      "دعم أولوي",
      "رخصة تجارية",
      "وصول API",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameAr: "مؤسسي",
    description: "For agencies and large-scale operations",
    descriptionAr: "للوكالات والعمليات الكبيرة",
    monthlyPrice: 9999, // $99.99
    yearlyPrice: 99990, // $999.90
    creditsPerMonth: 2000,
    features: [
      "2000 credits per month",
      "Unlimited API Calls",
      "White-label Solution",
      "Custom Integrations",
      "Dedicated Account Manager",
      "24/7 Priority Support",
      "Advanced Analytics",
      "Team Collaboration",
      "Custom Training",
      "SLA Guarantee",
    ],
    featuresAr: [
      "2000 رصيد شهري",
      "استدعاءات API غير محدودة",
      "حل White-label",
      "تكاملات مخصصة",
      "مدير حساب مخصص",
      "دعم أولوي 24/7",
      "تحليلات متقدمة",
      "التعاون بين الفرق",
      "تدريب مخصص",
      "ضمان SLA",
    ],
  },
];

/**
 * Credit Costs for Different Operations
 * Defines how many credits each action costs
 */
export const CREDIT_COSTS = {
  // Image Generation
  imageGeneration: {
    basic: 5, // Basic style
    advanced: 10, // Advanced styles
    hd: 20, // HD/High quality
  },
  // Video Generation
  videoGeneration: {
    shortReel: 25, // 15-30 seconds
    mediumVideo: 50, // 1-3 minutes
    longVideo: 100, // 3+ minutes
  },
  // Design Services
  design: {
    graphicDesign: 15,
    brandIdentity: 30,
    socialMediaContent: 8,
    presentation: 20,
  },
  // Other Services
  other: {
    aiChatbot: 2, // Per query
    analytics: 5, // Per report
    export: 1, // Per file export
  },
};

/**
 * Get Stripe Product IDs
 * These should be set after creating products in Stripe
 */
export const getStripeProductIds = () => {
  return {
    pro: process.env.STRIPE_PRODUCT_ID_PRO || "",
    enterprise: process.env.STRIPE_PRODUCT_ID_ENTERPRISE || "",
  };
};

/**
 * Get Stripe Price IDs
 * These should be set after creating prices in Stripe
 */
export const getStripePriceIds = () => {
  return {
    pro_monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || "",
    pro_yearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || "",
    enterprise_monthly: process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY || "",
    enterprise_yearly: process.env.STRIPE_PRICE_ID_ENTERPRISE_YEARLY || "",
  };
};
