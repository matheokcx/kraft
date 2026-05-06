import styles from "./meeting-card.module.css";
import {ArrowRight, Clock} from "@phosphor-icons/react/ssr";
import {Meeting} from "@/generated/prisma";

type MeetingCardProps = {
    meeting: Meeting;
};

const MeetingCard = ({meeting}: MeetingCardProps) => {
    const getRandomMeetingColor = (): string => {
        const colors: string[] = [
            "#FFE5E5",
            "#E5F0FF",
            "#E5FFE5",
            "#FFF5E5",
            "#F0E5FF",
            "#FFFFE5",
            "#E5FFFF",
            "#FFE5F5"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className={styles.meetingCard} style={{ background: getRandomMeetingColor() }}>
            <h3>{meeting.title}</h3>
            <p className={styles.meetingDescription}>{meeting.description}</p>
            <div className={styles.meetingDurationLine}>
                <Clock size={24} />
                <p>{meeting.startHour.getHours()}:{meeting.startHour.getMinutes()}</p>
                <ArrowRight size={24} />
                <p>{meeting.endHour.getHours()}:{meeting.endHour.getMinutes()}</p>
            </div>
        </div>
    );
};

export default MeetingCard;
