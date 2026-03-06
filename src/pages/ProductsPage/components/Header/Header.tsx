import styles from './Header.module.css';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useProductStore } from '../../../../store/useProductStore';
import { useAuthStore } from '../../../../store/useAuthStore';
const Header = () => {
	const { setSearchQuery, searchQuery } = useProductStore();
	const { logout } = useAuthStore();
	const [search, setSearch] = useState(searchQuery);
	const debouncedSearch = useDebounce(search, 1000);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setSearch(event.target.value);

	useEffect(() => {
		setSearch(searchQuery);
	}, [searchQuery]);

	useEffect(() => {
		setSearchQuery(debouncedSearch);
	}, [debouncedSearch, setSearchQuery]);

	return (
		<div className={styles.header}>
			<div className={`${styles.container} container`}>
				<h3 className={styles.title}>Товары</h3>
				<label className={styles.search}>
					<span hidden>Поиск</span>
					<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
						<path
							d="M16 16L21 21"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
						/>
					</svg>
					<input placeholder="Найти" value={search} onChange={handleSearchChange} />
				</label>
				<button type="button" onClick={logout}>
					<span>выйти</span>
				</button>
			</div>
		</div>
	);
};

export { Header };
