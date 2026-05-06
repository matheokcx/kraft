import {MeetingService} from "@/services/meetingService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {Meeting} from "@/generated/prisma";

const MeetingDetailModal = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user) {
        return null;
    }

    const meeting: Meeting | null = await MeetingService.getMeeting(Number(id), Number(session.user.id));

    if(!meeting) {
        return null;
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
            <h1>{meeting.title}</h1>
        </div>
    );
};

export default MeetingDetailModal;
