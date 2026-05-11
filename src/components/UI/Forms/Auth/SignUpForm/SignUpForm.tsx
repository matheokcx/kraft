'use client';
import { useTranslations } from 'next-intl';
import styles from './sign-up-form.module.css';
import Link from 'next/link';
import Input, { InputProps } from '@/components/UI/Input/Input';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import SelectField from '@/components/UI/SelectField/SelectField';
import { CakeIcon, EnvelopeIcon, GenderIntersexIcon, UserIcon } from '@phosphor-icons/react/ssr';
import { GlobeHemisphereWestIcon, LockKeyIcon } from '@phosphor-icons/react';
import { GENDER } from '@/generated/prisma';
import { useState } from 'react';

const SignUpForm = () => {
	const t = useTranslations();
	const router = useRouter();
	const inputs: InputProps[] = [
		{
			type: 'text',
			label: t('fullName'),
			name: 'fullName',
			placeholder: 'François Clavier',
			icon: <UserIcon size={24} />,
		},
		{
			type: 'email',
			label: t('mail'),
			name: 'email',
			placeholder: 'john.doe@example.com',
			icon: <EnvelopeIcon size={24} />,
		},
		{
			type: 'password',
			label: t('auth.password'),
			name: 'password',
			icon: <LockKeyIcon size={24} />,
		},
		{
			type: 'date',
			label: t('birthdate'),
			name: 'birthdate',
			icon: <CakeIcon size={24} />,
		},
	];

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (formData: FormData): Promise<void> => {
		setIsLoading(true);
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-up`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				email: formData.get('email'),
				password: formData.get('password'),
				name: formData.get('fullName'),
				birthdate: formData.get('birthdate'),
				gender: formData.get('gender'),
				country: formData.get('country'),
			}),
		});

		if (response.ok) {
			toast.success(t('auth.createdAccount'));
			router.push('/sign-in');
		} else {
			const errorMessage = await response.json();
			toast.error(`${t('auth.accountCreationError')}: ${errorMessage.error}`);
		}
		setIsLoading(false);
	};

	return (
		<form action={handleSubmit} className={styles.signUpForm}>
			<h1>{t('auth.signUp')}</h1>
			{inputs.map((input: InputProps, index: number) => (
				<Input key={index} {...input} />
			))}

			<SelectField
				name="gender"
				label={t('gender')}
				values={Object.values(GENDER)}
				icon={<GenderIntersexIcon size={24} />}
			/>
			<SelectField
				name="country"
				label={t('country')}
				values={[
					'countries.france',
					'countries.belgium',
					'countries.switzerland',
					'countries.spain',
				]}
				icon={<GlobeHemisphereWestIcon size={24} />}
			/>

			<button type="submit" className={styles.validateButton} disabled={isLoading}>
				{t('auth.signUp')}
			</button>
			<div className={styles.formBottom}>
				<p>{t('auth.alreadyHaveAccountQuestion')} </p>
				<Link href="/sign-in">
					<b>{t('auth.logIn')}</b>
				</Link>
			</div>
		</form>
	);
};

export default SignUpForm;
