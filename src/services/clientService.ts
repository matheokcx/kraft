import {prismaClient} from "@/lib/prisma";
import {Client} from "@/types";
import path from "path";
import {unlink, writeFile} from "fs/promises";
import {FileStorageService} from "@/services/fileStorageService";

export const getAllUserClients = async (filters: any, userId: number): Promise<Client[]> => {
    return await prismaClient.client.findMany({
        where: {
            ...filters,
            freelanceId: userId
        },
        orderBy: [
            {
                firstName: 'asc'
            }
        ],
    });
};

export const getClient = async (clientId: number, userId: number): Promise<Client | null> => {
    return await prismaClient.client.findUnique({
        where: {
            id: clientId,
            freelanceId: userId
        }
    });
};

export const addClient = async (clientInfos: any, userId: number): Promise<Client> => {
    const today: number = Date.now();
    const profilePicture: File | null = clientInfos.image;
    const clientImageUpload: boolean = profilePicture !== null && profilePicture.size > 0;

    if(profilePicture){
        await FileStorageService.uploadFile(profilePicture, today);
    }

    return await prismaClient.client.create({
        data: {
            firstName: clientInfos.firstName,
            lastName: clientInfos.lastName,
            job: clientInfos.job,
            status: clientInfos.status,
            links: clientInfos.links ?? [],
            birthdate: clientInfos.birthdate ? new Date(clientInfos.birthdate) : null,
            mail: clientInfos.mail ?? null,
            phone: clientInfos.phone ?? null,
            image: (profilePicture && clientImageUpload) ? `/files/client_image_${today}_${profilePicture.name}` : null,
            gender: clientInfos.gender,
            freelanceId: userId
        }
    });
};

export const editClient = async (clientInfos: any, clientId: number, userId: number): Promise<Client> => {
    const today: number = Date.now();
    const profilePicture: File | undefined = clientInfos.image;
    let imagePath: string | null | undefined;

    if(profilePicture && profilePicture.size > 0){
        const existingClient = await prismaClient.client.findUnique({ where: { id: clientId }, select: { image: true } });

        if(existingClient?.image){
            const oldFilePath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(existingClient.image));
            await unlink(oldFilePath);
        }

        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        const newFilePath: string = path.join(uploadDirectoryPath, `client_image_${today}_${profilePicture.name}`);

        await writeFile(newFilePath, buffer);
        imagePath = `/files/project_cover_${today}_${profilePicture.name}`;
    }

    return await prismaClient.client.update({
        data: {
            firstName: clientInfos.firstName,
            lastName: clientInfos.lastName,
            job: clientInfos.job,
            status: clientInfos.status,
            links: [],
            birthdate: clientInfos.birthdate ? new Date(clientInfos.birthdate) : null,
            mail: clientInfos.mail,
            phone: clientInfos.phone,
            ...(imagePath !== undefined && { image: imagePath }),
            gender: clientInfos.gender,
            freelanceId: userId
        },
        where: {
            id: clientId,
            freelanceId: userId
        }
    });
};

export const deleteClient = async (clientId: number, userId: number): Promise<void> => {
    const deletedClient: Client = await prismaClient.client.delete({
        where: {
            id: clientId,
            freelanceId: userId
        }
    });

    if(deletedClient.image){
        const oldFilePath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(deletedClient.image));
        await unlink(oldFilePath);
    }
};
