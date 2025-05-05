import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Product } from "@/types"

interface LowStockTableProps {
  data: Product[]
}

export function LowStockTable({ data }: LowStockTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sản phẩm</TableHead>
          <TableHead className="text-right">Tồn kho</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Không có sản phẩm sắp hết hàng
            </TableCell>
          </TableRow>
        ) : (
          data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-right">{product.quantity}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/products?id=${product.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">Xem sản phẩm</span>
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
