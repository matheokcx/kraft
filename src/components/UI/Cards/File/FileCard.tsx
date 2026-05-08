'use client';
import styles from './fileCard.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { File } from '@/generated/prisma';

type FileCardProps = {
	file: File;
};

const FileCard = ({ file }: FileCardProps) => {
	const imageExtensions: string[] = ['jpeg', 'png', 'webp', 'svg'];
	const router = useRouter();
	const imageStyle = {
		width: '100%',
		height: '150px',
		borderRadius: '6px',
		border: '1px solid hsla(0, 0%, 20%, 50%)',
	};

	const handleFileClick = (): void =>
		router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/files/${file.name}.${file.type}`);

	return (
		<div className={styles.fileCard} onClick={handleFileClick}>
			{imageExtensions.includes(file.type) && (
				<Image
					src={`/files/${file.name}`}
					alt="Image of the file"
					width={100}
					height={100}
					style={imageStyle}
				/>
			)}
			{file.type === 'pdf' && (
				<iframe
					src={`/files/${file.name}.${file.type}`}
					className={styles.pdfViewer}
					title={file.name}
					width="100%"
				/>
			)}
			<p className={styles.fileName}>
				{file.name}.{file.type}
			</p>
		</div>
	);
};

export default FileCard;
