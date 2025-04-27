"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TagsTable } from "@/components/tags/tags-table"
import { TagDialog } from "@/components/tags/tag-dialog"
import { fetchTags } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Tag } from "@/types"

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchTags()
        setTags(data)
      } catch (error) {
        console.error("Failed to load tags:", error)
        toast({
          variant: "destructive",
          title: "Error loading tags",
          description: "There was a problem loading the tags. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTags()
  }, [toast])

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddTag = () => {
    setSelectedTag(null)
    setIsDialogOpen(true)
  }

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setIsDialogOpen(true)
  }

  const handleSaveTag = async (tag: Tag) => {
    // In a real app, this would call the API to save the tag
    if (selectedTag) {
      // Update existing tag
      setTags(tags.map((t) => (t.id === tag.id ? tag : t)))
    } else {
      // Add new tag with a fake ID
      setTags([...tags, { ...tag, id: `temp-${Date.now()}` }])
    }
    setIsDialogOpen(false)
    toast({
      title: `Tag ${selectedTag ? "updated" : "created"} successfully`,
      description: `${tag.name} has been ${selectedTag ? "updated" : "added"} to your tags.`,
    })
  }

  const handleDeleteTag = async (id: string) => {
    // In a real app, this would call the API to delete the tag
    setTags(tags.filter((t) => t.id !== id))
    toast({
      title: "Tag deleted",
      description: "The tag has been successfully deleted.",
    })
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
        <TagsTable tags={filteredTags} onEdit={handleEditTag} onDelete={handleDeleteTag} />
      )}

      <TagDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} tag={selectedTag} onSave={handleSaveTag} />
    </div>
  )
}
