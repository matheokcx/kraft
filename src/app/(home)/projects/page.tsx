import Link from "next/link";
import styles from "./projects-page.module.css";
import {Plus} from "@phosphor-icons/react/ssr";
import {ProjectService} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {Project} from "@/types";
import ProjectCard from "@/components/UI/Cards/Project/ProjectCard";
import {getTranslations} from "next-intl/server";


const ProjectListPage = async () => {
    const session = await getServerSession(authOptions);
    const t  = await getTranslations();

    if(!session?.user?.id) {
        return <p>{t("auth.notAuthText")}</p>
    }

    const projects: Project[] = await ProjectService.getAllUserProjects({}, Number(session.user.id), false);

    return (
        <section className={styles.pageSection}>
            <div className={styles.pageHeader}>
                <h1>{t('projects.listPage.title')}</h1>
                <button className={styles.addButton}>
                    <Plus size={24} weight="bold" />
                    <Link href="/projects/create">{t("create")}</Link>
                </button>
            </div>

            <div className={styles.projectList}>
                {projects.map((project: Project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};

export default ProjectListPage;
