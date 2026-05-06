import styles from "./coming-meetings-widget.module.css";
import {getWeekDay} from "@/utils/utils";
import MeetingReduceCard from "@/components/UI/Cards/Meeting/MeetingReduceCard";
import {useTranslations} from "next-intl";
import {Meeting} from "@/generated/prisma";

type ComingMeetingsWidgetProps = {
    comingMeetings: Map<string, Meeting[]>;
};

const ComingMeetingsWidget = ({ comingMeetings }: ComingMeetingsWidgetProps) => {
    const t = useTranslations();

    return (
        <div className={styles.comingSoonMeetingsWidget}>
            <h3><u>{t("meetings.shortcutSectionTitle")}:</u></h3>
            <div className={styles.comingSoonMeetingsDiv}>
                {Array.from(comingMeetings.entries()).map(([dateStr, meetings]) => {
                    const date = new Date(dateStr);
                    const isToday: boolean = date.getDay() === (new Date()).getDay();
                    const style = {
                        color: isToday ? "var(--main-text" : "var(--secondary-text)",
                        fontWeight: isToday ? 700 : 400,
                    };

                    return(
                        <div key={dateStr} style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "center" }}>
                            <label style={style}>{t(`daysOfWeek.${getWeekDay(date.getDay())}`)}</label>
                            {
                                meetings.length > 0 ? meetings.map((meeting: Meeting, index: number) => {
                                    const todayDate: Date = new Date();
                                    todayDate.setDate(todayDate.getDate() + index);

                                    return <MeetingReduceCard key={index} meeting={meeting}/>
                                }) : (
                                    <div className={styles.noMeetingBlock}>
                                        <p>{t("nothingSchedule")}</p>
                                    </div>
                                )
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default ComingMeetingsWidget;
