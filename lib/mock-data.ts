import type { DashboardData, Product, Category, Order, User, Tag, Review, OrderProduct, Customer } from "@/types"
import type { DashboardData, Product, Category, Order, User, Tag, Review, OrderProduct, Customer } from "@/types"

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "cat-001",
    title: "Coffee Beans",
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2023-01-15T10:30:00Z",
  },
  {
    id: "cat-002",
    title: "Brewing Equipment",
    created_at: "2023-01-15T10:35:00Z",
    updated_at: "2023-01-15T10:35:00Z",
  },
  {
    id: "cat-003",
    title: "Coffee Drinks",
    created_at: "2023-01-15T10:40:00Z",
    updated_at: "2023-01-15T10:40:00Z",
  },
  {
    id: "cat-004",
    title: "Accessories",
    created_at: "2023-01-15T10:45:00Z",
    updated_at: "2023-01-15T10:45:00Z",
  },
  {
    id: "cat-005",
    title: "Gift Sets",
    created_at: "2023-01-15T10:50:00Z",
    updated_at: "2023-01-15T10:50:00Z",
  },
]

// Mock Tags
export const mockTags: Tag[] = [
  {
    id: "tag-001",
    name: "New Arrival",
    created_at: "2023-01-15T11:00:00Z",
    updated_at: "2023-01-15T11:00:00Z",
  },
  {
    id: "tag-002",
    name: "Best Seller",
    created_at: "2023-01-15T11:05:00Z",
    updated_at: "2023-01-15T11:05:00Z",
  },
  {
    id: "tag-003",
    name: "Limited Edition",
    created_at: "2023-01-15T11:10:00Z",
    updated_at: "2023-01-15T11:10:00Z",
  },
  {
    id: "tag-004",
    name: "Sale",
    created_at: "2023-01-15T11:15:00Z",
    updated_at: "2023-01-15T11:15:00Z",
  },
  {
    id: "tag-005",
    name: "Organic",
    created_at: "2023-01-15T11:20:00Z",
    updated_at: "2023-01-15T11:20:00Z",
  },
]

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: "rev-001",
    rating: 5,
    comment: "Excellent coffee, rich flavor and aroma!",
    user: {
      id: "user-001",
      name: "John Doe",
      email: "john@example.com",
    },
    created_at: "2023-02-10T14:30:00Z",
  },
  {
    id: "rev-002",
    rating: 4,
    comment: "Great quality for the price.",
    user: {
      id: "user-002",
      name: "Jane Smith",
      email: "jane@example.com",
    },
    created_at: "2023-02-12T09:15:00Z",
  },
  {
    id: "rev-003",
    rating: 5,
    comment: "My favorite coffee beans, always fresh!",
    user: {
      id: "user-003",
      name: "Robert Johnson",
      email: "robert@example.com",
    },
    created_at: "2023-02-15T16:45:00Z",
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "Ethiopian Yirgacheffe Coffee Beans",
    description: "Premium single-origin coffee beans with floral and citrus notes.",
    cost: 14.99,
    quantity: 45,
    quantity_sale: 120,
    image_url:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZmZlZSUyMGJlYW5zfGVufDB8fDB8fHww",
    tags: [mockTags[1], mockTags[4]], // Best Seller, Organic
    reviews: [mockReviews[0], mockReviews[2]],
    categories: [mockCategories[0]], // Coffee Beans
    created_at: "2023-01-20T08:00:00Z",
    updated_at: "2023-03-15T10:30:00Z",
  },
  {
    id: "prod-002",
    name: "Hario V60 Pour-Over Coffee Maker",
    description: "Classic pour-over coffee maker for precise brewing control.",
    cost: 24.99,
    quantity: 30,
    quantity_sale: 85,
    image_url:
      "https://images.unsplash.com/photo-1544778439-52b5c74e584d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwbWFrZXJ8ZW58MHx8MHx8fDA%3D",
    tags: [mockTags[1]], // Best Seller
    reviews: [mockReviews[1]],
    categories: [mockCategories[1]], // Brewing Equipment
    created_at: "2023-01-22T09:15:00Z",
    updated_at: "2023-03-10T14:20:00Z",
  },
  {
    id: "prod-003",
    name: "Colombian Supremo Coffee Beans",
    description: "Medium roast coffee beans with caramel and nutty flavors.",
    cost: 12.99,
    quantity: 60,
    quantity_sale: 95,
    image_url:
      "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvZmZlZSUyMGJlYW5zfGVufDB8fDB8fHww",
    tags: [mockTags[4]], // Organic
    reviews: [],
    categories: [mockCategories[0]], // Coffee Beans
    created_at: "2023-01-25T11:30:00Z",
    updated_at: "2023-03-05T16:45:00Z",
  },
  {
    id: "prod-004",
    name: "Espresso Machine - Professional Grade",
    description: "Commercial-grade espresso machine for café-quality coffee at home.",
    cost: 499.99,
    quantity: 8,
    quantity_sale: 12,
    image_url:
      "https://images.unsplash.com/photo-1585072857532-3c93825a4a0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVzcHJlc3NvJTIwbWFjaGluZXxlbnwwfHwwfHx8MA%3D%3D",
    tags: [mockTags[0], mockTags[2]], // New Arrival, Limited Edition
    reviews: [],
    categories: [mockCategories[1]], // Brewing Equipment
    created_at: "2023-02-01T13:45:00Z",
    updated_at: "2023-03-01T09:10:00Z",
  },
  {
    id: "prod-005",
    name: "Coffee Gift Box - Premium Selection",
    description: "Curated gift box with premium coffee beans and accessories.",
    cost: 49.99,
    quantity: 15,
    quantity_sale: 40,
    image_url:
      "https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvZmZlZSUyMGdpZnR8ZW58MHx8MHx8fDA%3D",
    tags: [mockTags[2]], // Limited Edition
    reviews: [],
    categories: [mockCategories[4]], // Gift Sets
    created_at: "2023-02-05T15:20:00Z",
    updated_at: "2023-02-28T11:30:00Z",
  },
  {
    id: "prod-006",
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic coffee mugs in assorted colors.",
    cost: 34.99,
    quantity: 25,
    quantity_sale: 60,
    image_url:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvZmZlZSUyMG11Z3N8ZW58MHx8MHx8fDA%3D",
    tags: [mockTags[1]], // Best Seller
    reviews: [],
    categories: [mockCategories[3]], // Accessories
    created_at: "2023-02-10T10:00:00Z",
    updated_at: "2023-02-25T14:15:00Z",
  },
  {
    id: "prod-007",
    name: "Cold Brew Coffee Maker",
    description: "Glass cold brew maker for smooth, low-acidity coffee.",
    cost: 29.99,
    quantity: 18,
    quantity_sale: 35,
    image_url:
      "https://images.unsplash.com/photo-1593369196682-6d8ec9ff2edd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbGQlMjBicmV3fGVufDB8fDB8fHww",
    tags: [mockTags[0]], // New Arrival
    reviews: [],
    categories: [mockCategories[1]], // Brewing Equipment
    created_at: "2023-02-15T09:30:00Z",
    updated_at: "2023-02-20T16:40:00Z",
  },
  {
    id: "prod-008",
    name: "Vanilla Flavored Coffee",
    description: "Medium roast coffee with natural vanilla flavor.",
    cost: 11.99,
    quantity: 4,
    quantity_sale: 75,
    image_url:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhbmlsbGElMjBjb2ZmZWV8ZW58MHx8MHx8fDA%3D",
    tags: [mockTags[3]], // Sale
    reviews: [],
    categories: [mockCategories[0]], // Coffee Beans
    created_at: "2023-02-18T11:15:00Z",
    updated_at: "2023-02-18T11:15:00Z",
  },
  {
    id: "prod-009",
    name: "Coffee Grinder - Electric",
    description: "Precision electric grinder with multiple grind settings.",
    cost: 59.99,
    quantity: 12,
    quantity_sale: 30,
    image_url:
      "https://images.unsplash.com/photo-1631705542039-78d6dc68a2f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29mZmVlJTIwZ3JpbmRlcnxlbnwwfHwwfHx8MA%3D%3D",
    tags: [],
    reviews: [],
    categories: [mockCategories[1]], // Brewing Equipment
    created_at: "2023-02-20T13:40:00Z",
    updated_at: "2023-02-20T13:40:00Z",
  },
  {
    id: "prod-010",
    name: "Coffee Subscription Box",
    description: "Monthly subscription of curated premium coffee beans.",
    cost: 19.99,
    quantity: 100,
    quantity_sale: 150,
    image_url:
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwc3Vic2NyaXB0aW9ufGVufDB8fDB8fHww",
    tags: [mockTags[0], mockTags[1]], // New Arrival, Best Seller
    reviews: [],
    categories: [mockCategories[4]], // Gift Sets
    created_at: "2023-02-22T15:00:00Z",
    updated_at: "2023-02-22T15:00:00Z",
  },
]

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA",
    },
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    address: {
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zip: "67890",
      country: "USA",
    },
  },
  {
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "555-456-7890",
    address: {
      street: "789 Pine Rd",
      city: "Elsewhere",
      state: "TX",
      zip: "54321",
      country: "USA",
    },
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-789-0123",
    address: {
      street: "321 Elm St",
      city: "Nowhere",
      state: "FL",
      zip: "09876",
      country: "USA",
    },
  },
  {
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "555-234-5678",
    address: {
      street: "654 Maple Dr",
      city: "Everywhere",
      state: "WA",
      zip: "13579",
      country: "USA",
    },
  },
]

