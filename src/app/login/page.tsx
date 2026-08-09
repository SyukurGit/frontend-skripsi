"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Headphones, ShieldCheck, UserRound } from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { useAuthedRedirect } from "@/hooks/use-authed-redirect";

const options = [
  {
    href: "/login/user",
    title: "Pengguna",
    description: "Melihat konteks dompet simulasi, membuat ticket, dan berkomunikasi dengan Customer Support.",
    note: "Pemilik data dan ticket",
    icon: UserRound,
  },
  {
    href: "/login/staff",
    title: "Petugas",
    description: "Masuk sebagai Customer Support atau Administrator sesuai skenario pengujian.",
    note: "Akses internal berbasis role",
    icon: Headphones,
  },
];

export default function LoginChooserPage() {
  useAuthedRedirect();

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b border-[#dfe3e8] bg-white">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <LogoMark compact />
          <Button asChild variant="ghost" size="sm">
            <Link href="/homepage">
              <ArrowLeft className="h-4 w-4" />
              Beranda
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand)]">
            <ShieldCheck className="h-4 w-4" />
            Akses prototipe berdasarkan role
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-[#171a21] sm:text-4xl">Pilih aktor untuk memulai skenario.</h1>
          <p className="mt-3 text-sm leading-7 text-[#667085] sm:text-base">
            Login hanya menentukan area awal. Akses berikutnya tetap dibatasi oleh assignment ticket, status, feature, dan session JIT yang valid.
          </p>
        </motion.div>

        <div className="mt-9 grid overflow-hidden border border-[#dfe3e8] bg-[#dfe3e8] md:grid-cols-2">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div key={option.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.06 }}>
                <Link
                  href={option.href}
                  className="group flex h-full min-h-[260px] flex-col bg-white p-6 hover:bg-[#f8fafc] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#22262f] text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowRight className="h-5 w-5 text-[#98a0ad] transition-transform group-hover:translate-x-1 group-hover:text-[var(--brand)]" />
                  </div>
                  <div className="mt-auto pt-10">
                    <div className="text-xs font-medium text-[#b44731]">{option.note}</div>
                    <h2 className="mt-2 text-2xl font-semibold text-[#171a21]">{option.title}</h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-[#667085]">{option.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 border-l-2 border-[var(--coral)] bg-[#fff1ed] px-4 py-3 text-xs leading-5 text-[#6e3c32]">
          Frontend ini merupakan media demonstrasi. Keputusan menerima atau menolak akses tetap dijalankan oleh backend prototipe.
        </div>
      </section>
    </main>
  );
}
