import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  let role: string | null = null;

  try {
    const session = await getServerSession(authOptions);
    role = (session?.user as { role?: string })?.role || null;
  } catch (err) {
    console.error("[Home Page] Auth session retrieval error:", err);
  }

  if (role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  } else if (role === "DEPARTMENT_ADMIN") {
    redirect("/department/dashboard");
  } else if (role === "DISTRICT_ADMIN") {
    redirect("/ward/dashboard");
  } else if (role === "WARD_ADMIN") {
    redirect("/ward/dashboard");
  } else if (role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (role === "VICE_PRINCIPAL") {
    redirect("/vice-principal/dashboard");
  } else if (role === "SUBJECT_HEAD") {
    redirect("/teacher/subject-head");
  } else if (role === "TEACHER") {
    redirect("/teacher/dashboard");
  } else if (role === "STUDENT") {
    redirect("/student/dashboard");
  }

  redirect("/login");
}

