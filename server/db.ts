import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  inquiries,
  InsertInquiry,
  portfolioItems,
  subscriptionPlans,
  userSubscriptions,
  InsertUserSubscription,
  creditTransactions,
  InsertCreditTransaction,
  projects,
  InsertProject,
  designs,
  InsertDesign,
  payments,
  InsertPayment,
  reviews,
  InsertReview,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createInquiry(inquiry: InsertInquiry) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(inquiries).values(inquiry);
  return result;
}

export async function getInquiries() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db.select().from(inquiries).orderBy(inquiries.createdAt);
}

export async function getPortfolioItems() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db.select().from(portfolioItems).orderBy(portfolioItems.createdAt);
}

export async function getPortfolioItemsByIndustry(industry: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db.select().from(portfolioItems).where(eq(portfolioItems.industry, industry));
}

// Subscription Plans
export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, 1));
}

export async function getSubscriptionPlanById(planId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId)).limit(1);
  return result[0];
}

// User Subscriptions
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(userSubscriptions)
    .where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.status, "active")))
    .limit(1);
  return result[0];
}

export async function createUserSubscription(subscription: InsertUserSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userSubscriptions).values(subscription);
  return result;
}

export async function updateUserSubscription(subscriptionId: number, updates: Partial<InsertUserSubscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(userSubscriptions).set(updates).where(eq(userSubscriptions.id, subscriptionId));
}

// Credit Transactions
export async function addCreditTransaction(transaction: InsertCreditTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(creditTransactions).values(transaction);
}

export async function getUserCreditTransactions(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(creditTransactions).where(eq(creditTransactions.userId, userId)).orderBy(creditTransactions.createdAt);
}

// Projects
export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(project);
  return result;
}

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(projects.createdAt);
}

export async function getProjectById(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return result[0];
}

// Designs
export async function createDesign(design: InsertDesign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(designs).values(design);
}

export async function getProjectDesigns(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(designs).where(eq(designs.projectId, projectId)).orderBy(designs.createdAt);
}

// Payments
export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(payments).values(payment);
}

export async function getUserPayments(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(payments.createdAt);
}

// Reviews
export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reviews).values(review);
}

export async function getReviews() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(reviews).where(eq(reviews.isVerified, 1)).orderBy(reviews.createdAt);
}
