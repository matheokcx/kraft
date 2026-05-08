'use client';
import { User } from '@/types';
import { useEffect, useState } from 'react';
import Separator from '@/components/UI/Separator';
import styles from './profile-page.module.css';
import { Envelope, GenderFemale, GenderMale, Phone } from '@phosphor-icons/react/ssr';
import { Cake, Flag } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { $Enums } from '@/generated/prisma';
import GENDER = $Enums.GENDER;
import Link from 'next/link';
import LanguageButton from '@/components/UI/Buttons/LanguageButton';
import { signOut } from 'next-auth/react';

const ProfilePage = () => {
	const t = useTranslations();

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const func = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`);
			if (response.ok) {
				const user = await response.json();
				setUser(user);
			}
		};
		func();
	}, []);

	if (!user) {
		return null;
	}

	return (
		<main className={styles.profilePage}>
			<div className={styles.profileDiv}>
				<Link href="/">retour</Link>
				<img src={user.image ?? '/default-pp.png'} alt="Profile picture" />
				<Separator widthPercent={100} />
				<h2 style={{ justifySelf: 'center' }}>{user.name}</h2>
				<div className={styles.information}>
					<span>
						<Envelope size={24} />
						<p>{user.email}</p>
					</span>
					{user.phoneNumber && (
						<span>
							<Phone size={24} />
							<p>{user.phoneNumber}</p>
						</span>
					)}
					<span>
						<Cake size={24} />
						<p>{user.birthdate.toLocaleString().split('T')[0]}</p>
					</span>
					<span>
						{user.gender === GENDER.MALE ? (
							<GenderMale size={24} />
						) : (
							<GenderFemale size={24} />
						)}
						<p>{t(user.gender)}</p>
					</span>
					<span>
						<Flag size={24} />
						<p>{user.country}</p>
					</span>
					<i>
						{t('createdSince', { date: user.createdAt.toLocaleString().split('T')[0] })}
					</i>
				</div>

				<LanguageButton />
				<button onClick={() => signOut()} className={styles.logoutButton}>
					{t('auth.logout')}
				</button>
			</div>
		</main>
	);
};

export default ProfilePage;
