import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pending: { variant: "outline", label: "Pending" },
    processing: { variant: "secondary", label: "Processing" },
    completed: { variant: "default", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
    unpaid: { variant: "outline", label: "Unpaid" },
    paid: { variant: "default", label: "Paid" },
    shipped: { variant: "secondary", label: "Shipped" },
    delivered: { variant: "default", label: "Delivered" },
  }

  const config = statusMap[status] || { variant: "outline", label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
