import { LoginView } from "@/components/auth/login-view";

export default function StaffLoginPage() {
  return (
    <LoginView
      audience="staff"
      title="Workspace operasional untuk tim support dan compliance"
      description="Portal petugas memusatkan tiket, chat, JIT access, dan audit monitoring dalam satu antarmuka profesional yang siap dipakai tim CS maupun admin."
      defaultEmail="cs@example.com"
      defaultPassword="cs123"
      backHref="/login"
    />
  );
}
