'use client';
import { signOut } from 'next-auth/react';
import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import LinkLine from '@/components/UI/Lines/LinkLine';
import { Browsers, CalendarDots, House, List, Users, X } from '@phosphor-icons/react';
import LanguageButton from '@/components/UI/Buttons/LanguageButton';
import { useTranslations } from 'next-intl';
import styles from './sidebar.module.css';
import Separator from '@/components/UI/Separator';

type linkType = {
	link: string;
	title: string;
	icon: JSX.Element;
};

const SideBar = () => {
	const t = useTranslations();
	const router = useRouter();
	const links: linkType[] = [
		{ link: '/', title: t('links.home'), icon: <House size={32} weight="bold" /> },
		{
			link: '/clients',
			title: t('clients.client', { count: 2 }),
			icon: <Users size={32} weight="bold" />,
		},
		{
			link: '/projects',
			title: t('projects.projects'),
			icon: <Browsers size={32} weight="bold" />,
		},
		{
			link: '/meetings',
			title: t('meetings.meetings'),
			icon: <CalendarDots size={32} weight="bold" />,
		},
	];

	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<>
			<button
				type="button"
				className={styles.burgerButton}
				onClick={() => setIsOpen(true)}
				aria-label={t('links.home')}
			>
				<List size={24} weight="bold" />
			</button>

			{isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}

			<header className={`${styles.homeSideBar} ${isOpen ? styles.open : ''}`}>
				<button
					type="button"
					className={styles.closeButton}
					onClick={() => setIsOpen(false)}
					aria-label="close"
				>
					<X size={20} weight="bold" />
				</button>

				<div onClick={() => router.push('/')} className={styles.logo}>
					<img src="/logo.svg" alt="Logo of the application" />
				</div>
				<Separator widthPercent={100} />

				<nav onClick={() => setIsOpen(false)}>
					{links.map((link, index: number) => (
						<LinkLine
							key={index}
							title={link.title}
							link={link.link}
							icon={link.icon}
						/>
					))}
				</nav>

				<div className={styles.buttonsSection}>
					<LanguageButton />
					<button onClick={() => router.push('/profile')}>{t('profile')}</button>
					<button onClick={() => signOut()} className={styles.logoutButton}>
						{t('auth.logout')}
					</button>
				</div>
			</header>
		</>
	);
};

export default SideBar;
