import { prismaClient } from '@/lib/prisma';

export class FileService {
	public static async getFiles(userId: number) {
		return await prismaClient.file.findMany({
			where: {
				project: {
					client: {
						freelanceId: userId,
					},
				},
			},
		});
	}

	public static async getFilesByProject(projectId: number, userId: number) {
		return await prismaClient.file.findMany({
			where: {
				project: {
					id: projectId,
					client: {
						freelanceId: userId,
					},
				},
			},
		});
	}
}
