"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductsTable } from "@/components/products/products-table"
import { ProductDialog } from "@/components/products/product-dialog"
import { fetchProducts, deleteProduct, createProductWithImage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to load products:", error)
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "There was a problem loading the products. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  // const handleSaveProduct = async (formData: FormData) => {
  //   try {
  //     let savedProduct: any

  //     if (selectedProduct) {
  //       // Update existing product
  //       const response = await fetch(`/api/product/edit/${selectedProduct.id}`, {
  //         method: "PATCH",
  //         body: formData,
  //       })

  //       if (!response.ok) {
  //         let errorMessage = `API error: ${response.status}`
  //         try {
  //           const errorData = await response.json()
  //           if (errorData && errorData.message) {
  //             errorMessage = errorData.message
  //           }
  //         } catch (e) {
  //           console.error("Could not parse error response:", e)
  //         }
  //         throw new Error(errorMessage)
  //       }

  //       const data = await response.json()
  //       savedProduct = data.product

  //       // Update the product in the list
  //       setProducts((prevProducts) => prevProducts.map((p) => (p.id === savedProduct.id ? savedProduct : p)))
  //     } else {
  //       // Create new product
  //       savedProduct = await createProductWithImage(formData)

  //       // Add the new product to the list
  //       setProducts((prevProducts) => [...prevProducts, savedProduct])
  //     }

  //     // Close the dialog
  //     setIsDialogOpen(false)

  //     // Show success message
  //     toast({
  //       title: `Product ${selectedProduct ? "updated" : "created"} successfully`,
  //       description: `${savedProduct.name} has been ${selectedProduct ? "updated" : "added"} to your inventory.`,
  //     })
  //   } catch (error) {
  //     console.error("Error saving product:", error)

  //     toast({
  //       variant: "destructive",
  //       title: "Error saving product",
  //       description:
  //         error instanceof Error ? error.message : "There was a problem saving the product. Please try again.",
  //     })
  //   }
  // }
  const handleSaveProduct = async (formData: FormData) => {
    try {
      let savedProduct

      if (selectedProduct) {
        // Update existing product using axios
        const response = await axios.patch(`http://localhost:8000/api/product/edit/${selectedProduct.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        savedProduct = response.data.product

        // Update the product in the list
        setProducts((prevProducts) => prevProducts.map((p) => (p.id === savedProduct.id ? savedProduct : p)))
      } else {
        // Create new product
        savedProduct = await createProductWithImage(formData)

        // Add the new product to the list
        setProducts((prevProducts) => [...prevProducts, savedProduct])
      }

      // Close the dialog
      setIsDialogOpen(false)

      // Show success message
      toast({
        title: `Product ${selectedProduct ? "updated" : "created"} successfully`,
        description: `${savedProduct.name} has been ${selectedProduct ? "updated" : "added"} to your inventory.`,
      })
    } catch (error) {
      console.error("Error saving product:", error)

      let errorMessage = "There was a problem saving the product. Please try again."

      if (axios.isAxiosError(error) && error.response) {
        // Get error message from the response if available
        errorMessage = error.response.data?.message || `API error: ${error.response.status}`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        variant: "destructive",
        title: "Error saving product",
        description: errorMessage,
      })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: "There was a problem deleting the product. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your coffee shop products</p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search products..."
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
        <ProductsTable products={filteredProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
      )}

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
