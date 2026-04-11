"use server"
import z from "zod";
import {Client, Meeting} from "@/types";
import {addClient} from "@/services/clientService";
import {redirect} from "next/dist/client/components/redirect";
import {toast} from "@/utils/utils";
import {addMeeting} from "@/services/meetingService";

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
    const isValid = meetingSchema.safeParse(formDataObject);

    if(isValid.success) {
        const newMeeting: Meeting = await addMeeting(isValid.data);

        if(newMeeting) {
            redirect(`/meetings/${newMeeting.id}`);
        }
    }
    else {
        for(const error of isValid.error.issues){
            await toast(error.message);
        }
    }
};
