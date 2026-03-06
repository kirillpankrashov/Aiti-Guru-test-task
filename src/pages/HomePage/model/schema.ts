import { z } from 'zod';

const authSchema = z.object({
	login: z.string().trim().min(1, 'Введите логин'),
	password: z.string().trim().min(1, 'Введите пароль'),
	agree: z.boolean(),
});

export { authSchema };