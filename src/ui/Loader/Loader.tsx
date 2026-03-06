import styles from './Loader.module.css';
import cn from 'classnames';

const Loader = ({ className = '' }: { className?: string }) => {
	return (
		<div className={cn(styles.loader, className)} aria-label="Загрузка">
			<div className={styles.spinner} />
		</div>
	);
};

export { Loader };
