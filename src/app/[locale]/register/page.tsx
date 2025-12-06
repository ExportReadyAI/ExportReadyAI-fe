"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Rocket, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email harus diisi"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password harus diisi"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama"
    }

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = "Nama lengkap harus diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      })

      if (response.success) {
        // Redirect to login page after successful registration
        router.push("/login?registered=true")
      } else {
        setError(response.message || "Registrasi gagal")
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat registrasi"
      )
    } finally {
      setLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    const pwd = formData.password
    if (!pwd) return { level: 0, text: "", color: "" }
    if (pwd.length < 8) return { level: 1, text: "Terlalu pendek", color: "#EF4444" }
    if (pwd.length < 12) return { level: 2, text: "Cukup", color: "#F59E0B" }
    return { level: 3, text: "Kuat", color: "#22C55E" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex bg-[#F0F9FF]">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#22C55E] to-[#16a34a] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#7DD3FC]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F59E0B]/20 rounded-full blur-3xl" />
        
        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-[0_4px_0_0_rgba(0,0,0,0.2)]">
              <Rocket className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">ExportReady</h1>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                <span className="text-sm font-bold text-[#F59E0B]">AI Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Mulai Perjalanan<br />
            Ekspor Anda<br />
            <span className="text-[#F59E0B]">Hari Ini! 🚀</span>
          </h2>
          <p className="text-lg text-[#bbf7d0] font-medium max-w-md">
            Bergabung bersama ribuan UMKM Indonesia yang sudah sukses mengekspor produk mereka.
          </p>
        </div>

        {/* Benefits */}
        <div className="relative z-10 space-y-3">
          {[
            "Gratis untuk memulai",
            "AI Assistant 24/7",
            "Panduan step-by-step"
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_3px_0_0_rgba(0,0,0,0.1)]">
                <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
              </div>
              <span className="text-white font-semibold">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E] shadow-[0_4px_0_0_#16a34a]">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0C4A6E]">ExportReady</h1>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#F59E0B]" />
                <span className="text-xs font-bold text-[#F59E0B]">AI Powered</span>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-8 shadow-[0_8px_0_0_#e0f2fe]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#0C4A6E] mb-2">
                Buat Akun Baru 🎉
              </h2>
              <p className="text-[#0284C7] font-medium">
                Daftar dan mulai perjalanan ekspor Anda
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-12"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-12"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-12"
                  />
                </div>
                {formData.password && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#e0f2fe] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(passwordStrength.level / 3) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <span 
                      className="text-xs font-bold"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pl-12"
                  />
                </div>
                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <div className="flex items-center gap-1 text-[#22C55E]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-bold">Password cocok!</span>
                  </div>
                )}
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="success"
                className="w-full h-14 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>

              <div className="text-center pt-4 border-t-2 border-[#e0f2fe]">
                <p className="text-[#0C4A6E] font-medium">
                  Sudah punya akun?{" "}
                  <Link
                    href="/login"
                    className="text-[#0284C7] hover:text-[#0369a1] font-bold underline underline-offset-2"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#7DD3FC] font-medium mt-6">
            © 2024 ExportReady.AI - Platform Ekspor UMKM Indonesia
          </p>
        </div>
      </div>
    </div>
  )
}
