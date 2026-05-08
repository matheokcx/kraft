import { cookies } from 'next/headers';
import ClientToasts from '@/components/UI/Toast/ClientToast';

export const Toaster = async () => {
	const cookieStore = await cookies();
	const toasts = cookieStore
		.getAll()
		.filter((cookie) => cookie.name.startsWith('toast-') && cookie.value)
		.map((cookie) => ({
			id: cookie.name,
			message: cookie.value,
			dismiss: async () => {
				'use server';
				const cookieStore = await cookies();
				cookieStore.delete(cookie.name);
			},
		}));

	return <ClientToasts toasts={toasts} />;
};
