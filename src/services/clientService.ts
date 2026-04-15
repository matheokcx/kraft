import {prismaClient} from "@/lib/prisma";
import {Client, Gender} from "@/types";
import path from "path";
import {unlink, writeFile} from "fs/promises";
import {FileStorageService} from "@/services/fileStorageService";
import {ClientStatus} from "@/generated/prisma";

type ClientFilters = {
    job?: string;
    status?: ClientStatus;
    birthDate?: Date;
    gender?: Gender;
};

export const getAllUserClients = async (filters: ClientFilters, userId: number): Promise<Client[]> => {
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

type ClientInfos = {
    firstName: string;
    lastName: string;
    job: string;
    status: ClientStatus;
    links: string[];
    image: File | null;
    gender: Gender;
    birthdate?: string;
    mail?: string;
    phone?: string;
};

export const addClient = async (clientInfos: ClientInfos, userId: number): Promise<Client> => {
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
            image: (profilePicture && clientImageUpload) ? `/files/${profilePicture.name}_${today}` : null,
            gender: clientInfos.gender,
            freelanceId: userId
        }
    });
};

export const editClient = async (clientInfos: ClientInfos, clientId: number, userId: number): Promise<Client> => {
    const today: number = Date.now();
    const profilePicture: File | null = clientInfos.image;
    let imagePath: string | null | undefined;

    if(profilePicture && profilePicture.size > 0){
        const existingClient = await prismaClient.client.findUnique({ where: { id: clientId }, select: { image: true } });

        if(existingClient?.image){
            const oldFilePath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files", path.basename(existingClient.image));
            await unlink(oldFilePath);
        }

        if(profilePicture){
            await FileStorageService.uploadFile(profilePicture, today);
        }
    }

    return await prismaClient.client.update({
        data: {
            firstName: clientInfos.firstName,
            lastName: clientInfos.lastName,
            job: clientInfos.job,
            status: clientInfos.status,
            links: clientInfos.links,
            birthdate: clientInfos.birthdate ? new Date(clientInfos.birthdate) : null,
            mail: clientInfos.mail,
            phone: clientInfos.phone,
            ...(imagePath !== undefined && { image: imagePath }),
            gender: clientInfos.gender
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
