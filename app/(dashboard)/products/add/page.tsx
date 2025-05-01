"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddProductForm } from "@/components/products/add-product-form"
import { fetchCategories, fetchTags } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Category, Tag } from "@/types"

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [categoriesData, tagsData] = await Promise.all([fetchCategories(), fetchTags()])
        setCategories(categoriesData)
        setTags(tagsData)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Failed to load categories and tags. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleSuccess = () => {
    toast({
      title: "Product created",
      description: "The product has been successfully created.",
    })
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your coffee shop</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter the details for your new product.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AddProductForm categories={categories} tags={tags} onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
