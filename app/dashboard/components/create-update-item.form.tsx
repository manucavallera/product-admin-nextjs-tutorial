"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, LoaderCircle } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDocument, updateDocument, uploadBase64 } from "@/lib/firebase";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ItemImage } from "@/interfaces/item-image.interface";
import { Product } from "@/interfaces/product.interface";
import DragAndDropImage from "@/components/drag-and-drop-image";
import { useUser } from "@/hooks/use-user";
import Image from "next/image";
import Items from "./items";

interface CreateUpdateItemProps {
  children: React.ReactNode;
  itemToUpdate?: Product;
  getItems: () => Promise<void>;
}

export function CreateUpdateItem({
  children,
  itemToUpdate,
  getItems,
}: CreateUpdateItemProps) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  //********** Form Schema ************/
  const formSchema = z.object({
    image: z.object({
      path: z.string(),
      url: z.string(),
    }),
    name: z.string().min(4, { message: "Name must be at least 4 characters" }),
    price: z.coerce.number().gte(0, { message: "The minimum value must be 0" }),
    soldUnits: z.coerce
      .number()
      .gte(0, { message: "The minimum value must be 0" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: itemToUpdate
      ? itemToUpdate
      : {
          image: {} as ItemImage,
          name: "",
          price: undefined,
          soldUnits: undefined,
        },
  });

  const { register, handleSubmit, formState, setValue, reset } = form;
  const { errors } = formState;

  //********** Update the Image value ************/
  const handleImage = (url: string) => {
    let path = itemToUpdate
      ? itemToUpdate.image.path
      : `${user?.uid}/${Date.now()}`;
    setValue("image", { url, path });

    setImage(url);
  };

  useEffect(() => {
    if (itemToUpdate) setImage(itemToUpdate.image.url);
  }, [open]);

  //******* Submit create or update item *******/
  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    if (itemToUpdate) {
      updateItem(item);
    } else {
      createItem(item);
    }
  };

  //********** Create Item  ************
  const createItem = async (item: Product) => {
    const path = `users/${user?.uid}/products`;
    setIsLoading(true);
    try {
      //***Upload image and get url ***/
      const base64 = item.image.url;
      const imagePath = item.image.path;
      const imageUrl = await uploadBase64(imagePath, base64);
      item.image.url = imageUrl;
      await addDocument(path, item);
      toast.success("Item created successfully");
      getItems();
      setOpen(false); // Close modal
      reset();
      setImage("");
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  //********** Update Item  ************
  const updateItem = async (item: Product) => {
    const path = `users/${user?.uid}/products/${itemToUpdate?.id}`;
    setIsLoading(true);
    try {
      if (itemToUpdate?.image.url !== item.image.url) {
        const base64 = item.image.url;
        const imagePath = item.image.path;
        const imageUrl = await uploadBase64(imagePath, base64);
        item.image.url = imageUrl;
      }

      await updateDocument(path, item);
      toast.success("Item updated successfully");
      getItems();
      reset(); // Reset form values
      setImage("");
      setOpen(false); // Close modal
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle closing modal and resetting form
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {itemToUpdate ? "Update Item" : "Create Item"}
          </DialogTitle>
          <DialogDescription>
            Manage your product with the following information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            {/* Image */}
            <div className='mb-3'>
              <Label htmlFor='image'>Image</Label>
              {image ? (
                <div className='text-center'>
                  <Image
                    width={1000}
                    height={1000}
                    src={image}
                    alt='item-image'
                    className='w-[50%] m-auto'
                  />

                  <Button
                    type='button'
                    onClick={() => handleImage("")}
                    disabled={isLoading}
                    className='mt-6'
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <DragAndDropImage handleImage={handleImage} />
              )}
            </div>

            {/* Name */}
            <div className='mb-3'>
              <Label htmlFor='name'>Name</Label>
              <Input
                {...register("name")}
                id='name'
                placeholder='Product name'
                type='text'
                autoComplete='name'
              />
              <p className='text-sm text-red-500'>{errors.name?.message}</p>
            </div>
            {/* Price */}
            <div className='mb-3'>
              <Label htmlFor='price'>Price</Label>
              <Input
                {...register("price")}
                id='price'
                placeholder='0.00'
                type='number'
                step='0.01'
              />
              <p className='text-sm text-red-500'>{errors.price?.message}</p>
            </div>
            {/* Sold Units */}
            <div className='mb-3'>
              <Label htmlFor='soldUnits'>Sold Units</Label>
              <Input
                {...register("soldUnits")}
                id='soldUnits'
                placeholder='0'
                type='number'
                step='1'
              />
              <p className='text-sm text-red-500'>
                {errors.soldUnits?.message}
              </p>
            </div>
            {/* Submit */}
            <DialogFooter>
              <Button type='submit' disabled={isLoading}>
                {isLoading && (
                  <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                )}
                {itemToUpdate ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
