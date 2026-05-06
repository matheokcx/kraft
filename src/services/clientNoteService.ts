import { prismaClient } from "@/lib/prisma";
import {ClientNote} from "@/generated/prisma";

type ClientNoteInfos = {
    text: string;
    clientId: number;
};

export class ClientNoteService {
    public static async getClientNotes (clientId: number, userId: number): Promise<ClientNote[]> {
        return await prismaClient.clientNote.findMany({
            where: {
                client: {
                    id: clientId,
                    freelanceId: userId
                }
            }
        });
    }

    public static async getClientNote (clientNoteId: number, userId: number): Promise<ClientNote | null> {
        return await prismaClient.clientNote.findUnique({
            where: {
                id: clientNoteId,
                client: {
                    freelanceId: userId
                }
            }
        });
    }

    public static async createClientNote (data: ClientNoteInfos): Promise<ClientNote> {
        return await prismaClient.clientNote.create({
            data: {
                text: data.text,
                createdAt: new Date(),
                clientId: data.clientId
            }
        });
    }

    public static async editClientNote (data: ClientNoteInfos, clientNoteId: number, userId: number): Promise<ClientNote> {
        return await prismaClient.clientNote.update({
            data: {
                text: data.text,
                clientId: data.clientId
            },
            where: {
                id: clientNoteId,
                client: {
                    freelanceId: userId
                }
            }
        });
    }

    public static async deleteClientNote (clientNoteId: number, userId: number): Promise<void> {
        await prismaClient.clientNote.delete({
            where: {
                id: clientNoteId,
                client: {
                    freelanceId: userId
                }
            }
        });
    }
}
