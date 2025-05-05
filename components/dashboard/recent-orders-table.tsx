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
          <TableHead>Mã đơn hàng</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Trạng thái thanh toán</TableHead>
          <TableHead>Trạng thái giao hàng</TableHead>
          <TableHead className="text-right">Tổng tiền</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Không có đơn hàng gần đây
            </TableCell>
          </TableRow>
        ) : (
          data.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{order.delivery?.name || order.user?.username || "Khách hàng"}</TableCell>
              <TableCell>
                <PaymentStatusBadge status={order.payment?.status || "unpaid"} />
              </TableCell>
              <TableCell>
                <DeliveryStatusBadge status={order.delivery_status || "pending"} />
              </TableCell>
              <TableCell className="text-right">
                {Number.parseFloat(order.totalPrice || "0").toLocaleString("vi-VN")} đ
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function PaymentStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    paid: { variant: "default", label: "Đã thanh toán" },
    unpaid: { variant: "outline", label: "Chưa thanh toán" },
  }

  const config = statusMap[status] || { variant: "outline", label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

function DeliveryStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pending: { variant: "outline", label: "Đang chờ" },
    shipped: { variant: "secondary", label: "Đang giao" },
    delivered: { variant: "default", label: "Đã giao" },
    cancelled: { variant: "destructive", label: "Đã hủy" },
  }

  const config = statusMap[status] || { variant: "outline", label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
