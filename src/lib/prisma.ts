import { PrismaClient } from "@prisma/client";

// Tự động phân giải DATABASE_URL từ các biến tích hợp sẵn của Supabase / Vercel
function resolveDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return process.env.DATABASE_URL.trim();
  }
  // Vercel Supabase Integration biến chuyên dụng cho Prisma
  if (process.env.POSTGRES_PRISMA_URL && process.env.POSTGRES_PRISMA_URL.trim() !== "") {
    return process.env.POSTGRES_PRISMA_URL.trim();
  }
  // Vercel Supabase Integration biến URL chung
  if (process.env.POSTGRES_URL && process.env.POSTGRES_URL.trim() !== "") {
    return process.env.POSTGRES_URL.trim();
  }
  if (process.env.POSTGRES_URL_NON_POOLING && process.env.POSTGRES_URL_NON_POOLING.trim() !== "") {
    return process.env.POSTGRES_URL_NON_POOLING.trim();
  }
  // Tự động ghép chuỗi kết nối từ các thông số rời rạc do Vercel tích hợp (POSTGRES_HOST, POSTGRES_PASSWORD, ...)
  if (process.env.POSTGRES_HOST && process.env.POSTGRES_PASSWORD) {
    const user = process.env.POSTGRES_USER || "postgres";
    const password = encodeURIComponent(process.env.POSTGRES_PASSWORD);
    const host = process.env.POSTGRES_HOST;
    const port = process.env.POSTGRES_PORT || "5432";
    const database = process.env.POSTGRES_DATABASE || "postgres";
    return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
  }
  return undefined;
}

const resolvedDbUrl = resolveDatabaseUrl();

// Đồng bộ biến môi trường cho Prisma
if (resolvedDbUrl) {
  process.env.DATABASE_URL = resolvedDbUrl;
  if (!process.env.DIRECT_URL) {
    process.env.DIRECT_URL =
      process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || resolvedDbUrl;
  }
} else {
  if (process.env.NODE_ENV !== "production") {
    console.warn("⚠️ CẢNH BÁO: Không tìm thấy biến môi trường DATABASE_URL hoặc cấu hình Supabase trên Vercel.");
  } else {
    throw new Error("LỖI: Thiếu biến môi trường DATABASE_URL hoặc POSTGRES_PRISMA_URL. Không thể kết nối cơ sở dữ liệu.");
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    ...(resolvedDbUrl ? { datasourceUrl: resolvedDbUrl } : {}),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
