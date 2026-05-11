import { JSX } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './link-line.module.css';

type LinkLineProps = {
	icon: JSX.Element;
	title: string;
	link: string;
};

const LinkLine = ({ icon, title, link }: LinkLineProps) => {
	const router = useRouter();
	const pathname: string = usePathname();
	const currentRoute: boolean = pathname === link;
	return (
		<div onClick={(e) => router.push(link)} className={styles.linkLine}>
			{icon}
			<p
				style={{
					color: currentRoute ? 'var(--main-text)' : 'var(--secondary-text)',
					fontWeight: currentRoute ? 700 : 400,
				}}
			>
				{title}
			</p>
		</div>
	);
};

export default LinkLine;
