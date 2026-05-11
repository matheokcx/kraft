import styles from './chip.module.css';

type ChipProps = {
	text: string;
	color?: string;
	width?: string;
};

const Chip = ({ text, color = 'hsl(140, 70%, 40%)', width = 'fit-content' }: ChipProps) => {
	return (
		<div
			className={styles.chip}
			style={
				{
					'--chip-color': color,
					width: width,
				} as React.CSSProperties
			}
		>
			<p>{text}</p>
		</div>
	);
};

export default Chip;
