"use server"
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import z from "zod";
import {createClientNote, deleteClientNote} from "@/services/clientNoteService";
import {getClient} from "@/services/clientService";
import {toast} from "@/utils/utils";
import {Client, ClientNote} from "@/types";
import {redirect} from "next/dist/client/components/redirect";
import {deleteMeeting} from "@/services/meetingService";

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

    if(session?.user?.id && isValid.success){
        const client: Client | null = await getClient(isValid.data.clientId, Number(session.user.id));

        if(!client) {
            await toast("Ce n'est pas votre client");
        }

        const newClientNote: ClientNote = await createClientNote(isValid.data);
        redirect(`/client-notes/${newClientNote.id}`);
    } else if (isValid.error){
        for(const error of isValid.error.issues){
            await toast(error.message);
        }
    }
};

export const removeClientNote = async (clientNoteId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id) {
        await deleteClientNote(clientNoteId, Number(session?.user?.id));
        redirect(`/client-notes`);
    }
};
