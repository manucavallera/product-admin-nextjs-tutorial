import { formatPrice } from "@/actions/format-price";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/interfaces/product.interface";
import { SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { CreateUpdateItem } from "./create-update-item.form";
import { ConfirmDeletion } from "./confirm-deletion";
import { Skeleton } from "@/components/ui/skeleton";

interface TableViewProps {
  items: Product[];
  getItems: () => Promise<void>;
  deleteItem: (item: Product) => Promise<void>;
}

export function TableView({ items, getItems, deleteItem }: TableViewProps) {
  return (
    <div className='hidden md:block'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sold Units</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead className='text-center w-[250px]'>Actions</TableHead>
            <TableHead className='text-right'>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image?.url ? (
                    <Image
                      width={1000}
                      height={1000}
                      src={item.image.url}
                      alt={item.name}
                      className='object-cover w-16 h-16'
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
                <TableCell className='font-semibold w-[350px]'>
                  {item.name}
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>{item.soldUnits}</TableCell>
                <TableCell>
                  {formatPrice(item.soldUnits * item.price)}
                </TableCell>
                <TableCell className='text-center'>
                  {/* Update Item */}
                  <CreateUpdateItem getItems={getItems} itemToUpdate={item}>
                    <Button>
                      {" "}
                      <SquarePen />{" "}
                    </Button>
                  </CreateUpdateItem>
                  {/* Delete Item */}
                  <ConfirmDeletion deleteItem={deleteItem} item={item}>
                    <Button className='ml-4' variant='destructive'>
                      <Trash2 />
                    </Button>
                  </ConfirmDeletion>
                </TableCell>

                <TableCell>
                  <Skeleton className='w-16 h-16 rounded-xl' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-full h-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-full h-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-full h-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-full h-4' />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
