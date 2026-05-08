'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { GENDER } from '@/generated/prisma';
import styles from './sign-up-page.module.css';
import { Gender } from '@/types';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

type formInformations = {
	name: string;
	email: string;
	password: string;
	birthdate: string;
	gender: Gender;
	country: string;
};

type inputType = {
	type: string;
	value: any;
	onChange: (event: any) => void;
	placeholder: string;
};

const SignUpPage = () => {
	const t = useTranslations();
	const [informations, setInformations] = useState<formInformations>({
		name: '',
		email: '',
		password: '',
		birthdate: new Date().toISOString().split('T')[0],
		gender: GENDER.MALE,
		country: 'FRANCE',
	});
	const inputInputs: inputType[] = [
		{
			type: 'text',
			value: informations.name,
			onChange: (event: any) => {
				setInformations({ ...informations, name: event.target.value });
			},
			placeholder: 'François Clavier',
		},
		{
			type: 'email',
			value: informations.email,
			onChange: (event: any) => {
				setInformations({ ...informations, email: event.target.value });
			},
			placeholder: 'john.doe@example.com',
		},
		{
			type: 'password',
			value: informations.password,
			onChange: (event: any) => {
				setInformations({ ...informations, password: event.target.value });
			},
			placeholder: t('auth.password'),
		},
		{
			type: 'date',
			value: informations.birthdate,
			onChange: (event: any) => {
				setInformations({ ...informations, birthdate: event.target.value });
			},
			placeholder: t('birthdate'),
		},
	];
	const router = useRouter();
	const countries: string[] = ['FRANCE', 'BELGIQUE', 'SUISSE', 'ESPAGNE'];

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleClick = async (): Promise<void> => {
		setIsLoading(true);
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-up`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ ...informations }),
		});

		if (response.ok) {
			toast.success(t('auth.createdAccount'));
			router.push('/sign-in');
		} else {
			setIsLoading(false);
			const errorMessage = await response.json();
			toast.error(`${t('auth.accountCreationError')}: ${errorMessage.error}`);
		}
		setIsLoading(false);
	};

	return (
		<main className={styles.signUpPage}>
			<div className={styles.signUpForm}>
				<h1>{t('auth.signUp')}</h1>

				{inputInputs.map((input, index) => (
					<input
						type={input.type}
						value={input.value}
						onChange={input.onChange}
						placeholder={input.placeholder}
						key={index}
						required
					/>
				))}

				<select
					value={informations.gender}
					onChange={(event) =>
						setInformations({ ...informations, gender: event.target.value as Gender })
					}
					required
				>
					{Object.values(GENDER).map((gender) => (
						<option key={gender} value={gender}>
							{t(gender)}
						</option>
					))}
				</select>

				<select
					value={informations.country}
					onChange={(event) =>
						setInformations({ ...informations, country: event.target.value })
					}
					required
				>
					{countries.map((country) => (
						<option key={country} value={country}>
							{country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()}
						</option>
					))}
				</select>

				<button
					onClick={async () => await handleClick()}
					className={styles.validateButton}
					disabled={isLoading}
				>
					{t('auth.signUp')}
					{isLoading && '...'}
				</button>
				<p>
					{t('auth.alreadyHaveAccountQuestion')}{' '}
					<Link href="/sign-in">
						<b>{t('auth.logIn')}</b>
					</Link>
				</p>
			</div>
		</main>
	);
};

export default SignUpPage;
