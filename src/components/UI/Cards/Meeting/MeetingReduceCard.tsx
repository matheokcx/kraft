import styles from "./meetingReduceCard.module.css"
import {useTranslations} from "next-intl";
import {Meeting} from "@/types";

type MeetingReduceCardProps = {
    meeting: Meeting;
};

const MeetingReduceCard = ({meeting}: MeetingReduceCardProps) => {
    const t = useTranslations();

    return (
        <div className={styles.meetingReduceCard}>
            {
                meeting ? (
                    <div className={styles.meetingBlock}>
                        <p>{meeting.title}</p>
                    </div>
                ) : (
                    <div className={styles.noMeetingBlock}>
                        <p>{t("nothingSchedule")}</p>
                    </div>
                )
            }
        </div>
    );
};

export default MeetingReduceCard;
