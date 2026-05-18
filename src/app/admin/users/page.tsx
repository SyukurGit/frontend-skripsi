"use client";

import * as React from "react";
import { Topbar } from "@/components/shell/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useAdminCreateUser, useAdminUsers } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import { format } from "date-fns";

export default function AdminUsersPage() {
  const toast = useToastStore((s) => s.push);
  const users = useAdminUsers();
  const createUser = useAdminCreateUser();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"user" | "cs">("user");

  return (
    <div>
      <Topbar title="Data Pengguna" subtitle="Lihat seluruh akun dan tambahkan akun user atau customer service baru" />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Daftar akun</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">User, CS, dan admin</div>
          </CardHeader>
          <CardBody className="pt-4">
            {users.isLoading ? <div className="text-sm text-slate-500">Memuat akun...</div> : null}
            {users.isError ? <div className="text-sm text-rose-700">{getErrorMessage(users.error, "Gagal memuat data pengguna")}</div> : null}
            {!users.isLoading && !users.isError ? (
              <div className="space-y-3">
                {(users.data ?? []).map((user) => (
                  <div key={user.id} className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-base font-semibold text-slate-950">{user.email}</div>
                      <div className="mt-1 text-sm text-slate-500">Dibuat {format(new Date(user.created_at), "PPp")}</div>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">{user.role}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Tambah akun</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Buat user atau CS baru</div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-4">
              <div className="rounded-3xl border border-blue-100 bg-blue-50/80 p-4 text-sm leading-7 text-slate-600">
                Halaman ini hanya dipakai untuk menambah akun pengguna akhir dan Customer Service baru. Pembuatan akun admin sengaja tidak dibuka dari antarmuka untuk menjaga kontrol operasional tetap ketat.
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="akunbaru@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
                <Select value={role} onChange={(e) => setRole(e.target.value as "user" | "cs") }>
                  <option value="user">User</option>
                  <option value="cs">Customer Service</option>
                </Select>
              </div>
              <Button
                className="w-full"
                disabled={createUser.isPending || !email || !password}
                onClick={async () => {
                  try {
                    const created = await createUser.mutateAsync({ email, password, role });
                    setEmail("");
                    setPassword("");
                    setRole("user");
                    toast({ kind: "success", title: "Akun berhasil dibuat", detail: created.email });
                  } catch (error) {
                    toast({ kind: "error", title: "Gagal membuat akun", detail: getErrorMessage(error, "Gagal membuat akun") });
                  }
                }}
              >
                {createUser.isPending ? "Menyimpan..." : "Tambah akun"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
