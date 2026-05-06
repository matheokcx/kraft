"use server"
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import z from "zod";
import {ClientNoteService} from "@/services/clientNoteService";
import {ClientService} from "@/services/clientService";
import {redirect} from "next/dist/client/components/redirect";
import {Client, ClientNote} from "@/generated/prisma";

const clientNoteSchema = z.object({
    text: z.string()
        .min(1, "Le titre doit avoir au minimum une longueur de 1")
        .max(200, "Le texte d'une note ne peut pas dépassé 200 caractères"),
    clientId: z.number().nonnegative()
});

export const addClientNote = async (formData: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const formDataObject = {...Object.fromEntries(formData)};
    const isValid = clientNoteSchema.safeParse(formDataObject);

    if(!isValid.success) {
        throw new Error(isValid.error.issues.map(i => i.message).join("\n\n"));
    }

    if(session?.user?.id){
        const client: Client | null = await ClientService.getClient(isValid.data.clientId, Number(session.user.id));

        if(!client) {
            throw new Error("Ce n'est pas votre client");
        }

        const newClientNote: ClientNote = await ClientNoteService.createClientNote(isValid.data);

        if(newClientNote){
            redirect(`/client-notes/${newClientNote.id}`);
        }
    }
};

export const updateClientNote = async (formData: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const clientNoteId: number = Number(formData.get("clientNoteId") as string);
    const formDataObject = {...Object.fromEntries(formData)};
    const isValid = clientNoteSchema.safeParse(formDataObject);

    if(!isValid.success) {
        throw new Error(isValid.error.issues.map(i => i.message).join("\n\n"));
    }

    if(session?.user?.id){
        await ClientNoteService.editClientNote(isValid.data, clientNoteId, Number(session.user.id));
        redirect(`/client-notes/${clientNoteId}`);
    }
};

export const removeClientNote = async (clientNoteId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id) {
        await ClientNoteService.deleteClientNote(clientNoteId, Number(session?.user?.id));
        redirect(`/client-notes`);
    }
};
