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
    description: "Risiko muncul dari pengguna internal yang memiliki kredensial sah, tetapi berpotensi mengakses atau mengubah data di luar kebutuhan tugasnya.",
  },
  {
    label: "Kelemahan dasar",
    value: "RBAC Saja Belum Cukup",
    description: "Role seperti RBAC dapat membatasi area kerja, tetapi belum otomatis membatasi seberapa sempit data yang boleh diakses dan berapa lama dan juga kapan akses sensitif boleh aktif.",
  },
  {
    label: "Solusi yang diusulkan",
    value: "Least Privilege + JIT",
    description: "Least Privilege mempersempit lingkup akses, sedangkan Just-in-Time Access membatasi durasi akses sensitif agar tidak terus aktif permanen. kedua ini bukan konsep baru, tapi sudah umum digunakan pada level infrastruktur sistem tapi masih jarang dibahas dalam level aplikasi kontrol.",
  },
  {
    label: "Media representasi",
    value: "Prototipe Dompet Digital ('Dompetku')",
    description: "Prototipe Dompet digital dipilih sebagai gambaran implementasi karena pengguna internal seperti role support teknis mengelola langsung data sensitif seperti KYC, status akun, dan riwayat aktivitas yang berpotensi disalahgunakan dari sisi internal dan juga relevan dengan skenario penelitian.",
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

const featureHighlights = [
  {
    icon: "💳",
    text: "Dashboard pengguna digunakan sebagai konteks produk dompet digital agar data sensitif yang dilindungi terasa realistis dalam skenario akademik.",
  },
  {
    icon: "🎧",
    text: "Workspace Customer Service memuat claim ticket, percakapan, pembatasan akses berbasis ticket, dan pengajuan JIT untuk fitur sensitif.",
  },
  {
    icon: "🛡️",
    text: "Panel admin memusatkan statistik, logs per sesi bantuan, audit realtime, terminal log, dan data akun untuk memperlihatkan seluruh jejak keputusan backend.",
  },
  {
    icon: "🔔",
    text: "Pengguna akhir tetap diberi transparansi melalui notifikasi sistem ketika Customer Service memperoleh atau menggunakan akses sensitif.",
  },
];

const stackItems = [
  {
  title: "Backend",
  body: "Golang dengan Gin dipilih karena ringan dan mendukung middleware chaining, sehingga setiap request dapat diintersepsi untuk validasi kontrol akses seperti RBAC, Least Privilege, dan Just-In-Time sebelum masuk ke business logic."
},
  {
    title: "Frontend",
    body: "Next.js digunakan untuk membangun antarmuka multi-role, visualisasi alur LP dan JIT, halaman demonstrasi, serta ringkasan skripsi yang responsif pada desktop maupun mobile.",
  },
  {
    title: "Database",
    body: "MySQL digunakan sebagai penyimpanan utama untuk users, user profiles, tickets, messages, JIT sessions, audit logs, dan data pendukung skenario akademik.",
  },
  {
    title: "Library Pendukung",
    body: "GORM dipakai sebagai ORM, Gorilla WebSocket untuk realtime, React Query untuk data fetching, Zustand untuk state ringan, Tailwind CSS untuk styling, dan date-fns untuk formatting waktu.",
  },
];

const boundaries = [
  "Project ini tidak ditujukan untuk membangun sistem dompet digital komersial yang lengkap secara bisnis maupun operasional.",
  "Penelitian difokuskan pada layer kontrol akses aplikasi, bukan pada keamanan jaringan, sistem operasi, infrastruktur cloud, atau performa skala produksi.",
  "Project ini tidak dimaksudkan untuk menandingi implementasi platform fintech besar di dunia nyata. Masing-masing institusi sangat mungkin memiliki mekanisme yang lebih kompleks, lebih matang, dan bersifat tertutup.",
  "Kontribusi utama project ini adalah mengakademiskan praktik kontrol akses internal yang selama ini lebih banyak hadir di level industri, tetapi masih minim dijelaskan secara terbuka dalam bentuk implementasi dalam level layer kontroaplikasi yang dapat diamati dan diuji.",
];

const diagramSteps = [
  "Customer Service berada pada halaman detail ticket dan mengajukan permintaan akses sementara untuk fitur sensitif tertentu.",
  "Middleware backend memeriksa apakah ticket valid, masih aktif, dan benar-benar ditugaskan kepada Customer Service yang sedang login.",
  "Jika seluruh kondisi bernilai benar, backend membuat sesi Just-in-Time sementara dan membuka fitur yang diminta hanya dalam jangka waktu terbatas.",
  "Seluruh keputusan direkam ke audit log dan terminal log agar dapat ditelusuri ulang saat evaluasi atau demonstrasi.",
  "Ketika waktu habis atau ticket selesai, akses dicabut kembali secara otomatis agar tidak menjadi standing privilege.",
];

const resources = [
  { label: "GitHub Repository Backend", href: thesisMeta.githubPrimary },
  { label: "GitHub Repository Frontend", href: thesisMeta.githubSecondary },
  { label: "Google Drive Dokumen Skripsi", href: thesisMeta.driveLink },
];

export default function SkripsiPage() {
  const [viewer, setViewer] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ef_0%,#fbfaf7_45%,#f3efe8_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-stone-200 bg-[linear-gradient(135deg,#101828_0%,#233044_48%,#4c3d2b_100%)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
            <div>
              <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                Ringkasan akademik skripsi
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-stone-300">{thesisMeta.projectName}</div>
              <h1 className="mt-3 text-2xl font-bold leading-snug text-stone-50 sm:text-3xl lg:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {thesisMeta.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-stone-300 sm:text-base">
                Halaman ini disusun untuk membantu dosen maupun pembaca memahami inti skripsi secara cepat: masalah yang diangkat, alasan pemilihan pendekatan, konteks prototipe yang digunakan, kontribusi implementasi, batasan, serta arah evaluasi yang dilakukan pada project ini.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {keyPoints.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">{item.label}</div>
                    <div className="mt-2 text-sm font-bold text-amber-200">{item.value}</div>
                    <div className="mt-2 text-xs leading-5 text-stone-300">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
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
                <img src={thesisMeta.profileImage} alt="Foto profil penulis skripsi" className="h-64 w-full rounded-[18px] object-cover" />
                <div className="mt-3 text-xs text-stone-300">Klik gambar untuk memperbesar tampilan foto profil.</div>
              </button>
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

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <SectionCard label="Tujuan dan implementasi" title="Apa yang dikerjakan pada project skripsi ini?">
            <ol className="space-y-3">
              {researchFocus.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">{index + 1}</span>
                  <span className="text-sm leading-6 text-slate-700">{item}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard label="Konteks prototipe" title="Mengapa memakai sistem dompet digital sebagai media representasi?">
            <div className="space-y-3">
              <Callout>
                Dompet digital dipilih karena secara alami berkaitan dengan data sensitif seperti KYC, status akun, riwayat transaksi, dan aktivitas layanan pelanggan. Hal ini membuat demonstrasi kontrol akses menjadi lebih relevan dan mudah dipahami.
              </Callout>
              <Callout variant="green">
                Fokus project ini bukan membangun produk sistem fintech penuh, melainkan memakai prototipe sistem dompet digital sebagai media representasi agar mekanisme Least Privilege dan Just-in-Time Access dapat digambarkan secara realistis pada level layer aplikasi.
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
          <SectionCard label="Fitur implementasi" title="Bagian project yang saat ini sudah tersedia">
            <div className="grid gap-3 sm:grid-cols-2">
              {featureHighlights.map((item) => (
                <div key={item.text} className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-slate-700">
                  <div className="mb-2 text-lg">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-7 text-amber-900">
              Seluruh fitur di atas tidak dimaksudkan sebagai pembuktian bisnis aplikasi dompet digital, melainkan sebagai sarana untuk memperlihatkan bagaimana pembatasan akses internal dapat diterapkan, diuji, dan diaudit secara sistematis.
            </div>
          </SectionCard>

          <SectionCard label="Diagram utama" title="Alur kerja Just-in-Time Access">
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

          <SectionCard label="Batasan dan posisi akademik" title="Cara project ini harus dipahami">
            <div className="space-y-3">
              {boundaries.map((item, index) => (
                <Callout key={`${index}-${item}`} variant={index === 2 ? "gold" : index === 3 ? "green" : "default"}>
                  {item}
                </Callout>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
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

          <SectionCard label="Penutup" title="Kesimpulan ringkas halaman ini">
            <div className="space-y-3">
              <Callout>
                Project ini merepresentasikan upaya untuk memodelkan dan menjelaskan implementasi kontrol akses internal yang selama ini lebih sering hadir sebagai praktik tertutup di industri, khususnya pada sistem yang mengelola data sensitif.
              </Callout>
              <Callout variant="gold">
                Dengan demikian, nilai utama project ini tidak terletak pada pembuatan metode baru atau pada upaya menandingi platform besar di dunia nyata, tetapi pada usaha mengakademiskan, memvisualisasikan, dan menguji praktik pembatasan akses internal pada layer aplikasi secara terbuka.
              </Callout>
            </div>
          </SectionCard>
        </div>

        <div className="py-4 text-center text-xs text-slate-400">
          {thesisMeta.author} • {thesisMeta.buildDate}
        </div>
      </div>

      {viewer ? <ImageViewer src={viewer.src} alt={viewer.alt} onClose={() => setViewer(null)} /> : null}
    </div>
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
  return (
    <Link href={href} target="_blank" className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 transition hover:border-amber-200 hover:bg-amber-50/40 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-semibold text-slate-950">{label}</span>
      <span className="break-all text-xs text-amber-700 sm:ml-4">{href}</span>
    </Link>
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
