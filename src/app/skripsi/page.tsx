/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";

const thesisMeta = {
  title: "Implementasi Mekanisme Least Privilege dan Just-in-Time Access pada Layer Kontrol Akses Pengguna Internal dalam Prototipe Sistem Dompet Digital",
  projectName: "Judul Skripsi :",
  author: "Muhammad Syukur",
  studentId: "220705058",
  studyProgram: "Teknologi Informasi",
  campus: "Uin Ar-Raniry Banda Aceh",
  advisor: "Ghufran Ibnu Yasa, M.T",
  advisor2: "Mulkan Fadhli, M.T",
  buildDate: "2026",
  profileImage: "/images/skripsi/pp2.jpg",
  diagramImage: "/images/skripsi/d1.png",
  githubPrimary: "https://github.com/SyukurGit/backend-skripsi",
  githubSecondary: "https://github.com/SyukurGit/frontend-skripsi",
  driveLink: "https://drive.google.com/drive/folders/-",
};

const keyPoints = [
  {
    label: "Masalah utama",
    value: "Penyalahgunaan Internal / Insider Threat",
    description: "Risiko muncul dari Peran atau ROLE pengguna internal sistem yang memiliki kredensial sah, tetapi berpotensi mengakses atau mengubah data di luar kebutuhan tugasnya.",
  },
  {
    label: "Kelemahan dasar",
    value: "RBAC Saja Belum Cukup",
    description: "Role seperti RBAC dapat membatasi area kerja berdasarkan Peran, tetapi belum otomatis membatasi seberapa sempit data yang boleh diakses dan berapa lama dan juga kapan akses sensitif boleh aktif.",
  },
  {
    label: "Solusi yang diusulkan",
    value: "Least Privilege + JIT",
    description: "Least Privilege mempersempit lingkup akses, sedangkan Just-in-Time Access membatasi durasi akses sensitif agar tidak terus aktif permanen. Kedua ini bukan konsep baru, tetapi sudah umum digunakan pada level infrastruktur sistem dan masih jarang dibahas dalam level aplikasi kontrol.",
  },
  {
    label: "Media representasi",
    value: "Prototipe Dompet Digital",
    description: "Prototipe dompet digital dipilih sebagai gambaran implementasi karena pengguna internal seperti role support teknis mengelola langsung data sensitif seperti KYC, status akun, dan riwayat aktivitas yang berpotensi disalahgunakan dari sisi internal dan juga relevan dengan skenario penelitian.",
  },
];

const problemItems = [
  "Dalam sistem digital yang mengelola data sensitif, berbagai aktivitas pengguna ditangani langsung melalui aplikasi, termasuk informasi identitas, status akun, dan riwayat aktivitas. Untuk mendukung operasional tersebut, sistem tetap memerlukan peran pengguna internal seperti Customer Service dalam dompet digital yang menangani bantuan teknis pada level aplikasi.",

  "Akses sistem diberikan secara sah agar operasional dapat berjalan, namun dalam praktiknya sering kali tidak dibatasi secara spesifik berdasarkan kebutuhan tugas yang sedang dikerjakan. Pengguna internal dapat memiliki hak akses yang luas dan aktif secara terus-menerus, meskipun tidak selalu diperlukan dalam setiap kondisi.",

  "Kondisi ini membuat aktivitas yang menyimpang atau penyalahgunaan akses sulit dibedakan dari aktivitas normal karena dilakukan menggunakan akses yang valid. Permasalahan ini dikenal sebagai insider threat, yaitu risiko keamanan yang berasal dari pengguna internal yang memiliki kredensial resmi, yang muncul akibat lemahnya pembatasan akses pada design kontrol level aplikasi."
];

const researchFocus = [
  "Mengidentifikasi kebutuhan kontrol akses pengguna internal melalui pemodelan peran, data sensitif, dan fitur sistem pada prototipe dompet digital.",
  "Menerapkan Least Privilege untuk mempersempit akses berdasarkan konteks ticket, bukan sekadar berdasarkan role pengguna.",
  "Menerapkan Just-in-Time Access untuk mengaktifkan fitur sensitif hanya saat dibutuhkan dan hanya untuk durasi yang terbatas.",
  "Mengevaluasi hasil penerapan melalui logs, terminal logs, transparansi user, dan skenario pengujian penyalahgunaan akses melalui postman.",
];

