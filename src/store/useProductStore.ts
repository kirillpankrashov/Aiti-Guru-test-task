import { create } from 'zustand';
import { PAGE_SIZE } from '../constants/constants';
import { isBrowser } from '../utils/tokenStorage';

export type SortOrder = 'asc' | 'desc';
export type SortBy = 'id' | 'title' | 'brand' | 'sku' | 'rating' | 'price';

interface ProductState {
	currentPage: number;
	pageSize: number;
	order: SortOrder;
	sortBy: SortBy;
	searchQuery: string;
	setCurrentPage: (page: number) => void;
	setSort: (sortBy: SortBy, order: SortOrder) => void;
	setSearchQuery: (searchQuery: string) => void;
	resetFilters: () => void;
}

const allowedSortBy = ['id', 'title', 'brand', 'sku', 'rating', 'price'] as const;

const DEFAULTS = {
	currentPage: 1,
	pageSize: PAGE_SIZE.DEFAULT,
	sortBy: 'id' as SortBy,
	order: 'desc' as SortOrder,
	searchQuery: '',
};

const parsePositiveInt = (value: string | null, fallback: number): number => {
	if (!value) return fallback;
	const num = Number(value);
	return Number.isInteger(num) && num > 0 ? num : fallback;
};

const parseSortBy = (value: string | null): SortBy => {
	return allowedSortBy.includes(value as SortBy) ? (value as SortBy) : DEFAULTS.sortBy;
};

const parseOrder = (value: string | null): SortOrder => {
	return value === 'asc' ? 'asc' : 'desc';
};

const hydrateStateFromUrl = () => {
	if (!isBrowser) {
		return {
			currentPage: DEFAULTS.currentPage,
			sortBy: DEFAULTS.sortBy,
			order: DEFAULTS.order,
			searchQuery: DEFAULTS.searchQuery,
		};
	}

	const browserWindow = globalThis.window as unknown as Window;
	const params = new URLSearchParams(browserWindow.location.search);

	return {
		currentPage: parsePositiveInt(params.get('page'), DEFAULTS.currentPage),
		sortBy: parseSortBy(params.get('sortBy')),
		order: parseOrder(params.get('order')),
		searchQuery: params.get('searchQuery') ?? '',
	};
};

const syncStateToUrl = (next: {
	currentPage: number;
	sortBy: SortBy;
	order: SortOrder;
	searchQuery: string;
}) => {
	if (!isBrowser) return;

	const browserWindow = globalThis.window as unknown as Window;
	const params = new URLSearchParams(browserWindow.location.search);

	params.set('page', String(next.currentPage));
	params.set('sortBy', next.sortBy);
	params.set('order', next.order);
	params.set('searchQuery', next.searchQuery);

	browserWindow.history.replaceState(
		{},
		'',
		`${browserWindow.location.pathname}?${params.toString()}`,
	);
};

const initial = hydrateStateFromUrl();

const useProductStore = create<ProductState>((set, get) => ({
	currentPage: initial.currentPage,
	pageSize: DEFAULTS.pageSize,
	sortBy: initial.sortBy,
	order: initial.order,
	searchQuery: initial.searchQuery,

	setSearchQuery: (searchQuery) => {
		const prev = get();
		const next = { ...prev, searchQuery, currentPage: 1 };
		set({ searchQuery, currentPage: 1 });
		syncStateToUrl(next);
	},

	setCurrentPage: (currentPage) => {
		const prev = get();
		const next = { ...prev, currentPage };
		set({ currentPage });
		syncStateToUrl(next);
	},

	setSort: (sortBy, order) => {
		const prev = get();
		const next = { ...prev, sortBy, order, currentPage: 1 };
		set({ sortBy, order, currentPage: 1 });
		syncStateToUrl(next);
	},

	resetFilters: () => {
		set({
			currentPage: DEFAULTS.currentPage,
			sortBy: DEFAULTS.sortBy,
			order: DEFAULTS.order,
			searchQuery: DEFAULTS.searchQuery,
		});

		syncStateToUrl({
			currentPage: DEFAULTS.currentPage,
			sortBy: DEFAULTS.sortBy,
			order: DEFAULTS.order,
			searchQuery: DEFAULTS.searchQuery,
		});
	},
}));

export { useProductStore };
