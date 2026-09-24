import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  if (process.env.NODE_ENV !== "production") {
    console.warn("⚠️  CẢNH BÁO: Không tìm thấy biến môi trường DATABASE_URL. Hãy kiểm tra lại file .env của bạn.");
  } else {
    throw new Error("LỖI: Thiếu biến môi trường DATABASE_URL. Không thể kết nối đến cơ sở dữ liệu.");
  }
}

const defaultDbUrl = process.env.DATABASE_URL || "";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasourceUrl: defaultDbUrl,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
