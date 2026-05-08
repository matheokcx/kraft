'use client';
import Input, { InputProps } from '@/components/UI/Input/Input';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import styles from './sign-in-form.module.css';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon } from '@phosphor-icons/react/ssr';
import { LockKeyIcon } from '@phosphor-icons/react';

const SignInForm = () => {
	const t = useTranslations();
	const router = useRouter();
	const inputs: InputProps[] = [
		{
			type: 'email',
			name: 'email',
			label: t('mail'),
			placeholder: 'john.doe@example.com',
			autoComplete: 'email',
			icon: <EnvelopeIcon size={24} />,
		},
		{
			type: 'password',
			name: 'password',
			label: t('auth.password'),
			autoComplete: 'password',
			icon: <LockKeyIcon size={24} />,
		},
	];

	const handleSubmit = async (formData: FormData) => {
		const response = await signIn('credentials', {
			email: formData.get('email'),
			password: formData.get('password'),
			redirect: false,
		});

		if (response?.ok) {
			toast.success(t('auth.successfulLogin'));
			router.push('/');
		} else {
			toast.error(t('auth.failedLogin'));
		}
	};

	return (
		<form action={handleSubmit} className={styles.signInForm}>
			<h1>{t('auth.logIn')}</h1>
			{inputs.map((input: InputProps, index: number) => (
				<Input
					key={index}
					type={input.type}
					name={input.name}
					label={input.label}
					autoComplete={input.autoComplete}
					placeholder={input?.placeholder}
					icon={input.icon}
				/>
			))}

			<button type="submit">{t('auth.connect')}</button>
			<p>
				{t('auth.dontHaveAccountQuestion')}{' '}
				<Link href="/sign-up">
					<b>{t('auth.signUp')}</b>
				</Link>
			</p>
		</form>
	);
};

export default SignInForm;
