"use client"
import styles from "./project-card.module.css";
import {ArrowRight, CalendarCheck, CalendarDot} from "@phosphor-icons/react/ssr";
import {useRouter} from "next/navigation";
import {Project} from "@/generated/prisma";

type ProjectCardProps = {
    project: Project;
};

const ProjectCard = ({project}: ProjectCardProps) => {
    const router = useRouter();

    return (
        <div className={styles.projectCard} onClick={() => router.push(`/projects/${project.id}`)}>
            <span className={styles.title}>
                <h3>{project.title}</h3>
                <p>({project.cost}€)</p>
            </span>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.dates}>
                <CalendarDot size={24} />
                <p>{project.startDate.toISOString().split("T")[0]}</p>
                <ArrowRight />
                <CalendarCheck size={24} />
                <p>{project.endDate.toISOString().split("T")[0]}</p>
            </div>
        </div>
    );
};

export default ProjectCard;
