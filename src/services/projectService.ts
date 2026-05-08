import { prismaClient } from '@/lib/prisma';
import { Project, ProjectDifficulty } from '@/generated/prisma';
import { FileStorageService } from '@/services/fileStorageService';

type ProjectInformations = {
	title: string;
	description: string;
	difficulty: ProjectDifficulty;
	cost: number;
	clientId: number;
	parentProjectId: number | null;
	startDate: Date;
	endDate: Date;
	cover: File | null;
};

export class ProjectService {
	public static async getAllUserProjects(
		filters: any,
		userId: number,
		onlyProcessingProjects: boolean,
	): Promise<Project[]> {
		return await prismaClient.project.findMany({
			where: {
				...filters,
				client: {
					freelanceId: userId,
				},
				...(onlyProcessingProjects && {
					AND: [
						{
							endDate: { gte: new Date() },
						},
						{
							startDate: { lte: new Date() },
						},
					],
				}),
			},
		});
	}

	public static async getProject(projectId: number, userId: number): Promise<Project | null> {
		return await prismaClient.project.findUnique({
			where: {
				id: projectId,
				client: {
					freelanceId: userId,
				},
			},
		});
	}

	public static async addProject(data: ProjectInformations, clientId: number): Promise<Project> {
		const coverFile: File | null = data.cover;
		const today: number = Date.now();

		if (coverFile) {
			await FileStorageService.uploadFile(coverFile, today);
		}

		return await prismaClient.project.create({
			data: {
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				cost: data.cost,
				clientId: clientId,
				parentProjectId: data.parentProjectId,
				startDate: data.startDate,
				endDate: data.endDate,
				cover: coverFile ? `/files/project_cover_${today}_${coverFile.name}` : null,
			},
		});
	}

	public static async editProject(
		data: ProjectInformations,
		projectId: number,
		userId: number,
	): Promise<Project> {
		const coverFile: File | null = data.cover;
		const today: number = Date.now();
		let coverPath: string | null | undefined;

		if (coverFile) {
			const existingProject = await prismaClient.project.findUnique({
				where: { id: projectId },
				select: { cover: true },
			});

			if (existingProject?.cover) {
				await FileStorageService.removeFile(existingProject.cover);
			}

			await FileStorageService.uploadFile(coverFile, today);
			coverPath = `/files/${coverFile.name.split('.')[0]}_${today}.${coverFile.name.split('.')[1]}`;
		}

		return await prismaClient.project.update({
			data: {
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				cost: data.cost,
				clientId: data.clientId,
				parentProjectId: data.parentProjectId,
				startDate: data.startDate,
				endDate: data.endDate,
				...(coverPath !== undefined && { cover: coverPath }),
			},
			where: {
				id: projectId,
				client: {
					freelanceId: userId,
				},
			},
		});
	}

	public static async deleteProject(projectId: number, userId: number): Promise<void> {
		const deletedProject: Project = await prismaClient.project.delete({
			where: {
				id: projectId,
				client: {
					freelanceId: userId,
				},
			},
		});

		if (deletedProject.cover) {
			await FileStorageService.removeFile(deletedProject.cover);
		}
	}
}
