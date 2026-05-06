import {MeetingService} from "@/services/meetingService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";
import MeetingsCalendarWrapper from "@/components/Layout/Meeting/MeetingsCalendarWrapper";
import styles from "./meetings-page.module.css";
import {Meeting} from "@/generated/prisma";

const MeetingsCalendarPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const meetings: Meeting[] = await MeetingService.getMeetings({}, Number(session.user.id));

    return (
        <section className={styles.meetingsCalendarSection}>
            <MeetingsCalendarWrapper meetings={meetings} />
        </section>
    );
};

export default MeetingsCalendarPage;