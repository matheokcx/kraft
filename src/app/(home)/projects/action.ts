"use server"
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {Client, Project} from "@/types";
import {ProjectService} from "@/services/projectService";
import {redirect} from "next/dist/client/components/redirect";
import {z} from "zod";
import {ProjectDifficulty} from "@/generated/prisma";
import {toast} from "@/utils/utils";
import {FileStorageService} from "@/services/fileStorageService";
import {ClientService} from "@/services/clientService";

const projectSchema = z.object({
    title: z.string()
        .min(3, "La longueur minimale du titre est de 3")
        .max(150, "La longueur maximale du titre est de 150"),
    description: z.string()
        .min(3, "La longueur minimale de la description est de 3")
        .max(250, "La longueur maximale de la description est de 250"),
    difficulty: z.enum(Object.values(ProjectDifficulty), "La difficulté doit être parmi les choix"),
    cost: z.coerce.number().nonnegative("Le gain du projet ne peut pas être négatif"),
    clientId: z.coerce.number().nonnegative("L'id du client ne peut pas être négatif"),
    parentProjectId: z.coerce.number().refine((value: number) => value === 0).transform(() => null).nullable(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
    cover: z.union([
        z.file()
            .mime(FileStorageService.supportedMimeTypes.images)
            .max(FileStorageService.maxFileSize),
        z.file().refine((file) => file.size === 0).transform(() => null)
    ])
});

export const createProject = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const clientId: number = Number(data.get("clientId"));
    const formDataObject = Object.fromEntries(data);
    const isValid = projectSchema.safeParse(formDataObject);

    if(session?.user?.id && isValid.success) {
        const client: Client | null = await ClientService.getClient(isValid.data.clientId, Number(session.user.id));

        if(!client){
            await toast("Ce n'est pas votre client");
            return;
        }

        const newProject: Project = await ProjectService.addProject(isValid.data, clientId);
        redirect(`/projects/${newProject.id}`);
    }
    else if(isValid.error){
        for(const error of isValid.error.issues){
            await toast(error.message);
        }
    }
};

export const updateProject = async (data: FormData): Promise<void> => {
    const session = await getServerSession(authOptions);
    const projectId: number = Number(data.get("projectId") as string);
    const formDataObject = Object.fromEntries(data);
    const isValid = projectSchema.safeParse(formDataObject);

    if(session?.user?.id){
        if(isValid.success){
            await ProjectService.editProject(isValid.data, projectId, Number(session.user.id));
            redirect(`/projects/${projectId}`);
        }
        else {
            for(const error of isValid.error.issues){
                await toast(error.message);
            }
        }
    }
};

export const removeProject = async (projectId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id){
        await ProjectService.deleteProject(projectId, Number(session.user.id));
        redirect("/projects");
    }
};
