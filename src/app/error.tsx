"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-center backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
          Đã có lỗi xảy ra
        </h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Hệ thống gặp sự cố khi tải trang này. Bạn có thể thử tải lại hoặc quay về trang đăng nhập.
        </p>

        {error?.digest && (
          <p className="text-[11px] font-mono text-slate-500 mb-4 bg-slate-950/50 py-1.5 px-3 rounded-lg inline-block border border-slate-800">
            Mã lỗi: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-600/20 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-600/60"
          >
            <Home className="w-4 h-4" />
            <span>Đăng nhập</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
