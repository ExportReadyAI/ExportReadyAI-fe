"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { userService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Search, Users, ChevronLeft, ChevronRight, Shield, User } from "lucide-react"
import type { User as UserType } from "@/lib/api/types"

export default function UsersPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isAdmin()) {
      router.push("/dashboard")
      return
    }

    fetchUsers()
  }, [isAuthenticated, isAdmin, router, page, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params: any = {
        page,
        limit: 10,
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      if (roleFilter !== "all") {
        params.role = roleFilter
      }

      const response = await userService.list(params)

      if (response.success) {
        if (Array.isArray(response.data)) {
          setUsers(response.data)
        }
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages)
          setTotalCount(response.pagination.count)
        }
      } else {
        setError("Gagal memuat daftar user")
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Anda tidak memiliki akses ke halaman ini")
        router.push("/dashboard")
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0F9FF]">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_6px_0_0_#7c3aed] animate-bounce">
            <Users className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-[#0C4A6E]">Memuat pengguna...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin()) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F0F9FF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B5CF6] shadow-[0_4px_0_0_#7c3aed]">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0C4A6E]">
                Manajemen Pengguna
              </h1>
              <p className="text-[#0284C7] font-medium">
                Kelola semua pengguna sistem
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search & Filter Card */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] p-6 shadow-[0_4px_0_0_#e0f2fe] mb-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#7DD3FC]" />
                <Input
                  placeholder="Cari berdasarkan email atau nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full sm:w-44"
              >
                <option value="all">Semua Role</option>
                <option value="Admin">Admin</option>
                <option value="UMKM">UMKM</option>
              </Select>
              <Button type="submit" variant="secondary">
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
            </form>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6]">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase">Total</p>
                  <p className="text-2xl font-extrabold text-[#0C4A6E]">{totalCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0284C7]">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase">Admin</p>
                  <p className="text-2xl font-extrabold text-[#0C4A6E]">
                    {users.filter(u => u.role === "Admin").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-[#e0f2fe] p-4 shadow-[0_4px_0_0_#e0f2fe]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#7DD3FC] uppercase">UMKM</p>
                  <p className="text-2xl font-extrabold text-[#0C4A6E]">
                    {users.filter(u => u.role === "UMKM").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border-2 border-[#e0f2fe] overflow-hidden shadow-[0_4px_0_0_#e0f2fe]">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[#F0F9FF] mb-4">
                  <Users className="h-8 w-8 text-[#7DD3FC]" />
                </div>
                <p className="font-bold text-[#0C4A6E] mb-1">Tidak Ada Pengguna</p>
                <p className="text-sm text-[#7DD3FC]">Tidak ada pengguna yang ditemukan</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F0F9FF] border-b-2 border-[#e0f2fe]">
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">No</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Email</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Nama Lengkap</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Role</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Terdaftar</th>
                        <th className="text-left p-4 font-bold text-[#0284C7] text-sm uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className="border-b border-[#e0f2fe] hover:bg-[#F0F9FF] transition-colors"
                        >
                          <td className="p-4 font-bold text-[#0C4A6E]">
                            {(page - 1) * 10 + index + 1}
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-[#0C4A6E]">{user.email}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7DD3FC] text-[#0C4A6E] font-bold text-sm">
                                {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                              <span className="font-medium text-[#0C4A6E]">{user.full_name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={user.role === "Admin" ? "default" : "success"}
                            >
                              {user.role === "Admin" && <Shield className="h-3 w-3 mr-1" />}
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-[#0284C7] font-medium">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/users/${user.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t-2 border-[#e0f2fe] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-[#0C4A6E]">
                      Halaman <span className="font-bold">{page}</span> dari <span className="font-bold">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