const contributions = [
  {
    title: "Kontribusi utama",
    body: "Penelitian ini berangkat dari fakta bahwa pembahasan kontrol akses seperti Least Privilege dan Just-In-Time Access umumnya sering dibahas pada level infrastruktur dan masih jarang dibahas dan juga diterapkan pada level aplikasi. Oleh karena itu, pendekatan tersebut dibawa langsung ke layer aplikasi sebagai titik interaksi terhadap data sensitif. Keduanya dikombinasikan dan diimplementasikan dalam alur sistem, serta direpresentasikan melalui prototipe dompet digital sebagai media untuk memvisualisasikan praktik kontrol akses internal yang selama ini cenderung tertutup di industri dan jarang dibahas secara akademik.",
    accent: "blue",
  },
  {
    title: "Konteks penelitian",
    body: "Dompet digital digunakan sebagai media representasi agar konsep kontrol akses dapat digambarkan pada lingkungan yang relevan dengan data sensitif, seperti KYC, status akun, dan riwayat aktivitas pengguna, tanpa harus membangun platform fintech secara penuh. Dalam konteks ini, penelitian menegaskan bahwa RBAC statis saja tidak cukup. Akses tidak hanya ditentukan oleh peran, tetapi juga oleh konteks kerja seperti ticket aktif, status penanganan, serta dibatasi oleh durasi akses sensitif yang bersifat sementara pada kondisi tertentu.",
    accent: "amber",
  },
  {
    title: "Batasan project",
    body: "Project ini adalah prototipe akademik. Fokusnya bukan menyaingi sistem finansial besar sudah ada atau menawarkan metode baru sepenuhnya, melainkan mengakademiskan praktik keamanan yang umumnya tertutup di industri ke dalam bentuk ranah akademik yang dapat diamati, diuji, dan dijelaskan secara terbuka.",
    accent: "slate",
  },
];

const stackItems = [
  {
    title: "Backend",
    body: "Golang dengan Gin dipilih karena ringan dan mendukung middleware chaining, sehingga setiap request dapat diintersepsi untuk validasi kontrol akses seperti RBAC, Least Privilege, dan Just-In-Time sebelum masuk ke business logic."
  },
 
  {
    title: "Database",
    body: "MySQL digunakan sebagai penyimpanan utama untuk users, user profiles, tickets, messages, JIT sessions, audit logs, dan data pendukung skenario akademik.",
  },
  {
    title: "Library Pendukung",
    body: "GORM dipakai sebagai ORM, Gorilla WebSocket untuk realtime, React Query untuk data fetching, Zustand untuk state ringan, Tailwind CSS untuk styling, dan date-fns untuk formatting waktu.",
  },
   {
    title: "Visualisasi Frontend",
    body: "Next.js digunakan untuk membangun antarmuka sistem sebagai gambaran visualisasi alur LP dan JIT di penulisan skripsi",
  },
];

const boundaries = [
  "Project ini tidak ditujukan untuk membangun sistem dompet digital komersial yang lengkap secara bisnis maupun operasional.",
  "Penelitian difokuskan pada layer kontrol akses aplikasi, bukan pada keamanan jaringan, sistem operasi, infrastruktur cloud, atau performa skala produksi.",
  "Project ini tidak dimaksudkan untuk menandingi implementasi platform fintech besar di dunia nyata. Masing-masing institusi sangat mungkin memiliki mekanisme yang lebih kompleks, lebih matang, dan bersifat tertutup.",
  "Kontribusi utama project ini adalah mengakademiskan praktik kontrol akses internal yang selama ini lebih banyak hadir di level industri, tetapi masih minim dijelaskan secara terbuka dalam bentuk implementasi dalam level layer kontrol aplikasi yang dapat diamati dan diuji.",
];

const diagramSteps = [
  "Role Customer Service membuka halaman detail ticket dan mengajukan request akses sementara untuk fitur sensitif tertentu.",

  "Backend melakukan validasi secara berurutan, mulai dari pengecekan apakah nomor ticket valid, status ticket masih aktif (open/in progress), serta memastikan ticket tersebut memang di-assign kepada Customer Service yang sedang login.",

  "Jika seluruh validasi berhasil, backend mengaktifkan sesi Just-in-Time dan membuka akses sensitif hanya dalam durasi terbatas, misalnya 15 menit, agar akses tidak bersifat permanen.",

  "Selama sesi berlangsung, Customer Service hanya dapat mengakses data dan fungsi yang relevan dengan ticket yang sedang ditangani, sementara seluruh aktivitas dan keputusan sistem dicatat ke audit log dan terminal log.",

  "Ketika durasi habis, ticket ditutup, atau Customer Service keluar dari sesi ticket, backend akan melakukan auto-revoke untuk mencabut akses sensitif secara otomatis agar tidak berubah menjadi standing privilege.",
];

