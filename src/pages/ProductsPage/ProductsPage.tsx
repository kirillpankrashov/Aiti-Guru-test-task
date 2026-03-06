import styles from './ProductsPage.module.css';
import { Header } from './components/Header/Header';
import PlusCircleSVG from '../../assets/PlusCircle.svg?react';
import ArrowsClockwiseSVG from '../../assets/ArrowsClockwise.svg?react';
import { Table } from './components/Table/Table';
import { Loader } from '../../ui/Loader/Loader';

import { Pagination } from './components/Pagination/Pagination';
import { useProductsAll } from '../../hooks/queries/useProducts';
import { useProductStore } from '../../store/useProductStore';
import type { SortBy, SortOrder } from '../../store/useProductStore';
import type { ProductType } from '../../types/types';
import { useState } from 'react';

import { AddProducts } from './components/Modals/AddProducts/AddProducts';

const ProductsPage = () => {
	const { data, isLoading } = useProductsAll();

	const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

	const hasProducts = (data?.products?.length ?? 0) > 0;

	const { setCurrentPage, currentPage, pageSize, sortBy, order, setSort, resetFilters } =
		useProductStore();

	const products = (data?.products as ProductType[]) ?? [];

	const productsKey = products.map((p) => p.id).join('|');
	const skip = data?.skip ?? (currentPage - 1) * pageSize;
	const shownCount = products.length;
	const total = data?.total ?? 0;

	const onChangeHandler = (page: number) => setCurrentPage(page);
	const handleSortChange = (nextSortBy: SortBy, nextOrder: SortOrder) =>
		setSort(nextSortBy, nextOrder);

	const handleAddProduct = () => {
		setIsAddProductModalOpen(true);
	};

	const closeAddProductModal = () => {
		setIsAddProductModalOpen(false);
	};

	return (
		<div className={styles.page} data-component="products-page">
			<Header />
			{isAddProductModalOpen && <AddProducts onClose={closeAddProductModal} />}
			<section className={styles.section}>
				<div className={`${styles.container} container`}>
					<div className={styles.top}>
						<h3 className={styles.title}>Все позиции</h3>
						<div className={styles.nav}>
							<button type="button" className={styles.reset} onClick={resetFilters}>
								<ArrowsClockwiseSVG />
							</button>
							<button type="button" className={styles.add} onClick={handleAddProduct}>
								<PlusCircleSVG />
								<span>Добавить</span>
							</button>
						</div>
					</div>
					{isLoading && <Loader className={styles.loader} />}

					{!isLoading && hasProducts && (
						<>
							<Table
								key={productsKey}
								products={products}
								activeSortBy={sortBy}
								activeOrder={order}
								onSortChange={handleSortChange}
							/>
							<Pagination
								currentPage={currentPage}
								total={total}
								pageSize={pageSize}
								skip={skip}
								shownCount={shownCount}
								onChange={onChangeHandler}
							/>
						</>
					)}
					{!isLoading && !hasProducts && (
						<div className={styles.empty}>
							<p className={styles.emptyText}>Ничего не найдено</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export { ProductsPage };
