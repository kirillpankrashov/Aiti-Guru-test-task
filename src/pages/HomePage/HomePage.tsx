import styles from './HomePage.module.css';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import UserSVG from '../../assets/User.svg?react';
import Close from '../../assets/Close.svg?react';
import LockSVG from '../../assets/Lock.svg?react';
import EyeOff from '../../assets/EyeOff.svg?react';
import Eye from '../../assets/Eye.svg?react';
import { useAuth } from '../../hooks/queries/useAuth';
import type { AuthFormValues } from '../../types/types';
import { authSchema } from './model/schema';
import { useAuthStore } from '../../store/useAuthStore';
import Logo from '../../assets/Logo.png';

const DEMO_CREDENTIALS = [{ username: 'emilys', password: 'emilyspass' }];

const HomePage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { mutate: authMutate } = useAuth();
	const login = useAuthStore((state) => state.login);

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AuthFormValues>({
		resolver: zodResolver(authSchema),
		mode: 'onSubmit',
		defaultValues: {
			login: '',
			password: '',
			agree: false,
		},
	});

	const onSubmit: SubmitHandler<AuthFormValues> = async (data) => {
		authMutate(data, {
			onSuccess: (response) => {
				login(
					{
						accessToken: response.accessToken,
						refreshToken: response.refreshToken,
					},
					data.agree,
				);

					toast.success('Авторизация успешна');
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	return (
		<section className={styles.page}>
			<div className={styles.container}>
				<div className={styles.content}>
					<img className={styles.logo} src={Logo} alt="logo" />
					<h3 className={styles.title}>Добро пожаловать!</h3>
					<p className={styles.description}>Пожалуйста, авторизируйтесь</p>

					<div className={styles.demoList}>
						{DEMO_CREDENTIALS.map(({ username, password }) => (
							<button
								key={username}
								type="button"
								className={styles.demoButton}
								onClick={() => {
									setValue('login', username, { shouldValidate: true });
									setValue('password', password, { shouldValidate: true });
								}}
								disabled={isSubmitting}
							>
								Логин: {username} / Пароль: {password}
							</button>
						))}
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
						<div className={styles.formGroup}>
							<Controller
								name="login"
								control={control}
								render={({ field, fieldState }) => (
									<label
										className={`${styles.label} ${errors.login ? styles.errorLabel : ''}`}
									>
										<UserSVG className={styles.userIcon} />
										<span className={styles.labelText}>Логин</span>

										<input {...field} type="text" placeholder="Логин" />
										<button
											type="button"
											className={styles.resetEmail}
											onClick={() => field.onChange('')}
										>
											<Close />
										</button>

										{fieldState.error && (
											<span className={styles.error}>
												{fieldState.error.message}
											</span>
										)}
									</label>
								)}
							/>
		
							<Controller
								name="password"
								control={control}
								render={({ field, fieldState }) => {
									return (
										<label
											className={`${styles.label} ${errors.password ? styles.errorLabel : ''}`}
										>
											<LockSVG className={styles.userIcon} />
											<span className={styles.labelText}>Пароль</span>
											<input
												{...field}
												type={showPassword ? 'text' : 'password'}
												placeholder="Пароль"
											/>
											<button
												type="button"
												className={styles.resetEmail}
												onClick={() => setShowPassword((prev) => !prev)}
												aria-label={
													showPassword
														? 'Скрыть пароль'
														: 'Показать пароль'
												}
											>
												{showPassword ? <Eye /> : <EyeOff />}
											</button>
											{fieldState.error && (
												<span className={styles.error}>
													{fieldState.error.message}
												</span>
											)}
										</label>
									);
								}}
							/>
							
						</div>

						<Controller
							name="agree"
							control={control}
							render={({ field }) => {
								return (
									<Checkbox
										name="agree"
										label="Запомнить данные"
										checked={field.value}
										onChange={(event) => field.onChange(event.target.checked)}
									/>
								);
							}}
						/>

						<button className={styles.submit} type="submit">
							<span>Войти</span>
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export { HomePage };