const resources = [
  { label: "GitHub Repository Backend", href: thesisMeta.githubPrimary },
  { label: "GitHub Repository Frontend", href: thesisMeta.githubSecondary },
  { label: "Google Drive Dokumen Skripsi", href: thesisMeta.driveLink },
];

const lpDiagramItems = [
  {
    title: "Kondisi sebelum penerapan Least Privilege",
    image: "/images/skripsi/sebelum.png",
    caption:
      "Pada kondisi merupakan gambaran design kontrol akses yang hanya mengandalkan RBAC statis pada umumnya, dimana role seperti CS setelah login langsung memiliki akses yang luas dan terus aktif terhadap berbagai fitur dan data sensitif, tanpa pembatasan berdasarkan konteks yang spesifik.",
  },
  {
    title: "Kondisi setelah penerapan Least Privilege",
    image: "/images/skripsi/sesudah.png",
    caption:
      "Setelah penerapan Least Privilege, akses pada menu yang tersedia setelah Customer Service login, dipersempit berdasarkan konteks ticket yang sedang diambil dan tangani. Data dan fungsi sensitif hanya dapat diakses setelah backend memverifikasi bahwa ticket masih valid, aktif, dan memang ditugaskan kepada Customer Service yang sedang menangani ticket tersebut."
  },
];

