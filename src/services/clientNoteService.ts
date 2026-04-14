import { prismaClient } from "@/lib/prisma";
import {ClientNote} from "@/types";

export const getClientNotes = async (clientId: number, userId: number): Promise<ClientNote[]> => {
    return await prismaClient.clientNote.findMany({
        where: {
            client: {
                id: clientId,
                freelanceId: userId
            }
        }
    });
};

export const getClientNote = async (clientNoteId: number, userId: number): Promise<ClientNote | null> => {
    return await prismaClient.clientNote.findUnique({
        where: {
            id: clientNoteId,
            client: {
                freelanceId: userId
            }
        }
    });
};

type ClientNoteInfos = {
    text: string;
    clientId: number;
};

export const createClientNote = async (data: ClientNoteInfos): Promise<ClientNote> => {
    return await prismaClient.clientNote.create({
        data: {
            text: data.text,
            createdAt: new Date(),
            clientId: data.clientId
        }
    });
};

export const editClientNote = async (data: ClientNoteInfos, clientNoteId: number, userId: number): Promise<ClientNote> => {
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
};

export const deleteClientNote = async (clientNoteId: number, userId: number): Promise<void> => {
    await prismaClient.clientNote.delete({
        where: {
            id: clientNoteId,
            client: {
                freelanceId: userId
            }
        }
    });
};
