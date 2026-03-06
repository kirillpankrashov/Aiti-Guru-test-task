import styles from './Checkbox.module.css';
import type { ChangeEvent } from 'react';

type CheckboxProps = {
	checked: boolean;
	label?: string;
	name: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = ({ checked, onChange, label, name }: CheckboxProps) => {
	return (
		<label className={styles.checkbox}>
			<input className={styles.checkboxInput} name={name} type='checkbox' checked={checked} onChange={onChange} />
			{label && <span className={styles.checkboxLabel}>{label}</span>}
		</label>
	);
};

export {Checkbox};
