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

export const addMeeting = async (body: any): Promise<Meeting> => {
    return await prismaClient.meeting.create({
        data: {
            title: body.title,
            projectId: body.projectId,
            startHour: new Date(body.startDate),
            endHour: new Date(body.endDate),
            description: body.description ? body.description : null
        }
    });
};

export const deleteMeeting = async (meetingId: number, userId: number): Promise<void> => {
    await prismaClient.meeting.delete({
        where: {
            id: meetingId,
            project: {
                client: {
                    freelanceId: userId
                }
            }
        }
    });
};
