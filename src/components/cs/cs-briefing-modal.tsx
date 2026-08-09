"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import { ClipboardCheck, LockKeyhole, TimerReset, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dompetku-cs-briefing-seen";

const points = [
  {
    icon: ClipboardCheck,
    title: "Assignment ticket",
    description: "Customer Support hanya dapat membuka ruang kerja ticket yang di-assign.",
  },
  {
    icon: LockKeyhole,
    title: "Data tetap terbatas",
    description: "Login role CS tidak otomatis membuka profil atau feature sensitif.",
  },
  {
    icon: TimerReset,
    title: "Session JIT",
    description: "Backend menerbitkan session sementara setelah validasi konteks terpenuhi.",
  },
];

export function CSBriefingModal() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function changeOpen(next: boolean) {
    if (!next) window.sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(next);
  }

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[#171a21]/50 backdrop-blur-[2px]" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed left-1/2 top-1/2 z-[71] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[#dfe3e8] bg-white shadow-[0_24px_64px_rgba(17,26,36,0.22)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#e9ecf0] px-5 py-5 sm:px-6">
              <div>
                <div className="text-xs font-semibold text-[var(--brand)]">Batas ruang kerja Customer Support</div>
                <Dialog.Title className="mt-2 text-xl font-semibold text-[#171a21] sm:text-2xl">
                  Akses dimulai dari ticket, bukan daftar pengguna.
                </Dialog.Title>
                <Dialog.Description className="mt-2 max-w-xl text-sm leading-6 text-[#667085]">
                  Frontend memperlihatkan urutan kontrol akses; keputusan izinnya tetap ditegakkan backend.
                </Dialog.Description>
              </div>
              <Dialog.Close className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#7b8492] hover:bg-[#f1f3f5] hover:text-[#252932]" aria-label="Tutup">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="divide-y divide-[#e9ecf0] px-5 sm:px-6">
              {points.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="grid grid-cols-[32px_1fr] gap-3 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#edf4ff] text-[var(--brand)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-[#b44731]">0{index + 1}</span>
                        <div className="text-sm font-semibold text-[#252932]">{item.title}</div>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#667085]">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#e9ecf0] bg-[#f8fafc] px-5 py-4 sm:flex sm:justify-end sm:px-6">
              <Button onClick={() => changeOpen(false)} className="w-full sm:w-auto">Buka antrian ticket</Button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