// Mock Order Products
export const mockOrderProducts: OrderProduct[] = [
  {
    id: "op-001",
    name: "Ethiopian Yirgacheffe Coffee Beans",
    quantity: 2,
    price: 14.99,
  },
  {
    id: "op-002",
    name: "Ceramic Coffee Mug Set",
    quantity: 1,
    price: 34.99,
  },
  {
    id: "op-003",
    name: "Hario V60 Pour-Over Coffee Maker",
    quantity: 1,
    price: 24.99,
  },
  {
    id: "op-004",
    name: "Colombian Supremo Coffee Beans",
    quantity: 3,
    price: 12.99,
  },
  {
    id: "op-005",
    name: "Coffee Subscription Box",
    quantity: 1,
    price: 19.99,
  },
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "ord-001",
    customer: mockCustomers[0],
    date: "2023-03-15T10:30:00Z",
    status: "completed",
    total: 64.97,
    subtotal: 59.97,
    tax: 5.0,
    shipping: 0,
    items: [mockOrderProducts[0], mockOrderProducts[1]],
    user: {
      id: "user-001",
      email: "john.doe@example.com",
    },
    products: [],
    delivery: "Standard",
    totalPrice: 64.97,
    payment: "Credit Card",
    created_at: "2023-03-15T10:30:00Z",
    updated_at: "2023-03-15T15:45:00Z",
  },
  {
    id: "ord-002",
    customer: mockCustomers[1],
    date: "2023-03-16T14:45:00Z",
    status: "processing",
    total: 38.98,
    subtotal: 34.98,
    tax: 2.0,
    shipping: 2.0,
    items: [mockOrderProducts[3], mockOrderProducts[4]],
    user: {
      id: "user-002",
      email: "jane.smith@example.com",
    },
    products: [],
    delivery: "Express",
    totalPrice: 38.98,
    payment: "PayPal",
    created_at: "2023-03-16T14:45:00Z",
    updated_at: "2023-03-16T14:45:00Z",
  },
  {
    id: "ord-003",
    customer: mockCustomers[2],
    date: "2023-03-17T09:15:00Z",
    status: "pending",
    total: 24.99,
    subtotal: 24.99,
    tax: 0,
    shipping: 0,
    items: [mockOrderProducts[2]],
    user: {
      id: "user-003",
      email: "robert.johnson@example.com",
    },
    products: [],
    delivery: "Standard",
    totalPrice: 24.99,
    payment: "Credit Card",
    created_at: "2023-03-17T09:15:00Z",
    updated_at: "2023-03-17T09:15:00Z",
  },
  {
    id: "ord-004",
    customer: mockCustomers[3],
    date: "2023-03-18T16:30:00Z",
    status: "completed",
    total: 29.99,
    subtotal: 24.99,
    tax: 2.0,
    shipping: 3.0,
    items: [mockOrderProducts[0]],
    user: {
      id: "user-004",
      email: "emily.davis@example.com",
    },
    products: [],
    delivery: "Express",
    totalPrice: 29.99,
    payment: "Credit Card",
    created_at: "2023-03-18T16:30:00Z",
    updated_at: "2023-03-19T10:15:00Z",
  },
  {
    id: "ord-005",
    customer: mockCustomers[4],
    date: "2023-03-19T11:00:00Z",
    status: "cancelled",
    total: 54.98,
    subtotal: 49.98,
    tax: 5.0,
    shipping: 0,
    items: [mockOrderProducts[3], mockOrderProducts[4]],
    user: {
      id: "user-005",
      email: "michael.wilson@example.com",
    },
    products: [],
    delivery: "Standard",
    totalPrice: 54.98,
    payment: "PayPal",
    created_at: "2023-03-19T11:00:00Z",
    updated_at: "2023-03-20T09:30:00Z",
  },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Admin User",
    email: "admin@coffeeshop.com",
    role: "admin",
    isActive: true,
  },
  {
    id: "user-002",
    name: "Staff One",
    email: "staff1@coffeeshop.com",
    role: "staff",
    isActive: true,
  },
  {
    id: "user-003",
    name: "Staff Two",
    email: "staff2@coffeeshop.com",
    role: "staff",
    isActive: true,
  },
  {
    id: "user-004",
    name: "Manager",
    email: "manager@coffeeshop.com",
    role: "admin",
    isActive: true,
  },
  {
    id: "user-005",
    name: "Former Employee",
    email: "former@coffeeshop.com",
    role: "staff",
    isActive: false,
  },
]

// Mock Dashboard Data
export const mockDashboardData: DashboardData = {
  totalRevenue: 15420.5,
  revenueChange: 12.5,
  totalOrders: 142,
  pendingOrders: 23,
  totalProducts: mockProducts.length,
  lowStockProducts: mockProducts.filter((p) => p.quantity < 10).length,
  totalCustomers: 256,
  newCustomers: 18,
  salesData: [
    { date: "Mon", amount: 1200 },
    { date: "Tue", amount: 1800 },
    { date: "Wed", amount: 2400 },
    { date: "Thu", amount: 1600 },
    { date: "Fri", amount: 2800 },
    { date: "Sat", amount: 3200 },
    { date: "Sun", amount: 2400 },
  ],
  topProducts: [
    { name: "Ethiopian Yirgacheffe", value: 35 },
    { name: "Colombian Supremo", value: 25 },
    { name: "Espresso Machine", value: 20 },
    { name: "Coffee Subscription", value: 15 },
    { name: "Ceramic Mug Set", value: 5 },
  ],
  recentOrders: mockOrders.slice(0, 3),
  lowStockItems: mockProducts.filter((p) => p.quantity < 10),
}
