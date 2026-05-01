import styles from "./homepage.module.css";
import KpiCard from "@/components/UI/Widgets/KpiCard";
import {Client, File, Meeting, Project} from "@/types";
import {getFormattedDate} from "@/utils/utils";
import FileCard from "@/components/UI/Cards/File/FileCard";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {ClientService} from "@/services/clientService";
import {ProjectService} from "@/services/projectService";
import {FileService} from "@/services/fileService";
import {MeetingService} from "@/services/meetingService";
import {getTranslations} from "next-intl/server";
import ComingMeetingsWidget from "@/components/UI/Widgets/ComingMeetingsWidget";

const HomePage = async () => {
    const session = await getServerSession(authOptions);
    const t = await getTranslations();
    const today: Date = new Date();
    const formattedTodayDate: string = getFormattedDate(today);

    if(!session?.user?.id){
        return <p>{t("auth.notAuthText")}</p>;
    }

    const clients: Client[] = await ClientService.getAllUserClients({}, Number(session.user.id));
    const processingProjects: Project[] = await ProjectService.getAllUserProjects({}, Number(session.user.id), true);
    const recentFiles: File[] = await FileService.getFiles(Number(session.user.id));

    const daysPrevisualisationNumber: number = 3;
    const nextThreeDays: string[] = Array.from({ length: daysPrevisualisationNumber }, (_, index: number) => {
        const todayDate: Date = new Date();
        todayDate.setDate(todayDate.getDate() + index);
        return getFormattedDate(todayDate);
    });
    const meetings: Meeting[] = await MeetingService.getMeetings({startHour: new Date(formattedTodayDate)}, Number(session.user.id));

    const comingMeetings = new Map<string, Meeting[]>();
    nextThreeDays.forEach((dateStr: string) => {
        comingMeetings.set(dateStr, meetings.filter((meeting: Meeting) => meeting.startHour.toISOString().startsWith(dateStr)).slice(0, 2));
    });

    return (
        <section className={styles.homePage}>
            <div className={styles.displayGrid}>
                <ComingMeetingsWidget comingMeetings={comingMeetings} />
                <KpiCard name={t("clients.clients")} value={clients.length} />
                <KpiCard name={t("projects.inProgress")} value={processingProjects.length} />
                {recentFiles.length > 0 && (
                    <div className={styles.recentFilesDiv}>
                        <label>{t("files.recentFiles")}</label>
                        <div className={styles.filesDiv}>
                            {recentFiles.map((file: File) => <FileCard key={file.id} file={file} />)}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomePage;
