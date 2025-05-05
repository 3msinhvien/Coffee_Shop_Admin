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

// Category types
export interface Category {
  id: string
  title: string
  created_at: string
  updated_at: string
}

// Tag types
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

// Updated Order types to match the API response
export interface Order {
  id: number
  user: {
    id: string
    username: string
    email: string
  }
  delivery: {
    address: string
    name: string
    phone: string
  }
  totalPrice: string
  payment: {
    id: string | null
    method: string
    status: string
  }
  delivery_status: string
  created_at: string
  updated_at: string
  carts: CartItem[]
  // Keep these for backward compatibility
  customer?: Customer
  date?: string
  status?: string
  total?: number
  subtotal?: number
  tax?: number
  shipping?: number
  items?: OrderProduct[]
  products?: OrderProduct[]
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
  username: string
  email: string
  address?: string
  phoneNumber?: string
  is_admin: boolean
  // Keep these for backward compatibility
  name?: string
  role?: string
  isActive?: boolean
}

// API response types
export interface TagsResponse {
  tags: Tag[]
}

export interface TagResponse {
  tag: Tag
}

export interface CategoriesResponse {
  categories: Category[]
}

export interface CategoryResponse {
  category: Category
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
  user?: string
  product: Product
  quantity: number
  price?: number
  created_at?: string
  updated_at?: string
  is_paid?: boolean
  order?: number
}

export interface ApiResponse {
  status: string
  message: string
}

export interface OrdersResponse {
  orders: Order[]
}
