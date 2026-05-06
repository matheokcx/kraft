import {ProjectService} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {ClientService} from "@/services/clientService";
import {getTranslations} from "next-intl/server";
import ProjectForm from "@/components/UI/Forms/ProjectForm/ProjectForm";
import styles from "@/app/(home)/projects/create/project-create-page.module.css";
import {Client, Project} from "@/generated/prisma";

const EditProjectPage = async ({ params }: { params: Promise<{ id: string}>}) => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const t = await getTranslations();

    if(!session?.user){
        return <p>{t("auth.notAuthText")}</p>;
    }

    const userClients: Client[] = await ClientService.getAllUserClients({}, Number(session.user.id));
    const project: Project | null = await ProjectService.getProject(Number(id), Number(session.user.id));

    if(!project){
        return <p>{t("projects.notFound")}</p>;
    }

    return (
        <section className={styles.page}>
            <ProjectForm project={project} clients={userClients} />
        </section>
    );
};

export default EditProjectPage;
