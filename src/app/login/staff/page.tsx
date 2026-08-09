import { LoginView } from "@/components/auth/login-view";

export default function StaffLoginPage() {
  return (
    <LoginView
      audience="staff"
      title="Ruang kerja Customer Support dan Administrator"
      description="Masuk sesuai role untuk menangani assignment ticket atau memantau bukti audit backend."
      defaultEmail="cs01@test.com"
      defaultPassword="cs123"
      backHref="/login"
    />
  );
}
