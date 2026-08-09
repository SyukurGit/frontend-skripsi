export type DemoRole = "user" | "cs" | "admin";

export type DemoAccount = {
  email: string;
  password: string;
  role: DemoRole;
  roleLabel: string;
};

export const demoAccounts: readonly DemoAccount[] = [
  {
    email: "cs01@test.com",
    password: "cs123",
    role: "cs",
    roleLabel: "Customer Support",
  },
  {
    email: "cs02@test.com",
    password: "cs123",
    role: "cs",
    roleLabel: "Customer Support",
  },
  {
    email: "syukur@gmail.com",
    password: "user123",
    role: "user",
    roleLabel: "Pengguna",
  },
  {
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
    roleLabel: "Administrator",
  },
] as const;

export function getFirstDemoAccount(role: DemoRole) {
  return demoAccounts.find((account) => account.role === role);
}
