import styles from '@/components/UI/Avatar/avatar.module.css';
import Image from 'next/image';

type AvatarProps = {
	firstName: string;
	lastName: string;
	image: string | null;
};

const Avatar = ({ firstName, lastName, image }: AvatarProps) => {
	return (
		<>
			{image ? (
				<Image
					src={image}
					alt="Image du client"
					width={64}
					height={64}
					className={styles.avatar}
				/>
			) : (
				<h3 className={styles.avatar}>
					{lastName.slice(0, 2)} {firstName.slice(0, 1)}.
				</h3>
			)}
		</>
	);
};

export default Avatar;
