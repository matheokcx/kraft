import {prismaClient} from "@/lib/prisma";
import {FileStorageService} from "@/services/fileStorageService";
import {Client, ClientStatus} from "@/generated/prisma";
import {Gender} from "@/types";

type ClientFilters = {
    job?: string;
    status?: ClientStatus;
    birthDate?: Date;
    gender?: Gender;
};

type ClientInfos = {
    firstName: string;
    lastName: string;
    job: string;
    status: ClientStatus;
    links: string[];
    image: File | null;
    gender: Gender;
    birthdate: string | null;
    mail: string | null;
    phone: string | null;
};

export class ClientService {
    public static async getAllUserClients (filters: ClientFilters, userId: number): Promise<Client[]> {
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
    }

    public static async getClient (clientId: number, userId: number): Promise<Client | null> {
        return await prismaClient.client.findUnique({
            where: {
                id: clientId,
                freelanceId: userId
            }
        });
    }

    public static async addClient (clientInfos: ClientInfos, userId: number): Promise<Client> {
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
    }

    public static async editClient (clientInfos: ClientInfos, clientId: number, userId: number): Promise<Client> {
        const today: number = Date.now();
        const profilePicture: File | null = clientInfos.image;
        let imagePath: string | null | undefined;

        if(profilePicture){
            const existingClient = await prismaClient.client.findUnique({ where: { id: clientId }, select: { image: true } });

            if(existingClient?.image){
                await FileStorageService.removeFile(existingClient.image);
            }

            await FileStorageService.uploadFile(profilePicture, today);
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
    }

    public static async deleteClient (clientId: number, userId: number): Promise<void> {
        const deletedClient: Client = await prismaClient.client.delete({
            where: {
                id: clientId,
                freelanceId: userId
            }
        });

        if(deletedClient.image){
            await FileStorageService.removeFile(deletedClient.image);
        }
    }
}
