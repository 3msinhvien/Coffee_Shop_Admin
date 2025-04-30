"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TagsTable } from "@/components/tags/tags-table"
import { TagDialog } from "@/components/tags/tag-dialog"
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Tag } from "@/types"

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)
  const { toast } = useToast()

  // Fetch tags from API
  const fetchTags = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tags")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setTags(data.tags || [])
    } catch (error) {
      console.error("Failed to fetch tags:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tags. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddTag = () => {
    setSelectedTag(null)
    setIsDialogOpen(true)
  }

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const handleSaveTag = async (tag: Partial<Tag>) => {
    try {
      if (selectedTag) {
        // Update existing tag
        const response = await fetch(`http://127.0.0.1:8000/api/tags/edit/${selectedTag.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: tag.name }),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Update the tags list with the updated tag
        setTags(tags.map((t) => (t.id === data.tag.id ? data.tag : t)))

        toast({
          title: "Tag updated",
          description: "Tag has been updated successfully.",
        })
      } else {
        // Create new tag
        const response = await fetch("http://127.0.0.1:8000/api/tags/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: tag.name }),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Add the new tag to the list
        setTags([...tags, data.tag])

        toast({
          title: "Tag created",
          description: "New tag has been created successfully.",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save tag:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tag. Please try again.",
      })
    }
  }

  const handleDeleteTag = async () => {
    if (!tagToDelete) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tags/delete/${tagToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Remove the deleted tag from the list
      setTags(tags.filter((t) => t.id !== tagToDelete.id))

      toast({
        title: "Tag deleted",
        description: "Tag has been deleted successfully.",
      })

      setDeleteDialogOpen(false)
      setTagToDelete(null)
    } catch (error) {
      console.error("Failed to delete tag:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tag. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">Manage your product tags</p>
        </div>
        <Button onClick={handleAddTag}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search tags..."
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
        <TagsTable tags={filteredTags} onEdit={handleEditTag} onDelete={handleDeleteClick} />
      )}

      <TagDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} tag={selectedTag} onSave={handleSaveTag} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tag"
        description={`Are you sure you want to delete the tag "${tagToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteTag}
      />
    </div>
  )
}
