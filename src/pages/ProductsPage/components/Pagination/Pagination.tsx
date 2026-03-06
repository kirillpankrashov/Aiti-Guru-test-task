import styles from './Pagination.module.css';
import ArrowLeftSVG from '../../../../assets/ArrowLeft.svg?react';
import ArrowRightSVG from '../../../../assets/ArrowRight.svg?react';

type PaginationItem = number | 'dots-left' | 'dots-right';

const buildPagination = (
	totalPages: number,
	currentPage: number,
	leftCount = 4,
	rightCount = 3,
	siblingCount = 1,
): PaginationItem[] => {
	if (totalPages <= leftCount + rightCount + 2) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const items: PaginationItem[] = [];

	const leftEnd = Math.min(leftCount, totalPages);
	for (let p = 1; p <= leftEnd; p += 1) items.push(p);

	const rightStart = Math.max(totalPages - rightCount + 1, leftEnd + 1);

	const middleStart = Math.max(currentPage - siblingCount, leftEnd + 1);
	const middleEnd = Math.min(currentPage + siblingCount, rightStart - 1);

	if (middleStart > leftEnd + 1) {
		items.push('dots-left');
	}

	for (let p = middleStart; p <= middleEnd; p += 1) {
		items.push(p);
	}

	if (middleEnd < rightStart - 1) {
		items.push('dots-right');
	}

	for (let p = rightStart; p <= totalPages; p += 1) {
		items.push(p);
	}

	return items;
};

type PaginationProps = {
	currentPage: number;
	total: number;
	pageSize: number;
	skip: number;
	shownCount: number;
	onChange: (page: number) => void;
};

const Pagination = ({ currentPage, total, onChange, pageSize, skip, shownCount }: PaginationProps) => {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const paginationItems = buildPagination(totalPages, currentPage);
	const start = total === 0 ? 0 : skip + 1;
	const end = total === 0 ? 0 : Math.min(skip + shownCount, total);

	const onPrevPageClick = () => {
		onChange(currentPage - 1);
	};

	const onNextPageClick = () => {
		if (totalPages <= 1) return;
		const nextPage = Math.min(Math.max(currentPage, 1) + 1, totalPages);
		onChange(nextPage);
	};

	const onclickHandler = (page: number) => onChange(page);

	return (
		<div className={styles.pagination}>
			<p className={styles.text}>
				Показано{' '}
				<span>
					{start}-{end}
				</span>{' '}
				из <span>{total}</span>{' '}
			</p>
			<div className={styles.navigation}>
				<button
					type="button"
					disabled={currentPage === 1}
					className={styles.arrayButton}
					onClick={onPrevPageClick}
					aria-label="Previous page"
				>
					<ArrowLeftSVG />
				</button>
				<div className={styles.list}>
					{paginationItems.map((item, index) =>
						typeof item === 'number' ? (
							<button
								key={item}
								type="button"
								className={`${styles.button} ${currentPage === item ? styles.active : ''}`}
								onClick={() => onclickHandler(item)}
							>
								{item}
							</button>
						) : (
							<span
								key={`${item}-${index}`}
								className={styles.ellipsis}
								aria-hidden="true"
							>
								...
							</span>
						),
					)}
				</div>
				<button
					type="button"
					disabled={currentPage === totalPages}
					className={styles.arrayButton}
					onClick={onNextPageClick}
					aria-label="Next page"
				>
					<ArrowRightSVG />
				</button>
			</div>
		</div>
	);
};

export { Pagination };
