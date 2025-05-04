import type {
  DashboardData,
  Product,
  Category,
  Order,
  User,
  Tag,
  TagsResponse,
  CategoriesResponse,
  ProductsResponse,
  ProductResponse,
  PriceRangeResponse,
  CartResponse,
  ApiResponse,
} from "@/types"

import { mockDashboardData, mockProducts } from "@/lib/mock-data"
import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api"

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error)
    throw error
  }
}

// Mock data for dashboard
export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    // Try to fetch from API
    const response = await fetch(`${API_BASE_URL}/dashboard`)
    if (response.ok) {
      return await response.json()
    }
    throw new Error("API unavailable")
  } catch (error) {
    console.log("Using mock dashboard data")
    // Return mock data if API fails
    return mockDashboardData
  }
}

// Fetch all products with optional filters
export async function fetchProducts(filters?: {
  category?: string
  tag?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams()

    if (filters) {
      if (filters.category) queryParams.append("category", filters.category)
      if (filters.tag) queryParams.append("tag", filters.tag)
      if (filters.minPrice) queryParams.append("min_price", filters.minPrice.toString())
      if (filters.maxPrice) queryParams.append("max_price", filters.maxPrice.toString())
      if (filters.search) queryParams.append("search", filters.search)
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    const response = await apiCall<ProductsResponse>(`/product/all${queryString}`)
    return response.products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    // Return mock data if API fails
    return [
      {
        id: "aaaaaaaa-1111-2222-3333-aaaaaaaaaaaa",
        image_url:
          "https://www.highlandscoffee.com.vn/vnt_upload/product/06_2023/HLC_New_logo_5.1_Products__CARAMEL_FREEZE_PHINDI.jpg",
        name: "Pro Espresso Machine",
        cost: 499.99,
        description: "High-quality espresso machine with stainless steel boiler.",
        quantity: 10,
        quantity_sale: 0,
        created_at: "2025-04-26T09:00:00Z",
        updated_at: "2025-04-26T09:00:00Z",
        tags: [],
        reviews: [],
        categories: [],
        image:
          "https://www.highlandscoffee.com.vn/vnt_upload/product/06_2023/HLC_New_logo_5.1_Products__CARAMEL_FREEZE_PHINDI.jpg",
      },
    ]
  }
}

// Fetch a single product by ID
export async function fetchProductById(id: string): Promise<Product> {
  try {
    const response = await apiCall<ProductResponse>(`/product/${id}`)
    return response.product
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error)
    throw error
  }
}

// Create a new product with image upload
export async function createProductWithImage(formData: FormData): Promise<Product> {
  console.log("[DEBUG] API called with:")
  for (const [key, value] of formData.entries()) {
    console.log(` - ${key}:`, value)
  }
  try {
    const response = await fetch(`http://localhost:8000/api/product`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header, let the browser set it with the boundary parameter
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error("Failed to create product:", error)
    throw error
  }
}

// Update a product
// Thêm hàm mới để cập nhật sản phẩm với FormData
// export async function updateProductWithImage(id: string, formData: FormData): Promise<Product> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/product/edit/${id}`, {
//       method: "PATCH",
//       body: formData,
//       // Không set Content-Type header, browser sẽ tự set với boundary parameter
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.message || `API error: ${response.status}`)
//     }

//     const data = await response.json()
//     return data.product
//   } catch (error) {
//     console.log(`Using mock data for updating product ${id} with image`)
//     // Find and update the mock product
//     const productIndex = mockProducts.findIndex((p) => p.id === id)
//     if (productIndex === -1) {
//       throw new Error(`Product with ID ${id} not found`)
//     }

//     const updatedProduct = {
//       ...mockProducts[productIndex],
//       name: formData.get("name")?.toString() || mockProducts[productIndex].name,
//       description: formData.get("description")?.toString() || mockProducts[productIndex].description,
//       cost: Number(formData.get("cost")) || mockProducts[productIndex].cost,
//       quantity: Number(formData.get("quantity")) || mockProducts[productIndex].quantity,
//       updated_at: new Date().toISOString(),
//     }

