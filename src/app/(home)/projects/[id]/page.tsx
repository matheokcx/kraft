import {ProjectService} from "@/services/projectService";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {Client, File, Meeting, Project, ProjectDifficulty} from "@/types";
import styles from "./project-details-page.module.css";
import Separator from "@/components/UI/Separator";
import {
    ArrowRight,
    CalendarCheck,
    CalendarDot,
    CellSignalFull,
    CellSignalHigh,
    CellSignalLow,
    CellSignalMedium,
    Envelope,
    Money,
    PencilIcon,
    Phone,
    TrashIcon
} from "@phosphor-icons/react/ssr";
import {JSX} from "react";
import Image from "next/image";
import {ClientService} from "@/services/clientService";
import Avatar from "@/components/UI/Avatar/Avatar";
import {MeetingService} from "@/services/meetingService";
import {FileService} from "@/services/fileService";
import FileCard from "@/components/UI/Cards/File/FileCard";
import BackButton from "@/components/UI/Buttons/BackButton/BackButton";
import {getTranslations} from "next-intl/server";
import {removeProject} from "@/app/(home)/projects/action";
import Link from "next/link";
import MeetingReduceCard from "@/components/UI/Cards/Meeting/MeetingReduceCard";

const ProjectDetailPage = async ({params}: {params: Promise<{id: string}>}) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const project: Project | null = await ProjectService.getProject(Number(id), Number(session?.user?.id));
    const t = await getTranslations();

    if(!project){
        return <p>Ce projet n'a pas pu être retrouvé...</p>;
    }

    const client: Client | null = await ClientService.getClient(project.clientId, Number(session?.user?.id));
    const projectMeetings: Meeting[] = await MeetingService.getMeetings({projectId: project.id}, Number(session?.user?.id))
    const files: File[] = await FileService.getFilesByProject(Number(project.id), Number(session?.user?.id));

    const getDifficultyIcon = (projectDifficulty: ProjectDifficulty): JSX.Element => {
        switch(projectDifficulty){
            case "EASY":
                return <CellSignalLow size={32} color="#22c55e" />;
            case "MEDIUM":
                return <CellSignalMedium size={32} color="#eab308" />;
            case "HARD":
                return <CellSignalHigh size={32} color="#f97316" />;
            case "EXPERT":
                return <CellSignalFull size={32} color="#ef4444" />;
        }
    };

    const deleteProject = removeProject.bind(null, project.id);

    return (
        <section className={styles.projectDetailsPage}>
            <div className={styles.backButtonContainer}>
                <BackButton />
            </div>
            {project.cover && <Image src={project.cover}
                                     alt="Project cover"
                                     width={100}
                                     height={20}
                                     className={styles.projectCover}
            />}
            <div className={styles.pageBody}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>{project.title}</h1>
                        <div className={styles.deadline}>
                            <CalendarDot size={24} />
                            <p>{project.startDate.toISOString().split("T")[0]}</p>
                            <ArrowRight />
                            <CalendarCheck size={24} />
                            <p>{project.endDate.toISOString().split("T")[0]}</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button className={styles.editButton}>
                            <Link href={`/projects/${project.id}/edit`}>
                                <PencilIcon size={24} />
                            </Link>
                        </button>
                        <form action={deleteProject}>
                            <button className={styles.deleteButton} type="submit">
                                <TrashIcon size={24} />
                            </button>
                        </form>
                    </div>
                </div>

                <Separator widthPercent={100} />
                <div className={styles.projectInformation}>
                    <div className={styles.projectDetails}>
                        <p>{project.description}</p>
                        <div>
                            <div className={styles.earnedMoneyLine}>
                                <Money size={24} />
                                <u>{t("totalGain")}: </u>
                                <b>{project.cost}€</b>
                            </div>
                            <div className={styles.earnedMoneyLine}>
                                <div>{getDifficultyIcon(project.difficulty)}</div>
                                <p>{t(project.difficulty)}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.projectRelationInformation}>
                        {client && (
                            <div className={styles.projectRelationPart}>
                                <Avatar firstName={client.firstName} lastName={client.lastName} image={client.image} />
                                <h3>{client.firstName} {client.lastName}</h3>
                                <p>{client.job}</p>
                                <div className={styles.clientContactsPart}>
                                    {client.mail && (
                                        <span className={styles.contactLine}>
                                            <Envelope size={24} />
                                            <a href={`mailto:${client.mail}`}>{client.mail}</a>
                                        </span>
                                    )}
                                    {client.phone && (
                                        <span className={styles.contactLine}>
                                            <Phone size={24} />
                                            <a href={`tel:${client.phone}`}>{client.phone}</a>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className={styles.projectRelationPart}>
                            <h2>{t('projects.detailsPage.associateMeetings')}</h2>
                            {projectMeetings.map((meeting: Meeting, index: number) => (
                                <MeetingReduceCard key={index} meeting={meeting} />
                            ))}
                        </div>
                    </div>
                    {files.length > 0 && (
                        <div className={styles.projectFilesSection}>
                            {files.map((file: File) => <FileCard key={file.id} file={file}/>)}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProjectDetailPage;
