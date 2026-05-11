import styles from './skeleton.module.css';

type SkeletonProps = {
	width?: string;
	height?: string;
};

const Skeleton = ({ width = '100px', height = '100px' }: SkeletonProps) => {
	return <div className={styles.skeleton} style={{ width: width, height: height }}></div>;
};

export default Skeleton;