//     // If there's a new image, update the image_url (in a real app, this would be handled properly)
//     const imageFile = formData.get("image") as File
//     if (imageFile && imageFile.size > 0) {
//       updatedProduct.image_url = "/placeholder.svg?height=200&width=200" // In a real app, this would be the uploaded image URL
//     }

//     mockProducts[productIndex] = updatedProduct
//     return updatedProduct
//   }
// }



// Delete a product
export async function deleteProduct(id: string): Promise<void> {
  try {
    await apiCall<ApiResponse>(`/product/delete/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error)
    throw error
  }
}

// Get price range for products
export async function fetchPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const response = await apiCall<PriceRangeResponse>("/product/price")
    return {
      min: response.min_price,
      max: response.max_price,
    }
  } catch (error) {
    console.error("Failed to fetch price range:", error)
    return { min: 0, max: 1000 } // Default range
  }
}

// Create a product review
export async function createReview(productId: string, rating: number, comment: string): Promise<ApiResponse> {
  try {
    return await apiCall<ApiResponse>("/product/review", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        rating,
        comment,
      }),
    })
  } catch (error) {
    console.error("Failed to create review:", error)
    throw error
  }
}

// Cập nhật các hàm liên quan đến Category API
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await apiCall<CategoriesResponse>("/categories")
    return response.categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    // Return mock data if API fails
    return [
      {
        id: "11111111-1111-1111-1111-111111111111",
        title: "Espresso Machines",
        created_at: "2025-04-26T10:00:00Z",
        updated_at: "2025-04-26T10:00:00Z",
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        title: "Coffee Grinders",
        created_at: "2025-04-26T10:00:00Z",
        updated_at: "2025-04-26T10:00:00Z",
      },
    ]
  }
}

// Thêm hàm tạo category mới
export async function createCategory(title: string): Promise<Category> {
  try {
    const response = await apiCall<{ category: Category }>("/categories/create", {
      method: "POST",
      body: JSON.stringify({ title }),
    })
    return response.category
  } catch (error) {
    console.error("Failed to create category:", error)
    throw error
  }
}

// Thêm hàm sửa category
export async function updateCategory(id: string, title: string): Promise<Category> {
  try {
    const response = await apiCall<{ category: Category }>(`/categories/edit/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    })
    return response.category
  } catch (error) {
    console.error("Failed to update category:", error)
    throw error
  }
}

// Thêm hàm xóa category
export async function deleteCategory(id: string): Promise<void> {
  try {
    await apiCall<ApiResponse>(`/categories/delete/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("Failed to delete category:", error)
    throw error
  }
}

// Cập nhật các hàm liên quan đến Tag API
export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await apiCall<TagsResponse>("/tags")
    return response.tags
  } catch (error) {
    console.error("Failed to fetch tags:", error)
    // Return mock data if API fails
    return [
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "New Arrival",
        created_at: "2025-04-26T10:00:00Z",
        updated_at: "2025-04-26T10:00:00Z",
      },
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        name: "Best Seller",
        created_at: "2025-04-26T10:00:00Z",
        updated_at: "2025-04-26T10:00:00Z",
      },
    ]
  }
}

// Cập nhật hàm tạo tag mới
export async function createTag(name: string): Promise<Tag> {
  try {
    const response = await apiCall<{ tag: Tag }>("/tags/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
    return response.tag
  } catch (error) {
    console.error("Failed to create tag:", error)
    throw error
  }
}

// Cập nhật hàm sửa tag
export async function updateTag(id: string, name: string): Promise<Tag> {
  try {
    const response = await apiCall<{ tag: Tag }>(`/tags/edit/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    })
    return response.tag
  } catch (error) {
    console.error("Failed to update tag:", error)
    throw error
  }
}

