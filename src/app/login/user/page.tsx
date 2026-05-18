import { LoginView } from "@/components/auth/login-view";

export default function UserLoginPage() {
  return (
    <LoginView
      audience="user"
      title="Akses dompet digital Anda dengan aman"
      description="Portal pengguna DompetKu dirancang untuk membantu Anda membuat tiket bantuan, memonitor progres, dan berkomunikasi langsung dengan tim support tanpa antarmuka yang membingungkan."
      defaultEmail="user@example.com"
      defaultPassword="user123"
      backHref="/login"
    />
  );
}