export default function SkripsiPage() {
  const [viewer, setViewer] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ef_0%,#fbfaf7_45%,#f3efe8_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-stone-200 bg-[linear-gradient(135deg,#101828_0%,#233044_48%,#4c3d2b_100%)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10 lg:py-10">
            <div className="flex min-w-0 flex-col justify-center">
              <div className="inline-flex w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                Ringkasan akademik skripsi
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-stone-300">{thesisMeta.projectName}</div>
              <h1 className="mt-3 text-2xl font-bold leading-snug text-stone-50 sm:text-3xl lg:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {thesisMeta.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-stone-300 sm:text-base">
                Halaman ini disusun untuk membantu dosen maupun pembaca memahami inti skripsi secara cepat: masalah yang diangkat, alasan pemilihan pendekatan, konteks prototipe yang digunakan, kontribusi implementasi, batasan, serta arah evaluasi yang dilakukan pada project ini.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/homepage"
                  className="group inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition hover:opacity-90"
                  style={{ background: "#b45309", color: "#fff" }}
                >
                  Buka Demo Project
                  <span aria-hidden="true" className="text-base leading-none transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href="#lampiran"
                  className="inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition hover:opacity-85"
                  style={{ border: "1px solid rgba(255,255,255,0.18)", color: "#e2e8f0", background: "transparent" }}
                >
                  Dokumen dan Lampiran
                </Link>
              </div>
            </div>

            <div className="ml-auto w-full max-w-[430px] space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Identitas penulis</div>
                <div className="space-y-2.5">
                  <MetaRow label="Nama" value={thesisMeta.author} />
                  <MetaRow label="NIM" value={thesisMeta.studentId} />
                  <MetaRow label="Program Studi" value={thesisMeta.studyProgram} />
                  <MetaRow label="Institusi" value={thesisMeta.campus} />
                  <MetaRow label="Pembimbing 1" value={thesisMeta.advisor} />
                  <MetaRow label="Pembimbing 2" value={thesisMeta.advisor2} />
                  <MetaRow label="Tahun" value={thesisMeta.buildDate} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewer({ src: thesisMeta.profileImage, alt: "Foto profil penulis skripsi" })}
                className="block w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/6 p-3 text-left backdrop-blur-sm transition hover:opacity-95"
              >
                <img src={thesisMeta.profileImage} alt="Foto profil penulis skripsi" className="h-56 w-full rounded-[18px] object-cover" />
                <div className="mt-3 text-xs text-stone-300">Klik gambar untuk memperbesar tampilan foto profil.</div>
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 pb-8 pt-7 sm:px-8 lg:px-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {keyPoints.map((item) => (
                <KeyPointCard key={item.label} item={item} />
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionCard label="Latar belakang masalah" title="Masalah keamanan yang diangkat">
            <div className="space-y-3">
              {problemItems.map((item) => (
                <Callout key={item}>{item}</Callout>
              ))}
            </div>
          </SectionCard>

          <SectionCard label="Inti argumentasi" title="Mengapa RBAC saja belum cukup?">
            <div className="space-y-3">
              <Callout>
                RBAC sangat berguna untuk menentukan siapa saja yang mengakses fitur tertentu dan boleh masuk ke area kerja tertentu, tetapi RBAC tidak selalu cukup untuk memastikan bahwa fitur atau akses yang dibuka benar-benar minimum (least privilege) dan hanya relevan pada konteks kerja yang sedang berlangsung.
              </Callout>
              <Callout variant="gold">
                Pada kasus dalam dompet digital, role seperti Customer Service dapat memiliki role yang sah, namun tetap perlu dibatasi oleh ticket yang aktif, status penanganan, dan kebutuhan operasional yang valid. Karena itu, Least Privilege dipakai untuk mempersempit lingkup akses, lalu Just-in-Time Access dipakai untuk membatasi durasi akses terhadap fitur sensitif. jadi ini merupakan kombinasi RBAC + LP + JIT, bukan sekadar RBAC saja.
              </Callout>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ContributionCard title={contributions[0].title} body={contributions[0].body} accent={contributions[0].accent} />
          <ContributionCard title={contributions[1].title} body={contributions[1].body} accent={contributions[1].accent} />
          <ContributionCard title={contributions[2].title} body={contributions[2].body} accent={contributions[2].accent} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <SectionCard label="Tujuan dan implementasi" title="Apa yang dikerjakan pada project skripsi ini?">
            <ol className="space-y-3">
              {researchFocus.map((item, index) => (
                <li key={item} className="flex gap-4 rounded-[22px] border border-stone-200 bg-stone-50 px-5 py-4">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-7 text-slate-700">{item}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard label="Konteks prototipe" title="Mengapa memakai sistem dompet digital sebagai media representasi?">
            <div className="space-y-4">
              <Callout>
                Dompet digital dipilih karena secara alami berkaitan dengan data sensitif seperti KYC, status akun, riwayat transaksi, dan aktivitas layanan pelanggan. Hal ini membuat demonstrasi kontrol akses menjadi lebih relevan dan mudah dipahami.
              </Callout>

              <Callout variant="green">
                Fokus project ini bukan membangun produk sistem fintech penuh, melainkan memakai prototipe sistem dompet digital sebagai media representasi agar mekanisme Least Privilege dan Just-in-Time Access dapat digambarkan secara realistis pada level layer aplikasi.
              </Callout>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <SectionCard label="Visualisasi" title="Visualisasi perubahan RBAC design kontrol sebelum dan sesudah Least Privilege">
            <div className="grid gap-4 lg:grid-cols-2">
              {lpDiagramItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <button
                    type="button"
                    onClick={() => setViewer({ src: item.image, alt: item.title })}
                    className="block w-full overflow-hidden rounded-[18px] border border-dashed border-stone-300 bg-white p-2 text-left transition hover:opacity-95"
                  >
                    <img src={item.image} alt={item.title} className="h-[220px] w-full rounded-[14px] object-contain bg-stone-50" />
                  </button>
                  <div className="mt-3 text-sm font-semibold text-slate-950">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{item.caption}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-7 text-amber-900">
              Bagian ini disiapkan agar penjelasan Least Privilege dapat divisualisasikan secara jelas melalui dua kondisi: sebelum pembatasan kontekstual diterapkan, dan setelah akses dipersempit berdasarkan ticket aktif serta assignment yang sah.
            </div>
          </SectionCard>

          <SectionCard label="Visualisasi" title="Alur kerja Just-in-Time Access">
            <button
              type="button"
              onClick={() => setViewer({ src: thesisMeta.diagramImage, alt: "Diagram alur kerja Just-in-Time Access" })}
              className="block w-full overflow-hidden rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-3 text-left transition hover:opacity-95"
            >
              <img src={thesisMeta.diagramImage} alt="Diagram alur kerja Just-in-Time Access" className="h-[260px] w-full rounded-[18px] object-contain bg-white" />
              <div className="mt-3 text-xs text-slate-500">Klik gambar untuk memperbesar diagram.</div>
            </button>
            <div className="mt-4 space-y-3">
              {diagramSteps.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white">{index + 1}</span>
                  <span className="text-sm leading-6 text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <SectionCard label="Teknologi" title="Stack yang digunakan pada implementasi">
            <div className="grid gap-3 sm:grid-cols-2">
              {stackItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{item.body}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard label="Batasan dan posisi akademik" title="Batasan yang harus dipahami">
            <div className="space-y-3">
              {boundaries.map((item, index) => (
                <Callout key={`${index}-${item}`} variant={index === 2 ? "gold" : index === 3 ? "green" : "default"}>
                  {item}
                </Callout>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <SectionCard label="Repository dan dokumen" title="Lampiran yang menyertai project ini">
              <div id="lampiran" className="space-y-3">
                {resources.map((item) => (
                  <ResourceLink key={item.label} label={item.label} href={item.href} />
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-7 text-amber-900">
                Semua sumber utama dikumpulkan dalam satu halaman agar dosen atau pembaca tidak perlu menelusuri repository, dokumen, dan lampiran secara terpisah.
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="py-4 text-center text-xs text-slate-400">
          {thesisMeta.author} • {thesisMeta.buildDate}
        </div>
      </div>

      {viewer ? <ImageViewer src={viewer.src} alt={viewer.alt} onClose={() => setViewer(null)} /> : null}
    </div>
  );
}

function KeyPointCard({ item }: { item: { label: string; value: string; description: string } }) {
  return (
    <article className="min-h-[210px] rounded-[24px] border border-white/12 bg-white/[0.075] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/[0.095]">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">{item.label}</div>
      <h3 className="mt-3 text-lg font-extrabold leading-snug text-amber-200">{item.value}</h3>
      <p className="mt-3 text-sm leading-7 text-stone-300">{item.description}</p>
    </article>
  );
}

function SectionCard({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:p-7">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">{label}</div>
      <h2 className="mt-2 text-xl font-bold leading-snug text-slate-950 sm:text-2xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Callout({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "gold" | "green" }) {
  const styleMap = {
    default: "border-stone-200 bg-stone-50 text-slate-700",
    gold: "border-amber-200 bg-amber-50/70 text-amber-900",
    green: "border-emerald-200 bg-emerald-50/70 text-emerald-900",
  };

  return <div className={`rounded-2xl border p-4 text-sm leading-7 ${styleMap[variant]}`}>{children}</div>;
}

function ContributionCard({ title, body, accent }: { title: string; body: string; accent: string }) {
  const accentMap: Record<string, string> = {
    blue: "#2563eb",
    amber: "#b45309",
    slate: "#475569",
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
      <div className="absolute left-0 right-0 top-0 h-1" style={{ background: accentMap[accent] ?? "#0f172a" }} />
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Sorotan</div>
      <h3 className="mt-2 text-lg font-bold text-slate-950" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[104px_1fr] gap-3 border-b border-white/10 pb-2 last:border-b-0 last:pb-0 sm:grid-cols-[120px_1fr]">
      <span className="text-xs text-stone-400">{label}</span>
      <span className="text-xs font-semibold text-stone-100">{value}</span>
    </div>
  );
}

function ResourceLink({ label, href }: { label: string; href: string }) {
  const isGitHub = label.toLowerCase().includes("github");

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-[22px] border border-stone-200 bg-white px-5 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
    >
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-slate-900 transition group-hover:border-amber-200 group-hover:bg-amber-50">
        {isGitHub ? <GitHubIcon /> : <DriveIcon />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-slate-950">{label}</span>
        <span className="mt-1 block truncate text-xs font-medium text-amber-700">{href}</span>
      </span>

      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-stone-200 text-sm font-bold text-slate-500 transition group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-700">
        ↗
      </span>
    </Link>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.98c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.38-.01 2.49-.01 2.82 0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M8.72 3h6.56l6.5 11.26-3.28 5.69L12 8.69 5.5 19.95l-3.28-5.69L8.72 3Zm-1.6 15.2h9.76L18.1 20.3H5.9l1.22-2.1Z" />
    </svg>
  );
}

function ImageViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#101828] p-3 shadow-[0_24px_80px_rgba(15,23,42,0.35)]" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20"
        >
          Tutup
        </button>
        <img src={src} alt={alt} className="max-h-[82vh] w-full rounded-[20px] object-contain bg-[#0b1220]" />
      </div>
    </div>
  );
}
