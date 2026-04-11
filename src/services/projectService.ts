import {prismaClient} from "@/lib/prisma";
import {Project} from "@/types";
import path from "path";
import {unlink, writeFile} from "fs/promises";
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

export const addProject = async (projectInformations: any, clientId: number): Promise<Project> => {
    const coverFile: File | null = projectInformations.cover;
    const today: number = Date.now();

    if(coverFile){
        FileStorageService.uploadFile(coverFile, today)
    }

    return await prismaClient.project.create({
        data: {
            title: projectInformations.title,
            description: projectInformations.description,
            difficulty: projectInformations.difficulty,
            cost: projectInformations.cost,
            clientId: clientId,
            parentProjectId: projectInformations.parentProjectId,
            startDate: new Date(projectInformations.startDate),
            endDate: new Date(projectInformations.endDate),
            cover: coverFile ? `/files/project_cover_${today}_${coverFile.name}` : null
        }
    });
};

export const editProject = async (projectInformations: any, projectId: number, userId: number): Promise<Project> => {
    const coverFile: File | null = projectInformations.cover;
    const today: number = Date.now();
    let coverPath: string | null | undefined;

    if(coverFile && coverFile.size > 0){
        const existingProject = await prismaClient.project.findUnique({ where: { id: projectId }, select: { cover: true } });

        if(existingProject?.cover){
            const oldFilePath = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(existingProject.cover));
            await unlink(oldFilePath).catch(() => {});
        }

        const bytes = await coverFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `project_cover_${today}_${coverFile.name}`);

        await writeFile(newFilePath, buffer);
        coverPath = `/files/project_cover_${today}_${coverFile.name}`;
    }

    return await prismaClient.project.update({
        data: {
            title: projectInformations.title,
            description: projectInformations.description,
            difficulty: projectInformations.difficulty,
            cost: projectInformations.cost,
            clientId: projectInformations.clientId,
            parentProjectId: projectInformations.parentProjectId,
            startDate: new Date(projectInformations.startDate),
            endDate: new Date(projectInformations.endDate),
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
        const oldFilePath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(deletedProject.cover));
        await unlink(oldFilePath);
    }
};
