"use client";

import { FlaskConical, LockKeyhole, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useAuthStore } from "@/store/auth";

const copy = {
  user: {
    icon: FlaskConical,
    title: "Lingkungan simulasi",
    detail: "Saldo dan transaksi adalah data contoh. Tiket bantuan menggunakan backend prototipe.",
  },
  cs: {
    icon: LockKeyhole,
    title: "Ruang kerja terbatas",
    detail: "Login tidak membuka seluruh data. Akses mengikuti assignment ticket, status, feature, dan session JIT.",
  },
  admin: {
    icon: ShieldCheck,
    title: "Pemantauan prototipe",
    detail: "Administrator memantau bukti backend; penerbitan session JIT diputuskan otomatis oleh validasi konteks.",
  },
} as const;

export function RoleScopeNotice() {
  const role = useAuthStore((state) => state.user?.role);
  if (!role) return null;

  const item = copy[role];
  const Icon = item.icon;

  return (
    <motion.aside
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 flex items-start gap-3 border-l-2 border-[var(--coral)] bg-[var(--coral-soft)] px-3 py-2.5 sm:px-4"
      aria-label="Batas penggunaan prototipe"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#b44731]" />
      <div className="min-w-0 text-xs leading-5 text-[#6e3c32] sm:flex sm:gap-2">
        <span className="font-semibold text-[#4f2b24]">{item.title}.</span>
        <span>{item.detail}</span>
      </div>
    </motion.aside>
  );
}
