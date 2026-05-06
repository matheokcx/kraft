import {MeetingService} from "@/services/meetingService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {Meeting} from "@/generated/prisma";
import styles from "@/app/(home)/meetings/[id]/meeting-details.module.css";
import Separator from "@/components/UI/Separator";
import {ArrowRight, CalendarDot, Clock, Folder, Notepad, User} from "@phosphor-icons/react/ssr";
import BackButton from "@/components/UI/Buttons/BackButton/BackButton";
import Modal from "@/components/UI/Modal/Modal";
import {getTranslations} from "next-intl/server";

const MeetingDetailModal = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const session = await getServerSession(authOptions);
    const t = await getTranslations();

    if(!session?.user) {
        return <p>{t('auth.notAuthText')}</p>;
    }

    const meeting = await MeetingService.getMeeting(Number(id), Number(session.user.id));

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if(!meeting) {
        return <p>{t("meetings.notFound")}</p>;
    }

    return (
        <Modal>
            <div className={styles.modalContent}>
                <h2>{meeting.title}</h2>
                <Separator widthPercent={90} />

                <div className={styles.infoList}>
                    <div className={styles.infoRow}>
                        <CalendarDot size={24} />
                        <span className={styles.infoLabel}>{t("date")}</span>
                        <span>{formatDate(meeting.startHour)}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <Clock size={24} />
                        <span className={styles.infoLabel}>{t("time")}</span>
                        <span className={styles.timeBadge}>
                            {formatTime(meeting.startHour)}
                            <ArrowRight size={16} />
                            {formatTime(meeting.endHour)}
                        </span>
                    </div>

                    <div className={styles.infoRow}>
                        <Folder size={24} />
                        <span className={styles.infoLabel}>{t("project")}</span>
                        <span>{meeting.project.title}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <User size={24} />
                        <span className={styles.infoLabel}>{t("client")}</span>
                        <span>{meeting.project.client.firstName} {meeting.project.client.lastName}</span>
                    </div>

                    <div className={styles.descriptionSection}>
                        <div className={styles.descriptionHeader}>
                            <Notepad size={24} />
                            <span className={styles.infoLabel}>{t("description")}</span>
                        </div>
                        <p className={styles.meetingDescription}>
                            {meeting.description || t("meetings.detailsModal.noDescription")}
                        </p>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <BackButton text={t("close")} />
                </div>
            </div>
        </Modal>
    );
};

export default MeetingDetailModal;
