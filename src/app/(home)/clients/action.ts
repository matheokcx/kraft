"use server"
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {ClientStatus, GENDER} from "@/generated/prisma";
import {ClientService} from "@/services/clientService";
import {redirect} from "next/dist/client/components/redirect";
import z from "zod";
import {toast} from "@/utils/utils";
import {Client} from "@/types";
import {FileStorageService} from "@/services/fileStorageService";

const clientSchema = z.object({
    firstName: z.string()
        .min(2, "Le prénom doit avoir au minimum une longueur de 2")
        .max(100, "Le prénom doit avoir au maximum une longueur de 100"),
    lastName: z.string()
        .min(2, "Le nom doit avoir au minimum une longueur de 2")
        .max(100, "Le nom doit avoir au maximum une longueur de 100"),
    job: z.string()
        .max(100, "Le poste doit avoir au maximum une longueur de 100"),
    status: z.enum(Object.values(ClientStatus)),
    birthdate: z.union([
        z.literal('').transform(() => null),
        z.iso.date(),
    ]).nullable(),
    mail: z.union([
        z.literal('').transform(() => null),
        z.string().email(),
    ]).nullable(),
    phone: z.union([
        z.literal('').transform(() => null),
        z.string(),
    ]).nullable(),
    image: z.union([
        z.file()
            .mime(FileStorageService.supportedMimeTypes.images)
            .max(FileStorageService.maxFileSize),
        z.file().refine((file) => file.size === 0).transform(() => null),
    ]),
    links: z.array(z.string().url().or(z.literal("")))
        .transform(arr => arr.filter(s => s !== "")),
    gender: z.enum(Object.values(GENDER))
});

export const createClient = async (inputs: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id) {
        const formDataObject = {
            ...Object.fromEntries(inputs),
            links: inputs.getAll("links")
        };
        const isValid = clientSchema.safeParse(formDataObject);

        if(isValid.success) {
            const newClient: Client = await ClientService.addClient(isValid.data, Number(session.user.id));

            if(newClient) {
                redirect(`/clients/${newClient.id}`);
            }
        }
        else {
            for(const error of isValid.error.issues){
                await toast(error.message);
            }
        }
    }
};

export const updateClient = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const clientId: number = Number(data.get("clientId") as string);

    const formDataObject = {
        ...Object.fromEntries(data),
        links: data.getAll("links")
    };
    const isValid = clientSchema.safeParse(formDataObject);

    if(session?.user?.id){
        if(isValid.success){
            await ClientService.editClient(isValid.data, clientId, Number(session.user.id));
            redirect(`/clients/${clientId}`);
        }
        else {
            for(const error of isValid.error.issues){
                await toast(error.message);
            }
        }
    }
};

export const removeClient = async (clientId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        await ClientService.deleteClient(clientId, Number(session.user.id));
        redirect("/clients");
    }
};
