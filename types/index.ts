// Dashboard types
export interface DashboardData {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  pendingOrders: number
  totalProducts: number
  lowStockProducts: number
  totalCustomers: number
  newCustomers: number
  salesData: {
    date: string
    amount: number
  }[]
  topProducts: {
    name: string
    value: number
  }[]
  recentOrders: Order[]
  lowStockItems: Product[]
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  cost: number
  quantity: number
  quantity_sale?: number
  image_url?: string
  image?: string
  tags?: Tag[]
  reviews?: Review[]
  categories?: Category[]
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  user: User
  created_at: string
}

// Order types
export interface Order {
  id: string
  user: User
  products: OrderProduct[]
  delivery: string
  totalPrice: number
  payment: string
  created_at: string
  updated_at: string
}

export interface OrderProduct {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Customer {
  name: string
  email: string
  phone: string
  address?: Address
}

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

// User types
export interface User {
  id: string
  name?: string
  email: string
  role?: string
  isActive?: boolean
}

// API response types
export interface TagsResponse {
  tags: Tag[]
}

export interface CategoriesResponse {
  categories: Category[]
}

export interface ProductsResponse {
  products: Product[]
}

export interface ProductResponse {
  product: Product
}

export interface PriceRangeResponse {
  min_price: number
  max_price: number
}

export interface CartResponse {
  cart_items: CartItem[]
  total_price: number
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  price: number
}

export interface ApiResponse {
  status: string
  message: string
}
