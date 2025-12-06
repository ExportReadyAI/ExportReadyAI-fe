"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { userService } from "@/lib/api/services"
import { Sidebar } from "@/components/layout/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "@/lib/api/types"

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isAdmin()) {
      router.push("/dashboard")
      return
    }

    if (params.id) {
      fetchUser(params.id as string)
    }
  }, [isAuthenticated, isAdmin, router, params.id])

  const fetchUser = async (id: string) => {
    try {
      setLoading(true)
      const response = await userService.get(id)

      if (response.success && response.data) {
        setUser(response.data)
      } else {
        setError("Gagal memuat detail user")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAdmin() || !user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              ← Kembali
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-6">User Detail</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Informasi User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ID
                </p>
                <p className="text-lg font-semibold">{user.id}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nama Lengkap
                </p>
                <p className="text-lg font-semibold">{user.full_name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <Badge
                  variant={user.role === "Admin" ? "default" : "secondary"}
                  className="mt-1"
                >
                  {user.role}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created At
                </p>
                <p className="text-base">{formatDate(user.created_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

