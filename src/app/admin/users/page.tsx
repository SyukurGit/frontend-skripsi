"use client";

import * as React from "react";
import { format } from "date-fns";
import { Plus, Search, ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useAdminCreateUser, useAdminUsers } from "@/services/queries";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/utils/api-error";
import type { Role } from "@/types/api";

const roleDisplay: Record<Role, string> = {
  user: "PENGGUNA",
  cs: "CS",
  admin: "ADMIN",
};

function RoleBadge({ role }: { role: Role }) {
  const className =
    role === "admin"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : role === "cs"
        ? "border-indigo-200 bg-indigo-50 text-indigo-800"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      {roleDisplay[role]}
    </span>
  );
}

function RoleIcon({ role }: { role: Role }) {
  if (role === "admin") return <ShieldCheck className="h-4 w-4" />;
  if (role === "cs") return <UserCog className="h-4 w-4" />;
  return <UsersRound className="h-4 w-4" />;
}

export default function AdminUsersPage() {
  const toast = useToastStore((s) => s.push);
  const users = useAdminUsers();
  const createUser = useAdminCreateUser();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"user" | "cs">("user");
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"all" | Role>("all");

  const rows = users.data ?? [];
  const totalUser = rows.filter((user) => user.role === "user").length;
  const totalCs = rows.filter((user) => user.role === "cs").length;
  const totalAdmin = rows.filter((user) => user.role === "admin").length;
  const normalizedQuery = query.trim().toLowerCase();
  const visibleRows = rows.filter(
    (user) =>
      (roleFilter === "all" || user.role === roleFilter) &&
      (!normalizedQuery || user.email.toLowerCase().includes(normalizedQuery) || String(user.id).includes(normalizedQuery)),
  );

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password || createUser.isPending) return;

    try {
      const created = await createUser.mutateAsync({ email, password, role });
      setEmail("");
      setPassword("");
      setRole("user");
      toast({ kind: "success", title: "Akun berhasil dibuat", detail: created.email });
    } catch (error) {
      toast({ kind: "error", title: "Gagal membuat akun", detail: getErrorMessage(error, "Gagal membuat akun") });
    }
  }

  return (
    <div>
      <Topbar title="Inventaris Akun" subtitle="Kelola subjek dan petugas untuk skenario pengujian" />

      <section className="mb-5 border-b border-slate-200 pb-5 pt-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-700">
              <UsersRound className="h-4 w-4" />
              Identitas dan peran
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">Akun operasional untuk pengujian akses</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Admin dapat membuat akun Pengguna dan CS untuk menjalankan skenario tiket. Pembuatan akun Administrator
              tidak tersedia pada antarmuka ini.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className={`h-2 w-2 rounded-full ${users.isError ? "bg-rose-600" : users.isLoading ? "bg-amber-500" : "bg-emerald-600"}`} />
            {users.isLoading ? "Memuat inventaris" : `${rows.length} akun tercatat`}
          </div>
        </div>
      </section>

      <section className="mb-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
          {[
            { label: "Pengguna", value: totalUser, detail: "Subjek pemilik tiket", icon: UsersRound },
            { label: "Customer Support", value: totalCs, detail: "Petugas operasional", icon: UserCog },
            { label: "Administrator", value: totalAdmin, detail: "Peran pengawasan", icon: ShieldCheck },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`${index > 0 ? "border-t border-slate-200 sm:border-t-0" : ""} flex items-center justify-between gap-4 px-4 py-3 sm:px-5`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-600">{metric.label}</div>
                    <div className="mt-1 text-xs text-slate-500">{metric.detail}</div>
                  </div>
                </div>
                <span className="font-mono text-xl font-semibold text-slate-950">{users.isLoading ? "-" : metric.value}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
        <div className="grid xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 border-b border-slate-200 xl:border-b-0 xl:border-r">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <div className="text-sm font-semibold text-slate-950">Daftar akun</div>
                <div className="mt-0.5 text-xs text-slate-500">{visibleRows.length} akun sesuai filter.</div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <div className="relative min-w-0 flex-1 sm:w-56">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="pl-9"
                    placeholder="Cari email atau ID"
                    aria-label="Cari akun"
                  />
                </div>
                <Select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value as "all" | Role)}
                  className="w-32 shrink-0"
                  aria-label="Filter peran"
                >
                  <option value="all">Semua peran</option>
                  <option value="user">Pengguna</option>
                  <option value="cs">CS</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
            </div>

            {users.isLoading ? <div className="px-5 py-6 text-sm text-slate-500">Memuat akun...</div> : null}
            {users.isError ? (
              <div className="px-5 py-6 text-sm text-rose-700">{getErrorMessage(users.error, "Gagal memuat data pengguna")}</div>
            ) : null}
            {!users.isLoading && !users.isError ? (
              <>
                <div className="hidden grid-cols-[72px_minmax(0,1fr)_180px_110px] border-b border-slate-100 bg-slate-50 px-5 py-2 text-[11px] font-semibold uppercase text-slate-500 md:grid">
                  <span>ID</span>
                  <span>Identitas</span>
                  <span>Dibuat</span>
                  <span>Peran</span>
                </div>
                <div className="max-h-[660px] divide-y divide-slate-100 overflow-y-auto">
                  {visibleRows.map((user) => (
                    <div
                      key={user.id}
                      className="grid gap-3 px-4 py-3 hover:bg-slate-50 md:grid-cols-[72px_minmax(0,1fr)_180px_110px] md:items-center sm:px-5"
                    >
                      <div className="font-mono text-xs font-semibold text-slate-500">#{user.id}</div>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                          <RoleIcon role={user.role} />
                        </span>
                        <span className="truncate text-sm font-semibold text-slate-950" title={user.email}>
                          {user.email}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        {format(new Date(user.created_at), "dd MMM yyyy, HH:mm")}
                      </div>
                      <div className="justify-self-start">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  ))}
                  {visibleRows.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <div className="text-sm font-semibold text-slate-900">Tidak ada akun yang cocok</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        Ubah pencarian atau filter peran untuk melihat akun lain.
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <aside>
            <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
              <div className="text-sm font-semibold text-slate-950">Tambah akun operasional</div>
              <div className="mt-0.5 text-xs text-slate-500">Buat identitas Pengguna atau CS baru.</div>
            </div>

            <form className="space-y-4 px-4 py-5 sm:px-5" onSubmit={handleCreate}>
              <div>
                <label htmlFor="managed-user-email" className="mb-2 block text-xs font-semibold uppercase text-slate-600">
                  Email
                </label>
                <Input
                  id="managed-user-email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="akunbaru@example.com"
                />
              </div>
              <div>
                <label htmlFor="managed-user-password" className="mb-2 block text-xs font-semibold uppercase text-slate-600">
                  Password
                </label>
                <Input
                  id="managed-user-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label htmlFor="managed-user-role" className="mb-2 block text-xs font-semibold uppercase text-slate-600">
                  Peran
                </label>
                <Select
                  id="managed-user-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value as "user" | "cs")}
                >
                  <option value="user">Pengguna</option>
                  <option value="cs">Customer Support</option>
                </Select>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <Button className="w-full" type="submit" disabled={createUser.isPending || !email || !password}>
                  <Plus className="h-4 w-4" />
                  {createUser.isPending ? "Menyimpan..." : "Tambah akun"}
                </Button>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Akun baru langsung masuk ke inventaris setelah backend menyelesaikan pembuatan.
                </p>
              </div>
            </form>
          </aside>
        </div>
      </section>
    </div>
  );
}
