import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createInquiry,
  getInquiries,
  getPortfolioItems,
  getPortfolioItemsByIndustry,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  getUserSubscription,
  addCreditTransaction,
  getUserCreditTransactions,
  createProject,
  getUserProjects,
  getProjectById,
  createDesign,
  getProjectDesigns,
  getUserPayments,
  createReview,
  getReviews,
  updateUserSubscription,
  getMonitoringJobs,
  createMonitoringJob,
  updateMonitoringJob,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { generateImage } from "./_core/imageGeneration";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  inquiries: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1, "الاسم مطلوب"),
          email: z.string().email("بريد إلكتروني غير صحيح"),
          phone: z.string().min(1, "رقم الهاتف مطلوب"),
          companyName: z.string().optional(),
          serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
          projectDescription: z.string().min(10, "وصف المشروع يجب أن يكون 10 أحرف على الأقل"),
          budgetRange: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await createInquiry({
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            companyName: input.companyName || null,
            serviceType: input.serviceType,
            projectDescription: input.projectDescription,
            budgetRange: input.budgetRange || null,
            status: "new",
          });

          try {
            await notifyOwner({
              title: "استفسار جديد من Pixel & Reel",
              content: `استفسار جديد من ${input.fullName}\n\nالبريد الإلكتروني: ${input.email}\nرقم الهاتف: ${input.phone}\nالشركة: ${input.companyName || "غير محدد"}\nنوع الخدمة: ${input.serviceType}\nوصف المشروع: ${input.projectDescription}\nنطاق الميزانية: ${input.budgetRange || "غير محدد"}`,
            });
          } catch (error) {
            console.error("Failed to notify owner:", error);
          }

          return { success: true, id: (result as any).insertId || 0 };
        } catch (error) {
          console.error("Error creating inquiry:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ عند إرسال الاستفسار",
          });
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return getInquiries();
    }),
  }),

  portfolio: router({
    list: publicProcedure.query(async () => {
      return getPortfolioItems();
    }),

    byIndustry: publicProcedure
      .input(z.object({ industry: z.string() }))
      .query(async ({ input }) => {
        return getPortfolioItemsByIndustry(input.industry);
      }),
  }),

  // Subscription Plans
  subscriptions: router({
    getPlans: publicProcedure.query(async () => {
      return getSubscriptionPlans();
    }),

    getPlan: publicProcedure
      .input(z.object({ planId: z.number() }))
      .query(async ({ input }) => {
        return getSubscriptionPlanById(input.planId);
      }),

    getUserSubscription: protectedProcedure.query(async ({ ctx }) => {
      return getUserSubscription(ctx.user.id);
    }),
  }),

  // Credits & Transactions
  credits: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await getUserSubscription(ctx.user.id);
      return {
        currentCredits: subscription?.currentCredits || 0,
        totalCreditsUsed: subscription?.totalCreditsUsed || 0,
      };
    }),

    getTransactions: protectedProcedure.query(async ({ ctx }) => {
      return getUserCreditTransactions(ctx.user.id);
    }),

    deductCredits: protectedProcedure
      .input(
        z.object({
          amount: z.number().positive(),
          description: z.string(),
          projectId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const subscription = await getUserSubscription(ctx.user.id);
        if (!subscription) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "No active subscription",
          });
        }

        if (subscription.currentCredits < input.amount) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Insufficient credits",
          });
        }

        await addCreditTransaction({
          userId: ctx.user.id,
          amount: -input.amount,
          type: "usage",
          description: input.description,
          relatedProjectId: input.projectId,
        });

        await updateUserSubscription(subscription.id, {
          currentCredits: subscription.currentCredits - input.amount,
          totalCreditsUsed: subscription.totalCreditsUsed + input.amount,
        });

        return { success: true };
      }),
  }),

  // Projects
  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserProjects(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          type: z.enum(["image", "video", "design"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await createProject({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          type: input.type,
          status: "draft",
        });

        return { success: true, projectId: (result as any).insertId };
      }),

    getById: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }
        return project;
      }),
  }),

  // Designs
  designs: router({
    getProjectDesigns: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }
        return getProjectDesigns(input.projectId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          projectId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          style: z.string().optional(),
          prompt: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        const result = await createDesign({
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          style: input.style,
          prompt: input.prompt,
        });

        return { success: true, designId: (result as any).insertId };
      }),
  }),

  // Payments
  payments: router({
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return getUserPayments(ctx.user.id);
    }),
  }),

  // Reviews
  reviews: router({
    getAll: publicProcedure.query(async () => {
      return getReviews();
    }),

    create: protectedProcedure
      .input(
        z.object({
          rating: z.number().min(1).max(5),
          title: z.string().min(1),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await createReview({
          userId: ctx.user.id,
          rating: input.rating,
          title: input.title,
          content: input.content,
        });

        return { success: true, reviewId: (result as any).insertId };
      }),
  }),

  // AI Image Generation
  imageGeneration: router({
    generate: protectedProcedure
      .input(
        z.object({
          prompt: z.string().min(10),
          style: z.string().default("realistic"),
          projectId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Check credits first
          const subscription = await getUserSubscription(ctx.user.id);
          if (!subscription || subscription.currentCredits < 10) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "أرصدة غير كافية لتوليد الصورة",
            });
          }

          // Generate image using AI
          const imageResult = await generateImage({
            prompt: `${input.prompt} in ${input.style} style`,
          });

          // Deduct credits
          await addCreditTransaction({
            userId: ctx.user.id,
            amount: -10,
            type: "usage",
            description: `توليد صورة: ${input.prompt.substring(0, 50)}`,
            relatedProjectId: input.projectId,
          });

          await updateUserSubscription(subscription.id, {
            currentCredits: subscription.currentCredits - 10,
            totalCreditsUsed: subscription.totalCreditsUsed + 10,
          });

          // Save design to project if projectId provided
          if (input.projectId) {
            await createDesign({
              projectId: input.projectId,
              title: input.prompt.substring(0, 100),
              description: input.prompt,
              imageUrl: imageResult.url,
              style: input.style,
              prompt: input.prompt,
            });
          }

          return {
            success: true,
            imageUrl: imageResult.url,
            creditsUsed: 10,
          };
        } catch (error) {
          console.error("Error generating image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ في توليد الصورة",
          });
        }
      }),
  }),

  // AI Video Generation
  videoGeneration: router({
    generate: protectedProcedure
      .input(
        z.object({
          script: z.string().min(10),
          template: z.string().default("promo"),
          projectId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Check credits
          const subscription = await getUserSubscription(ctx.user.id);
          const creditsToDeduct = input.template === "animation" ? 100 : 50;

          if (!subscription || subscription.currentCredits < creditsToDeduct) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "أرصدة غير كافية لتوليد الفيديو",
            });
          }

          // Deduct credits
          await addCreditTransaction({
            userId: ctx.user.id,
            amount: -creditsToDeduct,
            type: "usage",
            description: `توليد فيديو ${input.template}`,
            relatedProjectId: input.projectId,
          });

          await updateUserSubscription(subscription.id, {
            currentCredits: subscription.currentCredits - creditsToDeduct,
            totalCreditsUsed: subscription.totalCreditsUsed + creditsToDeduct,
          });

          // Save video project
          if (input.projectId) {
            await createDesign({
              projectId: input.projectId,
              title: `فيديو ${input.template}`,
              description: input.script,
              style: input.template,
              prompt: input.script,
            });
          }

          return {
            success: true,
            videoUrl: "https://via.placeholder.com/1280x720?text=Video+Generated",
            creditsUsed: creditsToDeduct,
            message: "سيتم توليد الفيديو قريباً",
          };
        } catch (error) {
          console.error("Error generating video:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ في توليد الفيديو",
          });
        }
      }),
  }),

  aiAssistant: router({
    chat: protectedProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["system", "user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { invokeLLM } = await import("./_core/llm");
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "أنت مساعد ذكي لمنصة Pixel & Reel Studio المتخصصة في توليد الصور والفيديوهات بالذكاء الاصطناعي في الإمارات. ساعد المستخدمين في كتابة برومبتات (Prompts) احترافية، وشرح ميزات المنصة، وتقديم نصائح إبداعية. تحدث بلهجة احترافية وودودة باللغة العربية.",
              },
              ...input.messages,
            ],
          });

          const aiMessage = response.choices[0].message.content;
          return typeof aiMessage === "string" ? aiMessage : JSON.stringify(aiMessage);
        } catch (error) {
          console.error("AI Assistant error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ في معالجة طلب المساعد الذكي",
          });
        }
      }),
  }),

  monitoring: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getMonitoringJobs();
    }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          type: z.string(),
          config: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return createMonitoringJob({
          name: input.name,
          type: input.type,
          config: input.config,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
