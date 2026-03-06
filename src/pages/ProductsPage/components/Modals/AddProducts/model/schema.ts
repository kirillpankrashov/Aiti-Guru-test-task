import { z } from 'zod';

const addProductSchema = z.object({
	title: z.string().trim().min(1, 'Введите название'),
	price: z
		.string()
		.trim()
		.min(1, 'Введите цену')
		.regex(/^\d+$/, 'Только цифры'),
	sku: z.string().trim().min(1, 'Введите артикул'),
	brand: z.string().trim().min(1, 'Введите вендора'),
});

export { addProductSchema };