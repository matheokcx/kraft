import {prismaClient} from "@/lib/prisma";
import {Meeting} from "@/types";

export const getMeetings = async (filters: any, userId: number): Promise<Meeting[]> => {
    return await prismaClient.meeting.findMany({
        where: {
            project: {
                client: {
                    freelanceId: userId
                },
                ...(filters.projectId && {id: Number(filters.projectId)})
            },
            ...(filters.startHour && {
                startHour: {
                    gte: new Date(filters?.startHour ?? "")
                }
            })
        },
        orderBy: {
            startHour: "asc"
        }
    });
};

export const getMeeting = async (meetingId: number, userId: number) => {
    return await prismaClient.meeting.findUnique({
        where: {
            id: meetingId,
            project: {
                client: {
                    freelanceId: userId
                }
            }
        },
        include: {
            project: {
                include: {
                    client: true
                }
            }
        }
    });
};

type MeetingInformations = {
    title: string;
    startHour: string;
    endHour: string;
    projectId: number;
    description?: string;
};

export const addMeeting = async (body: MeetingInformations): Promise<Meeting> => {
    return await prismaClient.meeting.create({
        data: {
            ...body,
            startHour: new Date(body.startHour),
            endHour: new Date(body.endHour)
        }
    });
};
