"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Loader2, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { useToast } from "@/hooks/use-toast"
import { createProductWithImage } from "@/lib/api"
import type { Category, Tag } from "@/types"

interface AddProductFormProps {
  categories: Category[]
  tags: Tag[]
  onSuccess: () => void
}

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  cost: z.coerce.number().positive("Price must be a positive number"),
  description: z.string().optional(),
  quantity: z.coerce.number().int().nonnegative("Quantity must be a non-negative integer"),
  category_ids: z.array(z.string()).min(1, "At least one category is required"),
  tag_ids: z.array(z.string()).optional(),
  image: z.instanceof(File).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function AddProductForm({ categories, tags, onSuccess }: AddProductFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      cost: 0,
      description: "",
      quantity: 0,
      category_ids: [],
      tag_ids: [],
    },
  })

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

      form.setValue("image", file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    form.setValue("image", undefined)
    setImagePreview(null)
    // Reset the file input
    const fileInput = document.getElementById("image") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      // Create FormData object for multipart/form-data submission
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("cost", data.cost.toString())
      formData.append("quantity", data.quantity.toString())

      if (data.description) {
        formData.append("description", data.description)
      }

      // Append category IDs
      data.category_ids.forEach((id) => {
        formData.append("category_ids", id)
      })

      // Append tag IDs if any
      if (data.tag_ids && data.tag_ids.length > 0) {
        data.tag_ids.forEach((id) => {
          formData.append("tag_ids", id)
        })
      }

      // Append image if selected
      if (data.image) {
        formData.append("image", data.image)
      }

      await createProductWithImage(formData)

      toast({
        title: "Success",
        description: "Product created successfully",
      })

      // Reset form
      form.reset()
      setImagePreview(null)

      // Call success callback
      onSuccess()
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel htmlFor="image">Product Image</FormLabel>
            <div className="flex items-center gap-4">
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="max-w-sm" />
              {imagePreview && (
                <Button type="button" variant="ghost" size="icon" onClick={clearImage}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormDescription>Upload an image for the product (max 5MB)</FormDescription>
          </FormItem>
        </div>

        {imagePreview && (
          <div className="mt-2">
            <p className="mb-2 text-sm font-medium">Image Preview:</p>
            <div className="relative h-40 w-40 overflow-hidden rounded-md border">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Product preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="category_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Select categories"
                  options={categories.map((category) => ({
                    label: category.title,
                    value: category.id,
                  }))}
                  selected={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Select at least one category for the product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Select tags (optional)"
                  options={tags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                  selected={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Select tags to categorize the product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Product
          </Button>
        </div>
      </form>
    </Form>
  )
}
