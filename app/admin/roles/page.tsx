"use client"

import { useState, useEffect } from "react"
import { fetchUsers, setAdminClaim } from "@/lib/firebase-admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function AdminRolesPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const result = await fetchUsers()
    if (result.success) {
      setUsers(result.users)
    } else {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  async function handleToggleAdmin(user: any) {
    setUpdating(user.uid)

    // Determine if we're adding or removing admin role
    const isCurrentlyAdmin = user.role === "admin" || (user.customClaims && user.customClaims.admin)

    const result = await setAdminClaim(user.uid, !isCurrentlyAdmin)

    if (result.success) {
      toast({
        title: "Success",
        description: `User ${user.email} is now ${!isCurrentlyAdmin ? "an admin" : "a regular user"}`,
      })

      // Update the local state
      setUsers(
        users.map((u) => {
          if (u.uid === user.uid) {
            return {
              ...u,
              role: !isCurrentlyAdmin ? "admin" : "user",
              customClaims: { admin: !isCurrentlyAdmin },
            }
          }
          return u
        }),
      )
    } else {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }

    setUpdating(null)
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" || (user.customClaims && user.customClaims.admin) ? (
                        <Badge>Admin</Badge>
                      ) : (
                        "User"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={
                          user.role === "admin" || (user.customClaims && user.customClaims.admin)
                            ? "destructive"
                            : "default"
                        }
                        size="sm"
                        onClick={() => handleToggleAdmin(user)}
                        disabled={updating === user.uid}
                      >
                        {updating === user.uid
                          ? "Updating..."
                          : user.role === "admin" || (user.customClaims && user.customClaims.admin)
                            ? "Remove Admin"
                            : "Make Admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
