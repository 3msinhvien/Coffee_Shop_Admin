"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CategoryDialog } from "@/components/categories/category-dialog"
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const { toast } = useToast()

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load categories. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleSaveCategory = async (category: Partial<Category>) => {
    try {
      if (selectedCategory) {
        // Update existing category
        const response = await fetch(`http://127.0.0.1:8000/api/categories/edit/${selectedCategory.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: category.title }),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Update the categories list with the updated category
        setCategories(categories.map((c) => (c.id === data.category.id ? data.category : c)))

        toast({
          title: "Category updated",
          description: "Category has been updated successfully.",
        })
      } else {
        // Create new category
        const response = await fetch("http://127.0.0.1:8000/api/categories/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: category.title }),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Add the new category to the list
        setCategories([...categories, data.category])

        toast({
          title: "Category created",
          description: "New category has been created successfully.",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save category:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category. Please try again.",
      })
    }
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/categories/delete/${categoryToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Remove the deleted category from the list
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id))

      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      })

      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      console.error("Failed to delete category:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search categories..."
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
        <CategoriesTable categories={filteredCategories} onEdit={handleEditCategory} onDelete={handleDeleteClick} />
      )}

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${categoryToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteCategory}
      />
    </div>
  )
}
