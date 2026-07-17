/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const thesisMeta = {
  title:
    "Implementasi Mekanisme Least Privilege dan Just-in-Time Access pada Layer Kontrol Akses Pengguna Internal dalam Prototipe Sistem Dompet Digital",
  author: "Muhammad Syukur",
  studentId: "220705058",
  studyProgram: "Teknologi Informasi",
  campus: "UIN Ar-Raniry Banda Aceh",
  advisor: "Ghufran Ibnu Yasa, M.T.",
  advisor2: "Mulkan Fadhli, S.T., M.T.",
  buildDate: "2026",
  profileImage: "/images/skripsi/pp2.jpg",
  jitDiagramImage: "/images/skripsi/d1.png",
  githubPrimary: "https://github.com/SyukurGit/backend-skripsi",
  githubSecondary: "https://github.com/SyukurGit/frontend-skripsi",
  driveLink: "https://drive.google.com/drive/folders/-",
};

const navItems = [
  { label: "Ringkasan", href: "#ringkasan" },
  { label: "Mekanisme", href: "#mekanisme" },
  { label: "Pengujian", href: "#pengujian" },
  { label: "Lampiran", href: "#lampiran" },
];

const quickFacts: any[] = [

];

const researchSummary = [
  {
    label: "Masalah",
    title: "Akses internal dapat sah, tetapi tetap terlalu luas.",
    body: "RBAC memisahkan area berdasarkan role, namun belum otomatis membatasi data sesuai tugas dan durasi penggunaan fitur sensitif.",
  },
  {
    label: "Pendekatan",
    title: "RBAC diperkuat dengan pembatas konteks dan waktu.",
    body: "Least Privilege membatasi Customer Support berdasarkan assignment ticket. JIT membuka fitur sensitif melalui session sementara yang spesifik.",
  },
  {
    label: "Hasil",
    title: "Kontrol berlapis berjalan sesuai rancangan prototipe.",
    body: "Seluruh 19 skenario menghasilkan keputusan terima atau tolak sesuai hasil yang diharapkan pada pengujian backend.",
  },
];

const mechanismLayers = [
  {
    number: "01",
    title: "RBAC",
    subtitle: "Siapa boleh masuk?",
    body: "Memisahkan endpoint User, Customer Support, dan Administrator berdasarkan role pada JWT.",
  },
  {
    number: "02",
    title: "Least Privilege",
    subtitle: "Ticket mana boleh diakses?",
    body: "Memeriksa assigned_cs_id dan konteks ticket agar CS tidak memperoleh akses global ke seluruh pengguna.",
  },
  {
    number: "03",
    title: "Just-in-Time Access",
    subtitle: "Fitur apa dan sampai kapan?",
    body: "Mengikat session pada CS, ticket, feature, status aktif, dan expired_at sebelum fitur sensitif dijalankan.",
  },
];

const operationalFlow = [
  "User membuat ticket bantuan.",
  "CS melakukan claim dan menjadi penanggung jawab ticket.",
  "Backend memvalidasi role, assignment, serta status ticket.",
  "CS meminta JIT untuk feature sensitif tertentu.",
  "Session digunakan satu kali, lalu tidak dapat dipakai kembali.",
];

const testGroups = [
  {
    name: "RBAC",
    score: "7/7",
    description: "Akses sesuai role diterima dan akses lintas role ditolak.",
  },
  {
    name: "Least Privilege",
    score: "5/5",
    description: "Claim serta detail ticket dibatasi berdasarkan assignment CS.",
  },
  {
    name: "Just-in-Time Access",
    score: "7/7",
    description: "Session, feature, konteks ticket, dan waktu divalidasi sebelum eksekusi.",
  },
];

const visualEvidence = [
  {
    title: "Sebelum penguatan Least Privilege",
    image: "/images/skripsi/sebelum.png",
    caption: "RBAC dasar masih berpotensi memberi lingkup akses yang terlalu luas.",
  },
  {
    title: "Setelah penguatan Least Privilege",
    image: "/images/skripsi/sesudah.png",
    caption: "Akses dipersempit ke ticket yang benar-benar ditugaskan kepada CS.",
  },
  {
    title: "Alur validasi Just-in-Time Access",
    image: thesisMeta.jitDiagramImage,
    caption: "Fitur sensitif hanya dijalankan setelah session dan konteks dinyatakan valid.",
  },
];

