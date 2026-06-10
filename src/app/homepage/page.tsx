"use client";

import Link from "next/link";
import { LogoMark } from "@/components/branding/logo-mark";
import { Button } from "@/components/ui/button";
import { useAuthedRedirect } from "@/hooks/use-authed-redirect";

export default function Homepage() {
  useAuthedRedirect();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <LogoMark compact />
            <div className="flex items-center gap-3">
              <Link href="/login/user">
                <Button variant="ghost" className="text-sm">Pengguna</Button>
              </Link>
              <Link href="/login/staff">
                <Button className="text-sm">Petugas</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700">
            Prototype Demo
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            DompetKu
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Dompet digital aman untuk mengelola saldo, transaksi, dan mendapat bantuan kapan pun dibutuhkan.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login/user">
              <Button className="h-11 px-8 bg-teal-600 hover:bg-teal-700">Masuk sebagai Pengguna</Button>
            </Link>
            <Link href="/login/staff">
              <Button variant="secondary" className="h-11 px-8">Masuk sebagai Petugas</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-950">Fitur Utama</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-950">Dashboard Dompet</h3>
              <p className="mt-2 text-sm text-slate-600">Lihat saldo dan riwayat transaksi dengan tampilan yang jelas dan cepat.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-950">Customer Support</h3>
              <p className="mt-2 text-sm text-slate-600">Hubungi bantuan pelanggan langsung dari aplikasi tanpa keluar.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-950">Keamanan Berlapis</h3>
              <p className="mt-2 text-sm text-slate-600">Akses sensitif dijaga dengan kontrol berbasis peran dan durasi waktu.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-950">Riwayat Lengkap</h3>
              <p className="mt-2 text-sm text-slate-600">Semua aktivitas tercatat dengan audit trail yang transparan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-xs text-slate-500">
            <p className="mb-3">
              <strong>Prototype Demo</strong> | Sistem Dompet Digital DompetKu
            </p>
            <p>
              Copyright © 2026 — Untuk tujuan demonstrasi akademis. Bukan untuk penggunaan production.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
