import styles from './kpiCard.module.css';

type KpiCardProps = {
	name: string;
	value: number | string;
};

const KpiCard = ({ name, value }: KpiCardProps) => {
	return (
		<div className={styles.kpiCard}>
			<h1>{value}</h1>
			<label>{name}</label>
		</div>
	);
};

export default KpiCard;
