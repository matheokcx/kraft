import Skeleton from '@/components/UI/Skeleton/Skeleton';
import styles from '@/app/(home)/homepage.module.css';

const Loading = () => {
	return (
		<main className={styles.homePage}>
			<section className={styles.homePageSection}>
				<div className={styles.homePageSectionRow}>
					<div style={{ width: '50%' }} className={styles.comingSoonMeetingsDiv}>
						{Array.from({ length: 3 }).map((_, index: number) => (
							<div
								key={index}
								style={{
									width: '100%',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									gap: '10px',
								}}
							>
								<Skeleton key={index} width="100%" height="30px" />
								<Skeleton key={index + '_2'} width="100%" height="150px" />
							</div>
						))}
					</div>
					<div className={styles.kpisDiv}>
						<Skeleton width="100%" height="100%" />
						<Skeleton width="100%" height="100%" />
					</div>
				</div>
				<div className={styles.homePageSectionRow}>
					<div style={{ width: '50%' }} className={styles.recentFilesDiv}>
						<Skeleton width="30%" height="30px" />
						<div className={styles.filesDiv}>
							{Array.from({ length: 4 }).map((_, index: number) => (
								<Skeleton key={index} width="50%" height="150px" />
							))}
						</div>
					</div>
					<div style={{ width: '50%' }}></div>
				</div>
			</section>
		</main>
	);
};

export default Loading;
