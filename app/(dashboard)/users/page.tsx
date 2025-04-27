"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { UserDialog } from "@/components/users/user-dialog"
import { fetchUsers } from "@/lib/api"
import type { User } from "@/types"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers()
        setUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleSaveUser = async (user: User) => {
    // In a real app, this would call the API to save the user
    if (selectedUser) {
      // Update existing user
      setUsers(users.map((u) => (u.id === user.id ? user : u)))
    } else {
      // Add new user with a fake ID
      setUsers([...users, { ...user, id: `temp-${Date.now()}` }])
    }
    setIsDialogOpen(false)
  }

  const handleToggleStatus = async (id: string) => {
    // In a real app, this would call the API to toggle the user's status
    setUsers(users.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage staff and admin users</p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search users..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <UsersTable users={filteredUsers} onEdit={handleEditUser} onToggleStatus={handleToggleStatus} />
      )}

      <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} user={selectedUser} onSave={handleSaveUser} />
    </div>
  )
}
