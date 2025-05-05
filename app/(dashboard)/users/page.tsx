"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { UserDialog } from "@/components/users/user-dialog"
import { fetchUsers, updateUser } from "@/lib/api"
import type { User } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(useState(false))
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers()
        setUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [toast])

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
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
    try {
      if (selectedUser) {
        // Update existing user
        await updateUser(user.id, user)
        setUsers(users.map((u) => (u.id === user.id ? user : u)))
        toast({
          title: "User updated",
          description: `${user.username} has been updated successfully.`,
        })
      } else {
        // In a real app, this would call the API to create a new user
        // For now, just add to the local state with a fake ID
        setUsers([...users, { ...user, id: `temp-${Date.now()}` }])
        toast({
          title: "User created",
          description: `${user.username} has been created successfully.`,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save user. Please try again.",
      })
    }
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
          <p className="text-muted-foreground">Manage users and administrators</p>
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
        <UsersTable users={filteredUsers} onEdit={handleEditUser} />
      )}

      <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} user={selectedUser} onSave={handleSaveUser} />
    </div>
  )
}
