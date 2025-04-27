"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CategoryDialog } from "@/components/categories/category-dialog"
import { fetchCategories } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
        toast({
          variant: "destructive",
          title: "Error loading categories",
          description: "There was a problem loading the categories. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [toast])

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

  const handleSaveCategory = async (category: Category) => {
    try {
      if (selectedCategory) {
        // Gọi API update category ở đây nếu cần
      } else {
        // Gọi API tạo mới category
        const response = await fetch("http://localhost:8000/api/categories/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: category.title }),
        })
        if (!response.ok) throw new Error("Failed to create category")
        const data = await response.json()
        setCategories([...categories, data.category])
        toast({
          title: "Category created",
          description: "The category has been successfully created.",
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category.",
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    // In a real app, this would call the API to delete the category
    setCategories(categories.filter((c) => c.id !== id))
    toast({
      title: "Category deleted",
      description: "The category has been successfully deleted.",
    })
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
        <CategoriesTable categories={filteredCategories} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
      )}

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
