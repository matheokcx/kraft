import Skeleton from '@/components/UI/Skeleton/Skeleton';
import styles from '@/app/(home)/clients/clients-page.module.css';
import Separator from '@/components/UI/Separator';
import cardStyles from '@/components/UI/Cards/Client/client-card.module.css';
import { getTranslations } from 'next-intl/server';

const Loading = async () => {
	const t = await getTranslations();

	return (
		<section className={styles.clientsPage}>
			<h1 style={{ paddingBottom: '24px' }}>{t('clients.listPage.title')}</h1>
			<div className={styles.clientsList}>
				{Array.from({ length: 12 }).map((_, index: number) => (
					<div
						key={index}
						className={cardStyles.clientCard}
						style={{ background: 'rgba(204,204,204,0.53)' }}
					>
						<div className={cardStyles.cardHeader}>
							<Skeleton width="64px" height="64px" />
							<div className={cardStyles.mainInformation}>
								<div className={cardStyles.clientInformation}>
									<Skeleton width="100%" height="50px" />
									<Skeleton width="80%" height="50px" />
								</div>
								<Skeleton width="20%" />
							</div>
						</div>
						<Separator widthPercent={100} />
						<div className={cardStyles.buttonsDiv}>
							<Skeleton width="100%" height="40px" />
							<Skeleton width="100%" height="40px" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Loading;
