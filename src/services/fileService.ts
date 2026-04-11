import { prismaClient } from "@/lib/prisma";

export const getFiles = async (userId: number) => {
    return await prismaClient.file.findMany({
        where: {
            project: {
                client: {
                    freelanceId: userId
                }
            }
        }
    });
};

export const getFilesByProject = async (projectId: number, userId: number) => {
    return await prismaClient.file.findMany({
        where: {
            project: {
                id: projectId,
                client: {
                    freelanceId: userId
                }
            }
        }
    });
};
