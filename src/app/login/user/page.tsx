import { LoginView } from "@/components/auth/login-view";

export default function UserLoginPage() {
  return (
    <LoginView
      audience="user"
      title="Masuk ke prototipe dompet pengguna"
      description="Lihat data simulasi, buat ticket bantuan, dan pantau aktivitas yang terjadi dalam konteks ticket Anda."
      defaultEmail="syukur@gmail.com"
      defaultPassword="user123"
      backHref="/login"
    />
  );
}
