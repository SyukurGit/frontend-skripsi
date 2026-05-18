"use client";

import Link from "next/link";
import { LogoMark } from "@/components/branding/logo-mark";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthedRedirect } from "@/hooks/use-authed-redirect";

const options = [
  {
    href: "/login/user",
    title: "Login Pengguna",
    desc: "Masuk untuk membuat tiket bantuan, mengikuti status penanganan, dan berbicara langsung dengan petugas.",
    badge: "USER",
  },
  {
    href: "/login/staff",
    title: "Login Petugas",
    desc: "Masuk sebagai CS atau Admin untuk memproses tiket, melakukan monitoring, dan melihat audit real-time.",
    badge: "STAFF",
  },
];

export default function LoginChooserPage() {
  useAuthedRedirect();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_24%),linear-gradient(180deg,#eef4ff_0%,#f8fbff_50%,#f4f7fb_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <LogoMark />
              <div className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Choose your workspace</div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Akses portal DompetKu sesuai peran Anda.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Pilih portal pengguna untuk pengalaman layanan pelanggan, atau portal petugas untuk workflow operasional dan compliance.
              </p>
            </div>
            <Link href="/">
              <Button variant="secondary" className="h-12">Kembali ke Landing</Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {options.map((option) => (
              <Card key={option.href} className="overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f8fbff)]">
                <CardBody className="p-7">
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {option.badge}
                  </div>
                  <div className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{option.title}</div>
                  <div className="mt-3 text-sm leading-7 text-slate-500">{option.desc}</div>
                  <div className="mt-6">
                    <Link href={option.href}>
                      <Button className="h-12 w-full">Lanjutkan</Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
