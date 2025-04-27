"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { fetchCategories, fetchTags } from "@/lib/api"
import type { Product, Category, Tag } from "@/types"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (product: Product) => void
}

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    cost: 0,
    quantity: 0,
    image_url: "",
    categories: [],
    tags: [],
  })

  useEffect(() => {
    if (open) {
      // Load categories and tags
      const loadData = async () => {
        try {
          const [categoriesData, tagsData] = await Promise.all([fetchCategories(), fetchTags()])
          setCategories(categoriesData)
          setTags(tagsData)
        } catch (error) {
          console.error("Failed to load data:", error)
        }
      }

      loadData()

      // Set form data if editing
      if (product) {
        setFormData({
          id: product.id,
          name: product.name,
          description: product.description,
          cost: product.cost,
          quantity: product.quantity,
          image_url: product.image_url || product.image,
          categories: product.categories,
          tags: product.tags,
        })
      } else {
        // Reset form for new product
        setFormData({
          name: "",
          description: "",
          cost: 0,
          quantity: 0,
          image_url: "",
          categories: [],
          tags: [],
        })
      }
    }
  }, [open, product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleCategoryChange = (value: string) => {
    const category = categories.find((c) => c.id === value)
    if (category) {
      setFormData((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), category],
      }))
    }
  }

  const handleRemoveCategory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.filter((c) => c.id !== id) || [],
    }))
  }

  const handleTagChange = (value: string) => {
    const tag = tags.find((t) => t.id === value)
    if (tag) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }))
    }
  }

  const handleRemoveTag = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t.id !== id) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.name) {
        throw new Error("Product name is required")
      }

      // Save product
      onSave(formData as Product)

      toast({
        title: `Product ${product ? "updated" : "created"} successfully`,
        description: `${formData.name} has been ${product ? "updated" : "added"} to your inventory.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update the product details below." : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="name">Product Name</FormLabel>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="cost">Price ($)</FormLabel>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost || ""}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="quantity">Stock Quantity</FormLabel>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity || ""}
                onChange={handleNumberChange}
                required
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="image_url">Image URL</FormLabel>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Categories</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.categories?.map((category) => (
                <div key={category.id} className="flex items-center bg-muted rounded-md px-2 py-1">
                  <span className="text-sm">{category.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-1"
                    onClick={() => handleRemoveCategory(category.id)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Add a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => !formData.categories?.some((sc) => sc.id === c.id))
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FormLabel>Tags</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag) => (
                <div key={tag.id} className="flex items-center bg-muted rounded-md px-2 py-1">
                  <span className="text-sm">{tag.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-1"
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <Select onValueChange={handleTagChange}>
              <SelectTrigger>
                <SelectValue placeholder="Add a tag" />
              </SelectTrigger>
              <SelectContent>
                {tags
                  .filter((t) => !formData.tags?.some((st) => st.id === t.id))
                  .map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : product ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
