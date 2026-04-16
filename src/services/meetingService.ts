import {prismaClient} from "@/lib/prisma";
import {Meeting} from "@/types";

type MeetingInfos = {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    projectId: number;
};

export class MeetingService {
    public static async getMeetings (filters: any, userId: number): Promise<Meeting[]> {
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
    }

    public static async getMeeting (meetingId: number, userId: number) {
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
    }

    public static async addMeeting (body: any): Promise<Meeting> {
        return await prismaClient.meeting.create({
            data: {
                title: body.title,
                projectId: body.projectId,
                startHour: new Date(body.startDate),
                endHour: new Date(body.endDate),
                description: body.description ? body.description : null
            }
        });
    }

    public static async editMeeting (data: MeetingInfos, meetingId: number, userId: number): Promise<Meeting> {
        return await prismaClient.meeting.update({
            data: {
                title: data.title,
                description: data.description ? data.description : null,
                startHour: new Date(data.startDate),
                endHour: new Date(data.endDate),
                projectId: data.projectId
            },
            where: {
                id: meetingId,
                project: {
                    client: {
                        freelanceId: userId
                    }
                }
            }
        });
    }

    public static async deleteMeeting (meetingId: number, userId: number): Promise<void> {
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
    }
}
