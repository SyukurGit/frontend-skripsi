"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  FlaskConical,
  Headphones,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { useAuthedRedirect } from "@/hooks/use-authed-redirect";
import { formatMoneyIDR } from "@/utils/format";

const transactions = [
  { label: "Top up virtual account", time: "12 Mei, 09.10", value: 2500000, incoming: true },
  { label: "Pembayaran internet", time: "10 Mei, 08.22", value: 420000, incoming: false },
  { label: "Cashback merchant", time: "9 Mei, 14.17", value: 75000, incoming: true },
];

export default function Homepage() {
  useAuthedRedirect();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fa] text-[#171a21]">
      <div className="border-b border-[#dfe3e8] bg-[#fff9f7]">
        <div className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 text-xs leading-5 text-[#6e3c32] sm:items-center sm:px-6">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-[#b44731] sm:mt-0" />
          <span>
            <strong>Prototipe akademik.</strong> Tidak memproses transaksi, saldo, atau dana nyata.
          </span>
        </div>
      </div>

      <header className="border-b border-[#dfe3e8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <LogoMark compact />
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login/user">Portal pengguna</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login/staff">
                Portal petugas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#dfe3e8] bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-9 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:pb-14">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#b44731]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
              Media demonstrasi backend access control
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] text-[#171a21] sm:text-5xl lg:text-6xl">DompetKu</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#596170] sm:text-lg">
              Prototipe sistem dompet digital untuk memperlihatkan pembatasan akses pengguna internal berdasarkan role, assignment ticket, dan session Just-In-Time.
            </p>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login/user">
                  Masuk sebagai pengguna
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login/staff">Buka ruang petugas</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.42 }}
            className="mt-10 overflow-hidden border-y border-[#dfe3e8] bg-[#f8fafc] lg:grid lg:grid-cols-[1.15fr_0.85fr]"
          >
            <div className="border-b border-[#dfe3e8] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-medium text-[#7b8492]">Saldo simulasi</div>
                  <div className="mt-2 text-3xl font-semibold font-tabular sm:text-4xl">{formatMoneyIDR(12500000)}</div>
                  <div className="mt-2 inline-flex items-center gap-2 text-xs text-[#667085]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3a8a63]" />
                    Akun contoh aktif
                  </div>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/login/user">
                    <Headphones className="h-4 w-4" />
                    Buat tiket bantuan
                  </Link>
                </Button>
              </div>

              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#596170]">Aktivitas contoh</span>
                  <span className="text-[11px] text-[#98a0ad]">Bukan mutasi backend</span>
                </div>
                <div className="divide-y divide-[#e9ecf0] border-y border-[#e1e5ea] bg-white">
                  {transactions.map((item) => {
                    const Icon = item.incoming ? ArrowDownLeft : ArrowUpRight;
                    return (
                      <div key={item.label} className="flex items-center justify-between gap-3 px-3 py-3.5 sm:px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#edf0f4] text-[#596170]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[#252932]">{item.label}</span>
                            <span className="block text-xs text-[#98a0ad]">{item.time}</span>
                          </span>
                        </div>
                        <span className="shrink-0 text-sm font-semibold font-tabular text-[#252932]">
                          {item.incoming ? "+" : "-"}
                          {formatMoneyIDR(item.value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-[#22262f] p-5 text-white sm:p-7">
              <div className="flex items-center gap-2 text-xs font-medium text-white/55">
                <MessageSquareText className="h-4 w-4" />
                Konteks bantuan aktif
              </div>
              <div className="mt-5 border-l-2 border-[var(--coral)] pl-4">
                <div className="text-lg font-semibold">Ticket #1042</div>
                <p className="mt-1 text-sm leading-6 text-white/65">Assignment ticket membentuk lingkup kerja Customer Support.</p>
              </div>
              <div className="mt-7 space-y-4">
                <ScopeRow icon={ShieldCheck} label="Role terverifikasi" value="Customer Support" />
                <ScopeRow icon={LockKeyhole} label="Profil pengguna" value="Dibatasi" />
                <ScopeRow icon={Clock3} label="Session JIT" value="Belum diterbitkan" />
              </div>
              <div className="mt-7 border-t border-white/10 pt-5 text-xs leading-5 text-white/55">
                Keputusan akses tetap ditegakkan backend. Antarmuka ini hanya menyajikan alur demonstrasinya.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f5f7fa]">
        <div className="mx-auto grid max-w-7xl gap-px border-x border-b border-[#dfe3e8] bg-[#dfe3e8] sm:grid-cols-3">
          {[
            ["01", "Role", "RBAC membentuk batas awal antaraktor."],
            ["02", "Konteks", "Least Privilege mengikuti assignment ticket."],
            ["03", "Waktu", "Session JIT berlaku untuk feature dan durasi tertentu."],
          ].map(([number, title, description]) => (
            <div key={number} className="bg-white p-5 sm:p-6">
              <div className="text-xs font-semibold text-[var(--coral)]">{number}</div>
              <div className="mt-3 text-base font-semibold">{title}</div>
              <p className="mt-1 text-sm leading-6 text-[#667085]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#dfe3e8] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-[#7b8492] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>DompetKu · Prototipe penelitian 2026</span>
          <span>Frontend demonstrasi, bukan layanan finansial</span>
        </div>
      </footer>
    </main>
  );
}

function ScopeRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/8 text-white/70">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] text-white/45">{label}</span>
        <span className="block truncate text-sm font-medium text-white/85">{value}</span>
      </span>
    </div>
  );
}
