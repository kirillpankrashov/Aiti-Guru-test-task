import { useState } from 'react';
import styles from './Table.module.css';
import AddSVG from '../../../../assets/Add.svg?react';
import DotsSVG from '../../../../assets/Dots.svg?react';
import type { ProductType } from '../../../../types/types';
import type { SortBy, SortOrder } from '../../../../store/useProductStore';
import { Checkbox } from '../../../../ui/Checkbox/Checkbox';

type TableProps = {
	products: ProductType[];
	activeSortBy: SortBy;
	activeOrder: SortOrder;
	onSortChange: (sortBy: SortBy, order: SortOrder) => void;
};

type TypeTableRow = {
	label: string;
	sortBy: SortBy;
	slot?: React.ReactNode;
};

const Table = ({ products, activeSortBy, activeOrder, onSortChange }: TableProps) => {
	const [selectedProducts, setSelectedProducts] = useState<Record<number, boolean>>({});

	const allSelected =
		products.length > 0 && products.every((p) => Boolean(selectedProducts[p.id]));

	const handleToggleAll = (checked: boolean) => {
		if (!products.length) return;
		setSelectedProducts((prev) => {
			const next = { ...prev };
			for (const product of products) {
				next[product.id] = checked;
			}
			return next;
		});
	};

	const rows: Array<TypeTableRow> = [
		{
			label: 'Наименование',
			sortBy: 'title',
			slot: (
				<Checkbox
					name="all"
					checked={allSelected}
					onChange={(event) => handleToggleAll(event.target.checked)}
				/>
			),
		},
		{ label: 'Вендор', sortBy: 'brand' },
		{ label: 'Артикул', sortBy: 'sku' },
		{ label: 'Оценка', sortBy: 'rating' },
		{ label: 'Цена, ₽', sortBy: 'price' },
	];

	const handleSortClick = (clickedSortBy: SortBy) => {
		let nextOrder: SortOrder = 'asc';

		if (clickedSortBy === activeSortBy) {
			nextOrder = activeOrder === 'asc' ? 'desc' : 'asc';
		}

		onSortChange(clickedSortBy, nextOrder);
	};

	return (
		<div className={styles.tabble}>
			<div className={styles.header}>
				{rows.map((row) => {
					const isActive = row.sortBy === activeSortBy;
					const orderToShow = isActive ? activeOrder : 'asc';
					return (
						<div key={row.label} className={styles.label}>
							{row.slot}
							<button
								type="button"
								className={styles.row}
								key={row.label}
								onClick={() => handleSortClick(row.sortBy)}
							>
								<span>{row.label}</span>
								<span
									className={`${styles.arrow} ${orderToShow === 'asc' ? styles.arrowUp : styles.arrowDown}`}
								>
									↓
								</span>
							</button>
						</div>
					);
				})}
			</div>
			<div className={styles.body}>
				{products.map((product) => {
					const { id, title, category, price, rating, brand, sku, thumbnail } = product;
					const isProductSelected = Boolean(selectedProducts[id]);
					const ratingClassName = rating >= 3 ? '' : styles.badRating;
					return (
						<div
							key={id}
							className={`${styles.product} ${isProductSelected ? styles.productSelected : ''}`}
						>
							<div className={styles.details}>
								{/* <h3>{id}</h3> */}
								<Checkbox
									name={id.toString()}
									checked={isProductSelected}
									onChange={(event) =>
										setSelectedProducts((prev) => ({
											...prev,
											[id]: event.target.checked,
										}))
									}
								/>
								<div className={styles.info}>
									<div className={styles.cover}>
										<img src={thumbnail} alt="cover" />
									</div>
									<div className={styles.wrap}>
										<p>{title}</p>
										<span>{category}</span>
									</div>
								</div>
							</div>
							<div className={styles.row}>
								<p>
									<strong>{brand}</strong>
								</p>
							</div>
							<div className={styles.row}>
								<p>{sku}</p>
							</div>
							<div className={styles.row}>
								<p>
									<span className={ratingClassName}>{rating}</span> / 5
								</p>
							</div>
							<div className={styles.row}>
								<p>{price} ₽</p>
							</div>
							<div className={`${styles.row} ${styles.actions}`}>
								<button type="button" className={styles.add}>
									<AddSVG />
								</button>
								<button type="button" className={styles.dots}>
									<DotsSVG />
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export { Table };
