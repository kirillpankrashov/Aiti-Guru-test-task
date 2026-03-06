import { z } from 'zod';
import { addProductSchema } from '../pages/ProductsPage/components/Modals/AddProducts/model/schema';
import { authSchema } from '../pages/HomePage/model/schema';

export type ProductType = {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
  thumbnail: string;
};

export type FormValues = z.infer<typeof addProductSchema>;

export type AuthFormValues = z.infer<typeof authSchema>;

export type FieldsConfig = {
	name: keyof FormValues;
	label: string;
};