// Cập nhật hàm xóa tag
export async function deleteTag(id: string): Promise<void> {
  try {
    await apiCall<ApiResponse>(`/tags/delete/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("Failed to delete tag:", error)
    throw error
  }
}

// Fetch cart items
export async function fetchCart(): Promise<CartResponse> {
  try {
    return await apiCall<CartResponse>("/cart")
  } catch (error) {
    console.error("Failed to fetch cart:", error)
    throw error
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number): Promise<ApiResponse> {
  try {
    return await apiCall<ApiResponse>("/cart/update", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    })
  } catch (error) {
    console.error("Failed to add item to cart:", error)
    throw error
  }
}

// Remove item from cart
export async function removeFromCart(cartId: number): Promise<ApiResponse> {
  try {
    return await apiCall<ApiResponse>(`/cart/remove/${cartId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("Failed to remove item from cart:", error)
    throw error
  }
}

// Mock data for users
export async function fetchUsers(): Promise<User[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    { id: "USER-001", name: "Admin User", email: "admin@coffeeshop.com", role: "admin", isActive: true },
    { id: "USER-002", name: "Staff One", email: "staff1@coffeeshop.com", role: "staff", isActive: true },
    { id: "USER-003", name: "Staff Two", email: "staff2@coffeeshop.com", role: "staff", isActive: true },
    { id: "USER-004", name: "Former Employee", email: "former@coffeeshop.com", role: "staff", isActive: false },
  ]
}

// User authentication
export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  try {
    const response = await apiCall<{ token: string; user: User }>("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return response
  } catch (error) {
    console.error("Login failed:", error)
    throw error
  }
}

export async function registerUser(userData: {
  email: string
  password: string
  name?: string
}): Promise<ApiResponse> {
  try {
    return await apiCall<ApiResponse>("/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  } catch (error) {
    console.error("Registration failed:", error)
    throw error
  }
}

// Password reset
export async function requestPasswordReset(email: string): Promise<ApiResponse> {
  try {
    return await apiCall<ApiResponse>("/user/emailReset", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  } catch (error) {
    console.error("Password reset request failed:", error)
    throw error
  }
}

export async function verifyResetCode(email: string, code: string): Promise<ApiResponse> {
  try {
    return await apiCall<ApiResponse>("/user/resetCode", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    })
  } catch (error) {
    console.error("Reset code verification failed:", error)
    throw error
  }
}

export async function setNewPassword(email: string, code: string, password: string): Promise<ApiResponse> {
  try {
    return await apiCall<ApiResponse>("/user/resetPass", {
      method: "POST",
      body: JSON.stringify({ email, code, password }),
    })
  } catch (error) {
    console.error("Setting new password failed:", error)
    throw error
  }
}

// Mock data for orders
// export async function fetchOrders(): Promise<Order[]> {
//   // Simulate API call delay
//   await new Promise((resolve) => setTimeout(resolve, 500))

//   return [
//     {
//       id: "ORD-001",
//       customer: {
//         name: "John Doe",
//         email: "john.doe@example.com",
//         phone: "123-456-7890",
//         address: {
//           street: "123 Main St",
//           city: "Anytown",
//           state: "CA",
//           zip: "91234",
//           country: "USA",
//         },
//       },
//       date: "2024-01-20T14:30:00Z",
//       status: "processing",
//       total: 55.5,
//       subtotal: 50.0,
//       tax: 2.5,
//       shipping: 3.0,
//       items: [
//         { id: "ITEM-001", name: "Latte", quantity: 2, price: 4.5 },
//         { id: "ITEM-002", name: "Muffin", quantity: 1, price: 6.0 },
//       ],
//       user: {
//         id: "USER-001",
//         email: "john@example.com",
//       },
//       products: [],
//       delivery: "",
//       totalPrice: 0,
//       payment: "",
//       created_at: "",
//       updated_at: "",
//     },
//     {
//       id: "ORD-002",
//       customer: {
//         name: "Jane Smith",
//         email: "jane.smith@example.com",
//         phone: "987-654-3210",
//         address: {
//           street: "456 Oak Ave",
//           city: "Springfield",
//           state: "IL",
//           zip: "62704",
//           country: "USA",
//         },
//       },
//       date: "2024-01-22T09:15:00Z",
//       status: "pending",
//       total: 32.0,
//       subtotal: 30.0,
//       tax: 1.5,
//       shipping: 0.5,
//       items: [
//         { id: "ITEM-003", name: "Coffee", quantity: 3, price: 3.0 },
//         { id: "ITEM-004", name: "Donut", quantity: 2, price: 4.5 },
//       ],
//       user: {
//         id: "USER-001",
//         email: "john@example.com",
//       },
//       products: [],
//       delivery: "",
//       totalPrice: 0,
//       payment: "",
//       created_at: "",
//       updated_at: "",
//     },
//   ]
// }
