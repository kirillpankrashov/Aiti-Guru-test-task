import { useQuery, keepPreviousData, useMutation } from '@tanstack/react-query';
import { getProducts, addProduct } from '../../api/products';
import { useProductStore } from '../../store/useProductStore';
import type { FormValues } from '../../types/types';

const useProductsAll = () => {
	const { currentPage, pageSize, order, sortBy, searchQuery } = useProductStore();

	return useQuery({
		queryKey: ['products', currentPage, pageSize, sortBy, order, searchQuery],

		queryFn: async () => {
			return getProducts({
				order,
				sortBy,
				searchQuery,
				limit: pageSize,
				skip: (currentPage - 1) * pageSize,
			});
		},
		placeholderData: keepPreviousData,
	});
};

const useAddProduct = () => {
	return useMutation({
		mutationFn: (body: FormValues) => addProduct(body),
	});
};

export { useProductsAll, useAddProduct };
