import styles from './AddProducts.module.css';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAddProduct } from '../../../../../hooks/queries/useProducts';
import { addProductSchema } from './model/schema';
import type { FormValues, FieldsConfig } from '../../../../../types/types';

const labelList: FieldsConfig[] = [
	{ name: 'title', label: 'Название' },
	{ name: 'price', label: 'Цена' },
	{ name: 'sku', label: 'Артикул' },
	{ name: 'brand', label: 'Вендор' },
];

const AddProducts = ({ onClose }: { onClose: () => void }) => {
	const { mutate: addProductMutate } = useAddProduct();
	const [isDisable, setIsDisable] = useState(false);

	const onCloseModal = () => {
		onClose();
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(addProductSchema),
		mode: 'onSubmit',
		defaultValues: {
			title: '',
			price: '',
			sku: '',
			brand: '',
		},
	});
	const onSubmit: SubmitHandler<FormValues> = (data) => {
		setIsDisable(true);
		addProductMutate(
			{
				title: data.title,
				price: data.price,
				sku: data.sku,
				brand: data.brand,
			},
			{
				onSuccess: () => {
					toast.success('Продукт успешно добавлен');
					onCloseModal();
				},
				onError: (err) => {
					toast.error(err instanceof Error ? err.message : 'Ошибка при добавлении');
				},
			},
		);
	};

	return (
		<div className={styles.addProductModal}>
			<button type="button" className={styles.overlay} onClick={onCloseModal}></button>
			<div className={styles.content}>
				<div className={styles.inner}>
					<h2 className={styles.title}>Добавить продукт</h2>
					<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
						{labelList.map((el) => (
							<Controller
								key={el.name}
								name={el.name}
								control={control}
								render={({ field, fieldState }) => (
									<label
										className={`${styles.label} ${errors[el.name] ? styles.errorLabel : ''}`}
									>
										<span className={styles.labelText}>{el.label}</span>
										<input
											{...field}
											className={fieldState.error ? 'error' : ''}
										/>
										{fieldState.error && (
											<span className={styles.error}>
												{fieldState.error.message}
											</span>
										)}
									</label>
								)}
							/>
						))}

						<button type="submit" disabled={isDisable} className={styles.submit}>
							<span>Добавить</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export { AddProducts };
