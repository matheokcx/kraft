import {prismaClient} from "@/lib/prisma";
import {Project} from "@/types";
import {ProjectDifficulty} from "@/generated/prisma";
import {FileStorageService} from "@/services/fileStorageService";

export const getAllUserProjects = async (filters: any, userId: number, onlyProcessingProjects: boolean): Promise<Project[]> => {
    return await prismaClient.project.findMany({
        where: {
            ...filters,
            client: {
                freelanceId: userId
            },
            ...(onlyProcessingProjects && {
                AND: [
                    {
                        endDate: {gte: new Date()}
                    },
                    {
                        startDate: {lte: new Date()}
                    }
                ]
            })
        }
    });
};

export const getProject = async (projectId: number, userId: number): Promise<Project | null> => {
    return await prismaClient.project.findUnique({
        where: {
            id: projectId,
            client: {
                freelanceId: userId
            }
        }
    });
};

type ProjectInformations = {
    title: string;
    description: string;
    difficulty: ProjectDifficulty;
    cost: number;
    clientId: number;
    parentProjectId: number | null;
    startDate: string;
    endDate: string;
    cover: File | null;
};

export const addProject = async (data: ProjectInformations, clientId: number): Promise<Project> => {
    const coverFile: File | null = data.cover;
    const today: number = Date.now();

    if(coverFile){
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
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            cover: coverFile ? `/files/project_cover_${today}_${coverFile.name}` : null
        }
    });
};

export const editProject = async (data: ProjectInformations, projectId: number, userId: number): Promise<Project> => {
    const coverFile: File | null = data.cover;
    const today: number = Date.now();
    let coverPath: string | null | undefined;

    if(coverFile){
        const existingProject = await prismaClient.project.findUnique({ where: { id: projectId }, select: { cover: true } });

        if(existingProject?.cover){
            await FileStorageService.removeFile(existingProject.cover);
        }

        await FileStorageService.uploadFile(coverFile, today);
    }

    return await prismaClient.project.update({
        data: {
            title: data.title,
            description: data.description,
            difficulty: data.difficulty,
            cost: data.cost,
            clientId: data.clientId,
            parentProjectId: data.parentProjectId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            ...(coverPath !== undefined && { cover: coverPath })
        },
        where: {
            id: projectId,
            client: {
                freelanceId: userId
            }
        }
    });
};

export const deleteProject = async (projectId: number, userId: number): Promise<void> => {
    const deletedProject: Project = await prismaClient.project.delete({
        where: {
            id: projectId,
            client: {
                freelanceId: userId
            }
        }
    });

    if(deletedProject.cover){
        await FileStorageService.removeFile(deletedProject.cover);
    }
};
