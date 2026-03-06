import { apiClient } from './apiClient';
import type { FormValues, ProductType } from '../types/types';
import { PAGE_SIZE } from '../constants/constants';
import type { SortBy, SortOrder } from '../store/useProductStore';

export type ProductsResponse = {
	products: ProductType[];
	skip: number;
	total: number;
	limit: number;
};

export type GetProductsOptions = {
	limit?: number;
	skip?: number;
	order?: SortOrder;
	sortBy?: SortBy;
	signal?: AbortSignal;
	searchQuery?: string;
};

const getProducts = async ({
	limit = PAGE_SIZE.DEFAULT,
	skip = 0,
	signal,
	order = 'desc',
	sortBy = 'id',
	searchQuery = '',
}: GetProductsOptions): Promise<ProductsResponse> => {
	return apiClient<ProductsResponse>('/products/search', {
		signal,
		query: {
			q: searchQuery,
			limit,
			skip,
			sortBy,
			order,
		},
	});
};

const addProduct = async (body: FormValues) => {
	return apiClient<ProductType>('/products/add', { method: 'POST', body });
};
export { getProducts, addProduct };
