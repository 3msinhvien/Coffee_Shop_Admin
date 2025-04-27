import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order } from "@/types"

interface RecentOrdersTableProps {
  data: Order[]
}

export function RecentOrdersTable({ data }: RecentOrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No recent orders
            </TableCell>
          </TableRow>
        ) : (
          data.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(order.date), { addSuffix: true })}</TableCell>
              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { variant: "outline" },
    processing: { variant: "secondary" },
    completed: { variant: "default" },
    cancelled: { variant: "destructive" },
  }

  const config = statusMap[status] || { variant: "outline" }

  return <Badge variant={config.variant}>{status}</Badge>
}
