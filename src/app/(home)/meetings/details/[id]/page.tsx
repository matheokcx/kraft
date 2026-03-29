import {Meeting} from "@/types";
import {getMeeting} from "@/services/meetingService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";

const MeetingDetailModal = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user) {
        return null;
    }

    const meeting: Meeting | null = await getMeeting(Number(id), Number(session.user.id));

    if(!meeting) {
        return null;
    }

    console.log("meeting", meeting);

    return (
        <div style={{width: "100%", height: "100%"}}>
            <h1>{meeting.title}</h1>
        </div>
    );
};

export default MeetingDetailModal;
