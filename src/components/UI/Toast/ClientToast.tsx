'use client';
import { startTransition, useEffect, useOptimistic, useRef } from 'react';
import styles from './toaster.module.css';
import { XCircleIcon } from '@phosphor-icons/react';

type Toast = {
	id: string;
	message: string;
	dismiss: () => Promise<void>;
};

const ClientToasts = ({ toasts }: { toasts: Toast[] }) => {
	const [optimisticToasts, remove] = useOptimistic(toasts, (current, id) =>
		current.filter((toast) => toast.id !== id),
	);

	const localToasts = optimisticToasts.map((toast) => ({
		...toast,
		dismiss: async () => {
			remove(toast.id);
			await toast.dismiss();
		},
	}));

	const dismissedRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		localToasts.forEach((toast) => {
			if (dismissedRef.current.has(toast.id)) return;
			dismissedRef.current.add(toast.id);
			const timeout = setTimeout(() => startTransition(() => toast.dismiss()), 3000);
			return () => clearTimeout(timeout);
		});
	}, [localToasts]);

	return (
		<div className={styles.toastsList}>
			{localToasts.map((toast) => (
				<div key={toast.id} className={styles.toast}>
					<p>{toast.message}</p>
					<form action={toast.dismiss}>
						<button className={styles.closeButton} type="submit">
							<XCircleIcon size={24} />
						</button>
					</form>
				</div>
			))}
		</div>
	);
};

export default ClientToasts;
