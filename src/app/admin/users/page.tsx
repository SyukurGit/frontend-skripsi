"use client";

import * as React from "react";
import { format } from "date-fns";
import { Plus, UserCog, UsersRound } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataPanel, EmptyState, PageHeader, Pill } from "@/components/ui/page";
import { StatCard } from "@/components/ui/stat-card";
import { useAdminCreateUser, useAdminUsers } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";

export default function AdminUsersPage() {
  const toast = useToastStore((s) => s.push);
  const users = useAdminUsers();
  const createUser = useAdminCreateUser();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"user" | "cs">("user");

  const rows = users.data ?? [];
  const totalUser = rows.filter((user) => user.role === "user").length;
  const totalCs = rows.filter((user) => user.role === "cs").length;
  const totalAdmin = rows.filter((user) => user.role === "admin").length;

  return (
    <div>
      <Topbar title="Akun" subtitle="Kelola user dan CS untuk skenario pengujian" />
      <PageHeader
        eyebrow="Identity fixtures"
        title="Akun untuk simulasi dompet digital"
        description="Admin dapat menambah akun user dan CS agar skenario ticket, assignment, JIT, dan audit bisa diuji berulang."
        meta={<Pill tone="warning">Pembuatan admin tidak dibuka dari UI</Pill>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="User" value={totalUser} hint="Nasabah dompet" tone="neutral" />
        <StatCard label="CS" value={totalCs} hint="Petugas support" tone="info" />
        <StatCard label="Admin" value={totalAdmin} hint="Pengawas sistem" tone="warning" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.45fr]">
        <DataPanel title="Daftar akun" description="Akun yang tersedia untuk login dan pengujian role.">
          {users.isLoading ? <div className="text-sm text-slate-500">Memuat akun...</div> : null}
          {users.isError ? <div className="text-sm text-rose-700">{getErrorMessage(users.error, "Gagal memuat data pengguna")}</div> : null}
          {!users.isLoading && !users.isError ? (
            <div className="space-y-3">
              {rows.map((user) => (
                <div key={user.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        {user.role === "cs" ? <UserCog className="h-5 w-5" /> : <UsersRound className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-950">{user.email}</div>
                        <div className="mt-1 text-sm text-slate-500">Dibuat {format(new Date(user.created_at), "PPp")}</div>
                      </div>
                    </div>
                    <Pill tone={user.role === "admin" ? "warning" : user.role === "cs" ? "info" : "neutral"}>{user.role.toUpperCase()}</Pill>
                  </div>
                </div>
              ))}
              {rows.length === 0 ? <EmptyState title="Belum ada akun" description="Tambahkan user atau CS dari form di samping." /> : null}
            </div>
          ) : null}
        </DataPanel>

        <DataPanel title="Tambah akun" description="Buat subjek uji baru.">
          <div className="space-y-4">
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
              <Select value={role} onChange={(e) => setRole(e.target.value as "user" | "cs")}>
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
              <Plus className="h-4 w-4" />
              {createUser.isPending ? "Menyimpan..." : "Tambah akun"}
            </Button>
          </div>
        </DataPanel>
      </section>
    </div>
  );
}
