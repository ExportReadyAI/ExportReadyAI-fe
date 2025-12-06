"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth.store"
import { authService } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Rocket, Sparkles, Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Client-side validation
    if (!email || !password) {
      setError("Email dan password harus diisi")
      setLoading(false)
      return
    }

    try {
      const response = await authService.login({ email, password })
      
      console.log("Login response:", response) // Debug log
      
      if (response.success && response.data) {
        // Handle both response structures:
        // Structure 1: { data: { access, refresh, user } }
        // Structure 2: { data: { tokens: { access, refresh }, user } }
        const accessToken = response.data.access || (response.data as any).tokens?.access
        const refreshToken = response.data.refresh || (response.data as any).tokens?.refresh
        const user = response.data.user

        if (!accessToken || !refreshToken || !user) {
          console.error("Missing token or user data:", { accessToken, refreshToken, user })
          setError("Response format tidak valid")
          return
        }

        console.log("Setting auth with token:", accessToken.substring(0, 20) + "...") // Debug log
        
        setAuth(user, accessToken, refreshToken)
        
        // Wait a bit to ensure token is saved to localStorage
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Verify token is saved
        const savedToken = localStorage.getItem('token')
        console.log("Token saved to localStorage:", savedToken ? savedToken.substring(0, 20) + "..." : "NOT FOUND")
        
        router.push("/dashboard")
      } else {
        setError(response.message || "Login gagal")
      }
    } catch (err: any) {
      console.error("Login error:", err) // Debug log
      setError(
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat login"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#F0F9FF]">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0284C7] to-[#0369a1] p-12 flex-col justify-between relative overflow-hidden">
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
            Siap Ekspor<br />
            Produk Anda ke<br />
            <span className="text-[#F59E0B]">Pasar Global?</span>
          </h2>
          <p className="text-lg text-[#7DD3FC] font-medium max-w-md">
            Platform AI yang membantu UMKM Indonesia untuk memulai dan mengembangkan bisnis ekspor dengan mudah.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-3">
          {[
            "Analisis Produk Otomatis",
            "HS Code Generator",
            "Export Documentation"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B] shadow-[0_3px_0_0_#d97706]">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <span className="text-white font-semibold">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_4px_0_0_#065985]">
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
                Selamat Datang! 👋
              </h2>
              <p className="text-[#0284C7] font-medium">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
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
                    <span>Masuk</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>

              <div className="text-center pt-4 border-t-2 border-[#e0f2fe]">
                <p className="text-[#0C4A6E] font-medium">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="text-[#0284C7] hover:text-[#0369a1] font-bold underline underline-offset-2"
                  >
                    Daftar sekarang
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
