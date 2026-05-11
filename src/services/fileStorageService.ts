import path from 'path';
import { writeFile, readFile, unlink } from 'fs/promises';

export class FileStorageService {
	public static minFileSize: number = 10;
	public static maxFileSize: number = 5000000;
	public static supportedMimeTypes = {
		images: ['image/png', 'image/jpeg', 'image/webp'],
		documents: ['application/pdf', 'text/csv'],
	};

	public static async uploadFile(file: File, addingDate?: number): Promise<string | null> {
		if (
			file.size < FileStorageService.minFileSize ||
			file.name.trim().length === 0 ||
			!/^[a-zA-Z0-9][\w\-. ]{0,253}[a-zA-Z0-9]$/.test(file.name)
		) {
			throw new Error('Invalid file name');
		}

		try {
			const bytes: ArrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			const uploadDirectoryPath: string = process.env.FILES_DIRECTORY ?? 'public/files';
			const fileName: string = `${file.name.split('.')[0]}_${addingDate}.${file.name.split('.')[1]}`;
			const newFilePath: string = path.join(uploadDirectoryPath, fileName);

			await writeFile(newFilePath, buffer);
			return '/files/' + fileName;
		} catch (error: any) {
			console.error(error.message);
			return null;
		}
	}

	public static async removeFile(fileName: string): Promise<void> {
		try {
			const filePath: string = path.join(
				process.env.FILES_DIRECTORY ?? 'public/files',
				path.basename(fileName),
			);
			await unlink(filePath);
		} catch (error: any) {
			console.error(error.message);
		}
	}

	public static async downloadFile(fileName: string) {
		const uploadDirectoryPath: string = path.join(
			process.cwd(),
			process.env.FILES_DIRECTORY ?? 'public/files',
		);
		return await readFile(`${uploadDirectoryPath}/${fileName}`);
	}
}
