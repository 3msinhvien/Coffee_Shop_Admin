import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { variant: "outline" },
    processing: { variant: "secondary" },
    completed: { variant: "default" },
    cancelled: { variant: "destructive" },
  }

  const config = statusMap[status] || { variant: "outline" }

  return <Badge variant={config.variant}>{status}</Badge>
}
