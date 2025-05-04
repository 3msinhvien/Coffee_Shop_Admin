"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  onSave: (formData: FormData) => void
}

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const { toast } = useToast()
  const methods = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [image, setImage] = useState<File | undefined>()
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  useEffect(() => {
    if (open) {
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

      if (product) {
        methods.reset({
          name: product.name,
          description: product.description,
          cost: product.cost,
          quantity: product.quantity,
        })
        setSelectedCategories(product.categories || [])
        setSelectedTags(product.tags || [])
      } else {
        methods.reset({
          name: "",
          description: "",
          cost: 0,
          quantity: 0,
        })
        setSelectedCategories([])
        setSelectedTags([])
        setImage(undefined)
      }
    }
  }, [open, product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  const handleCategoryChange = (value: string) => {
    const category = categories.find((c) => c.id === value)
    if (category) setSelectedCategories((prev) => [...prev, category])
  }

  const handleRemoveCategory = (id: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const handleTagChange = (value: string) => {
    const tag = tags.find((t) => t.id === value)
    if (tag) setSelectedTags((prev) => [...prev, tag])
  }

  const handleRemoveTag = (id: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSubmit = methods.handleSubmit(async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description || "")
      formData.append("cost", data.cost.toString())
      formData.append("quantity", data.quantity.toString())
      if (image) formData.append("image", image)
      selectedCategories.forEach((c) => formData.append("categories[]", c.id))
      selectedTags.forEach((t) => formData.append("tags[]", t.id))

      onSave(formData)

      toast({
        title: `Product ${product ? "updated" : "created"} successfully`,
        description: `${data.name} has been ${product ? "updated" : "added"} to your inventory.`,
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
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update the product details below." : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </label>
                <Input id="name" {...methods.register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="cost" className="text-sm font-medium">
                  Price ($)
                </label>
                <Input id="cost" type="number" step="0.01" min="0" {...methods.register("cost", { required: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea id="description" rows={3} {...methods.register("description")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Stock Quantity
                </label>
                <Input id="quantity" type="number" min="0" {...methods.register("quantity", { required: true })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Product Image
                </label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categories</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category) => (
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
                    .filter((c) => !selectedCategories.some((sc) => sc.id === c.id))
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
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
                    .filter((t) => !selectedTags.some((st) => st.id === t.id))
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
