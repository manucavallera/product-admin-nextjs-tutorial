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
import { Badge } from "@/components/ui/badge";

interface ListViewProps {
  items: Product[];
  getItems: () => Promise<void>;
  deleteItem: (item: Product) => Promise<void>;
}

const ListView = ({ items, getItems, deleteItem }: ListViewProps) => {
  return (
    <div className='block md:hidden'>
      {items.map((item) => (
        <div
          key={item.id}
          className='flex justify-between items-center mb-6 border border-solid border-gray-300 rounded-3xl p-6'
        >
          <div className='flex justify-start items-center'>
            <Image
              width={1000}
              height={1000}
              src={item.image.url}
              alt={item.name}
              className='object-cover w-16 h-16'
            />

            <div className='ml-6'>
              <h3 className='font-semibold'>{item.name}"</h3>
              <div className='text-sm'>
                {formatPrice(item.price)}
                <br />
                Sold Units: {item.soldUnits}
                <br />
                <Badge className='mt-2' variant={"outline"}>
                  Profit {formatPrice(item.soldUnits * item.price)}
                </Badge>
              </div>
            </div>
          </div>

          <div className='ml-2'>
            {/* Update Item */}
            <CreateUpdateItem getItems={getItems} itemToUpdate={item}>
              <Button className='w-8 h-8 p-0'>
                {" "}
                <SquarePen className='w-6 h-6' />{" "}
              </Button>
            </CreateUpdateItem>

            <div className='mb-2'></div>

            {/* Delete Item */}
            <ConfirmDeletion deleteItem={deleteItem} item={item}>
              <Button className='w-8 h-8 p-0' variant='destructive'>
                <Trash2 className='w-6 h-6' />
              </Button>
            </ConfirmDeletion>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
