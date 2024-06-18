import { ItemImage } from "./item-image.interface";
import { Timestamp } from "firebase/firestore";

export interface Product {
  id?: string;
  image: ItemImage;
  name: string;
  price: number;
  soldUnits: number;
  createdAt?: Timestamp;
}
