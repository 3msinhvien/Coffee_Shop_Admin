"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MultiSelect } from "@/components/ui/multi-select"
import type { Category, Tag } from "@/types"

interface AddProductFormProps {
  categories: Category[]
  tags: Tag[]
  onSuccess: () => void
}

export function AddProductForm({ categories, tags, onSuccess }: AddProductFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form data
  const [name, setName] = useState("")
  const [cost, setCost] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Product name is required"
    if (!cost || isNaN(Number(cost)) || Number(cost) <= 0) newErrors.cost = "Valid price is required"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 0) newErrors.quantity = "Valid quantity is required"
    if (selectedCategories.length === 0) newErrors.categories = "At least one category is required"
    if (!fileInputRef.current?.files?.[0]) newErrors.image = "Product image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file.",
        })
        e.target.value = ""
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Image size should be less than 5MB.",
        })
        e.target.value = ""
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Clear error if exists
      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Append all required fields
      formData.append("name", name)
      formData.append("cost", String(Number(cost)))
      formData.append("description", description)
      formData.append("quantity", String(Number(quantity)))

      // Append image if selected
      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0])
      }

      // Append categories
      selectedCategories.forEach((categoryId) => {
        formData.append("categories", categoryId)
      })

      // Append tags if any
      selectedTags.forEach((tagId) => {
        formData.append("tags", tagId)
      })

      // Send request to API
      const response = await fetch("http://localhost:8000/api/product", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header, browser will set it with boundary
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      })

      // Reset form
      setName("")
      setCost("")
      setDescription("")
      setQuantity("")
      setSelectedCategories([])
      setSelectedTags([])
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      // Call success callback
      onSuccess()
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setName("")
    setCost("")
    setDescription("")
    setQuantity("")
    setSelectedCategories([])
    setSelectedTags([])
    setImagePreview(null)
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost" className={errors.cost ? "text-destructive" : ""}>
            Price ($) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            min="0"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            className={errors.cost ? "border-destructive" : ""}
          />
          {errors.cost && <p className="text-sm text-destructive">{errors.cost}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          rows={4}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity" className={errors.quantity ? "text-destructive" : ""}>
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className={errors.quantity ? "border-destructive" : ""}
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className={errors.image ? "text-destructive" : ""}>
            Product Image <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`max-w-sm ${errors.image ? "border-destructive" : ""}`}
            />
            {imagePreview && (
              <Button type="button" variant="ghost" size="icon" onClick={clearImage}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
          <p className="text-sm text-muted-foreground">Upload an image for the product (max 5MB)</p>
        </div>
      </div>

      {imagePreview && (
        <div className="mt-2">
          <p className="mb-2 text-sm font-medium">Image Preview:</p>
          <div className="relative h-40 w-40 overflow-hidden rounded-md border">
            <Image src={imagePreview || "/placeholder.svg"} alt="Product preview" fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className={errors.categories ? "text-destructive" : ""}>
          Categories <span className="text-destructive">*</span>
        </Label>
        <MultiSelect
          placeholder="Select categories"
          options={categories.map((category) => ({
            label: category.title,
            value: category.id,
          }))}
          selected={selectedCategories}
          onChange={setSelectedCategories}
          className={errors.categories ? "border-destructive" : ""}
        />
        {errors.categories && <p className="text-sm text-destructive">{errors.categories}</p>}
        <p className="text-sm text-muted-foreground">Select at least one category for the product</p>
      </div>

      <div className="space-y-2">
        <Label>Tags (Optional)</Label>
        <MultiSelect
          placeholder="Select tags"
          options={tags.map((tag) => ({
            label: tag.name,
            value: tag.id,
          }))}
          selected={selectedTags}
          onChange={setSelectedTags}
        />
        <p className="text-sm text-muted-foreground">Select tags to categorize the product</p>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Product
        </Button>
      </div>
    </form>
  )
}
