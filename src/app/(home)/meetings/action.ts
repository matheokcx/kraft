"use server"
import z from "zod";
import {Client, Meeting, Project} from "@/types";
import {addClient} from "@/services/clientService";
import {redirect} from "next/dist/client/components/redirect";
import {toast} from "@/utils/utils";
import {addMeeting, deleteMeeting} from "@/services/meetingService";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {getProject} from "@/services/projectService";

const meetingSchema = z.object({
    title: z.string()
        .min(1, "Le titre doit avoir au minimum une longueur de 1")
        .max(100, "Le titre doit avoir au maximum une longueur de 100"),
    description: z.string()
        .max(250, "La description doit avoir au maximum une longueur de 250")
        .optional(),
    startDate: z.date(),
    endDate: z.date(),
    projectId: z.number().nonnegative()
}).refine((data) => data.endDate > data.startDate, {
    message: "La date de fin doit être après à la date de début",
    path: ["endDate"]
});

export const createMeeting = async (inputs: FormData): Promise<void> => {
    const formDataObject = {
        ...Object.fromEntries(inputs),
        links: inputs.getAll("links")
    };
    const session = await getServerSession(authOptions);
    const isValid = meetingSchema.safeParse(formDataObject);

    if(session?.user?.id && isValid.success) {
        const project: Project | null = await getProject(isValid.data.projectId, Number(session?.user?.id));

        if(!project){
            await toast("Ce n'est pas l'un de vos projets");
        }

        const newMeeting: Meeting = await addMeeting(isValid.data);

        redirect(`/meetings/${newMeeting.id}`);
    } else if(isValid.error) {
        for (const error of isValid.error.issues) {
            await toast(error.message);
        }
    }
};

export const removeMeeting = async (meetingId: number): Promise<void> => {
    const session = await getServerSession(authOptions);

    if(session?.user?.id) {
        await deleteMeeting(meetingId, Number(session?.user?.id));
        redirect(`/meetings`);
    }
};