const boundaries = [
  "Prototipe bukan sistem dompet digital komersial lengkap dan tidak mencakup integrasi pembayaran nyata.",
  "Evaluasi berfokus pada backend enforcement, bukan keamanan jaringan, server, atau deployment production.",
  "Hasil 19/19 menunjukkan kesesuaian implementasi dengan rancangan, bukan keamanan absolut.",
];

const resources = [
  {
    label: "Repository Backend",
    description: "API, middleware, assignment ticket, JIT session, dan audit log.",
    href: thesisMeta.githubPrimary,
  },
  {
    label: "Repository Frontend",
    description: "Antarmuka demonstrasi dan alur penggunaan prototipe.",
    href: thesisMeta.githubSecondary,
  },
  {
    label: "Dokumen dan Lampiran",
    description: "Draft skripsi, bukti pengujian, dan dokumen pendukung.",
    href: thesisMeta.driveLink,
  },
];

export default function SkripsiPage() {
  const [viewer, setViewer] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!viewer) return;

    const previousOverflow = document.body.style.overflow;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewer(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [viewer]);

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#183142]">
      <header className="sticky top-0 z-40 border-b border-[#d9d5cc] bg-[#f4f1ea]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="min-w-0" aria-label="Kembali ke bagian atas">
            <p className="truncate text-sm font-extrabold tracking-tight text-[#183142]">Tugas Akhir Muhammad Syukur</p>
            <p className="text-[11px] font-semibold text-[#66756f]">Teknologi Informasi · 2026</p>
          </a>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Navigasi halaman">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-bold text-[#52645f] transition hover:bg-white/70 hover:text-[#183142]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link
            href="/homepage"
            className="ml-auto inline-flex h-10 flex-none items-center justify-center rounded-xl bg-[#0f766e] px-4 text-sm font-extrabold text-white transition hover:bg-[#0b5f59] md:ml-3"
          >
            Lihat Prototipe
          </Link>
        </div>

        <nav className="overflow-x-auto border-t border-[#e5e1d8] px-4 py-2 md:hidden" aria-label="Navigasi halaman mobile">
          <div className="mx-auto flex w-max gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-extrabold text-[#52645f] hover:bg-white/70"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section id="top" className="scroll-mt-28 border-b border-[#213d4f] bg-[#102a3a] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(310px,.75fr)] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#88d5c9]">Judul Tugas Akhir</p>
            <h1
              className="mt-4 max-w-5xl text-3xl font-bold leading-[1.16] tracking-[-0.025em] text-white sm:text-4xl lg:text-[46px]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {thesisMeta.title}
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-[#d6e0e3] sm:text-base sm:leading-8">
              Implementasi kontrol akses berlapis pada backend untuk membatasi <strong className="text-white">lingkup akses</strong> pengguna internal melalui assignment ticket dan membatasi <strong className="text-white">fitur serta durasi akses sensitif</strong> melalui session Just-in-Time.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/homepage"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0f766e] px-6 text-sm font-extrabold text-white transition hover:bg-[#13867d]"
              >
                Lihat Prototipe
              </Link>
              <a
                href="#ringkasan"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-extrabold text-white transition hover:bg-white/10"
              >
                Baca Ringkasan
              </a>
            </div>
          </div>

          <aside className="rounded-[24px] border border-white/15 bg-white/[0.07] p-4 sm:p-5">
            <div className="grid grid-cols-[108px_1fr] gap-4 sm:grid-cols-[126px_1fr]">
              <button
                type="button"
                onClick={() => setViewer({ src: thesisMeta.profileImage, alt: `Foto ${thesisMeta.author}` })}
                className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-left transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#88d5c9]"
                aria-label="Perbesar foto penulis"
              >
                <img
                  src={thesisMeta.profileImage}
                  alt={`Foto ${thesisMeta.author}`}
                  className="h-full min-h-[148px] w-full object-cover"
                />
              </button>

              <div className="min-w-0 py-1">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#88d5c9]">Identitas Penulis</p>
                <h2 className="mt-2 text-xl font-extrabold text-white">{thesisMeta.author}</h2>
                <p className="mt-1 text-sm font-semibold text-[#c8d5d9]">NIM {thesisMeta.studentId}</p>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs leading-5 text-[#c8d5d9]">
                  <p>{thesisMeta.studyProgram}</p>
                  <p>{thesisMeta.campus}</p>
                  <p>Tahun {thesisMeta.buildDate}</p>
                </div>
              </div>
            </div>

            <dl className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <MetaItem label="Pembimbing I" value={thesisMeta.advisor} />
              <MetaItem label="Pembimbing II" value={thesisMeta.advisor2} />
            </dl>
          </aside>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[22px] border border-[#ddd9d0] bg-white shadow-[0_14px_40px_rgba(24,49,66,0.08)] sm:grid-cols-2 lg:grid-cols-4">
          {quickFacts.map((item) => (
            <article key={item.label} className="border-b border-[#ece8df] p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <p className="text-2xl font-black tracking-tight text-[#0f766e]">{item.value}</p>
              <p className="mt-1 text-sm font-extrabold text-[#183142]">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-[#6b7773]">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section id="ringkasan" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Ringkasan penelitian"
            title="Masalah, pendekatan, dan hasil dalam satu alur baca"
            description="Bagian ini sengaja dibuat singkat agar pembaca memahami posisi penelitian sebelum melihat detail teknis."
          />

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {researchSummary.map((item, index) => (
              <article key={item.label} className="rounded-[22px] border border-[#ddd9d0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{item.label}</p>
                  <span className="text-sm font-black text-[#b78a43]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold leading-snug text-[#183142]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6d69]">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-5 rounded-[24px] border border-[#cfdad6] bg-[#edf5f2] p-6 lg:grid-cols-[1fr_1fr] lg:p-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Metode</p>
              <p className="mt-3 text-sm leading-7 text-[#324b4b]">
                Penelitian terapan berbasis prototipe dengan scenario-based black-box testing. Evaluasi dilakukan melalui respons API, perubahan database, serta audit log dan terminal log sebagai bukti pendukung.
              </p>
            </div>
            <div className="border-t border-[#cad9d5] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Klaim yang tepat</p>
              <p className="mt-3 text-sm font-bold leading-7 text-[#183f3c]">
                Kombinasi RBAC, Least Privilege, dan Just-in-Time Access berhasil membatasi lingkup serta durasi akses sesuai rancangan dalam lingkungan prototipe.
              </p>
            </div>
          </div>
        </section>

        <section id="mekanisme" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Mekanisme kontrol akses"
            title="Tiga lapisan, tiga pertanyaan yang berbeda"
            description="Setiap lapisan memiliki tanggung jawab sendiri dan seluruh keputusan utama ditegakkan pada backend."
          />

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {mechanismLayers.map((item) => (
              <article key={item.number} className="rounded-[22px] border border-[#ddd9d0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{item.title}</p>
                  <span className="font-mono text-xs font-bold text-[#9a7a47]">{item.number}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-[#183142]">{item.subtitle}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6d69]">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] bg-[#102a3a] p-6 text-white sm:p-7">
            <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#88d5c9]">Alur operasional</p>
                <h3 className="mt-3 text-2xl font-extrabold leading-tight">Ticket menjadi konteks utama setiap akses sensitif.</h3>
                <p className="mt-4 text-sm leading-7 text-[#c8d5d9]">
                  JIT menggunakan contextual auto-approval berdasarkan kondisi backend, bukan persetujuan manual Administrator.
                </p>
              </div>

              <ol className="grid gap-3 sm:grid-cols-2">
                {operationalFlow.map((item, index) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-[#e1e9eb]">
                    <span className="font-mono text-xs font-black text-[#88d5c9]">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="pengujian" className="scroll-mt-32">
          <SectionHeading
            eyebrow="Hasil pengujian"
            title="19 skenario memverifikasi kondisi diterima dan ditolak"
            description="Nilai 19/19 berarti hasil aktual sesuai dengan hasil yang dirancang, bukan skor keamanan absolut."
          />

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {testGroups.map((group) => (
              <article key={group.name} className="rounded-[22px] border border-[#ddd9d0] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-[#61716c]">{group.name}</p>
                    <p className="mt-3 text-sm leading-7 text-[#5f6d69]">{group.description}</p>
                  </div>
                  <span className="rounded-xl bg-[#dff1ec] px-3 py-2 text-lg font-black text-[#0f766e]">{group.score}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-5 rounded-[24px] border border-[#e2d5bb] bg-[#faf4e8] p-6 lg:grid-cols-2 lg:p-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#936b2f]">Bukti yang diamati</p>
              <p className="mt-3 text-sm leading-7 text-[#5f584b]">
                Respons dan status HTTP, perubahan state database, data pada tabel jit_sessions, serta audit log dan terminal log.
              </p>
            </div>
            <div className="border-t border-[#e8dbc2] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#936b2f]">Interpretasi</p>
              <p className="mt-3 text-sm leading-7 text-[#5f584b]">
                Bukti penting bukan hanya request yang berhasil, tetapi juga penolakan lintas role, ticket milik CS lain, session expired, feature mismatch, dan konteks ticket yang tidak valid.
              </p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Bukti visual"
            title="Diagram utama untuk mempercepat pemahaman"
            description="Klik gambar untuk memperbesar. Penjelasan dibuat satu kalimat agar halaman tetap ringan."
          />

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {visualEvidence.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-[22px] border border-[#ddd9d0] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewer({ src: item.image, alt: item.title })}
                  className="block w-full bg-[#f8f7f3] p-3 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0f766e]"
                  aria-label={`Perbesar gambar ${item.title}`}
                >
                  <img src={item.image} alt={item.title} className="h-52 w-full rounded-xl bg-white object-contain" loading="lazy" />
                </button>
                <div className="p-5">
                  <h3 className="text-base font-extrabold text-[#183142]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#66736f]">{item.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <article className="rounded-[24px] border border-[#cfdad6] bg-[#edf5f2] p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">Kontribusi penelitian</p>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#183142]">Membawa LP dan JIT ke backend application access control layer.</h2>
            <p className="mt-4 text-sm leading-7 text-[#4d625d]">
              Penelitian memodelkan kontrol akses internal secara terbuka melalui kombinasi role, assignment ticket, status ticket, feature sensitif, session sementara, dan log. Kontribusinya bersifat implementatif dan akademik, bukan penciptaan algoritma baru.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#e2d5bb] bg-[#faf4e8] p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#936b2f]">Batas klaim</p>
            <ul className="mt-4 space-y-3">
              {boundaries.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-[#5f584b]">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-[#b78a43]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section id="lampiran" className="scroll-mt-32">
          <div className="overflow-hidden rounded-[26px] bg-[#102a3a] text-white">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr] lg:p-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#88d5c9]">Repository dan lampiran</p>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight">Source code dan bukti penelitian</h2>
                <p className="mt-4 text-sm leading-7 text-[#c8d5d9]">
                  Backend, frontend, dan dokumen pendukung dipisahkan agar implementasi serta bukti pengujian mudah ditinjau.
                </p>

                <dl className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  <DarkMetaRow label="Nama" value={thesisMeta.author} />
                  <DarkMetaRow label="NIM" value={thesisMeta.studentId} />
                  <DarkMetaRow label="Program Studi" value={thesisMeta.studyProgram} />
                  <DarkMetaRow label="Institusi" value={thesisMeta.campus} />
                  <DarkMetaRow label="Pembimbing I" value={thesisMeta.advisor} />
                  <DarkMetaRow label="Pembimbing II" value={thesisMeta.advisor2} />
                </dl>
              </div>

              <div className="space-y-3">
                {resources.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[38px_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-[#88d5c9]/60 hover:bg-white/[0.09] sm:p-5"
                  >
                    <span className="font-mono text-xs font-black text-[#88d5c9]">0{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-white">{item.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-[#b9c8cc]">{item.description}</span>
                    </span>
                    <span className="text-lg text-[#88d5c9] transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#d9d5cc] bg-[#eeeae2]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-xs text-[#65726e] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {thesisMeta.buildDate} {thesisMeta.author}. Halaman ringkasan tugas akhir.</p>
          <a href="#top" className="font-extrabold text-[#183142] hover:text-[#0f766e]">Kembali ke atas ↑</a>
        </div>
      </footer>

      {viewer ? <ImageViewer src={viewer.src} alt={viewer.alt} onClose={() => setViewer(null)} /> : null}
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#0f766e]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.02em] text-[#183142] sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#64716d] sm:text-base sm:leading-8">{description}</p>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-black uppercase tracking-[0.13em] text-[#88d5c9]">{label}</dt>
      <dd className="mt-1 text-xs font-semibold leading-5 text-[#e1e9eb]">{value}</dd>
    </div>
  );
}

function DarkMetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3">
      <dt className="text-xs text-[#8fa3a9]">{label}</dt>
      <dd className="text-xs font-bold leading-5 text-[#e1e9eb]">{value}</dd>
    </div>
  );
}

function ImageViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#071722]/90 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Tampilan gambar: ${alt}`}
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-[22px] border border-white/10 bg-[#102a3a] p-2 shadow-2xl sm:p-3"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-2 pb-2 pt-1 sm:px-3 sm:pb-3">
          <p className="min-w-0 truncate text-xs font-bold text-[#d6e0e3] sm:text-sm">{alt}</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-black text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#88d5c9]"
            autoFocus
          >
            Tutup ×
          </button>
        </div>
        <img src={src} alt={alt} className="max-h-[82vh] w-full rounded-[16px] bg-white object-contain" />
      </div>
    </div>
  );
}