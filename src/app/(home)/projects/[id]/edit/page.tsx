import {getProject} from "@/services/projectService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import Input, {InputProps} from "@/components/UI/Input/Input";
import {updateProject} from "@/app/(home)/projects/action";
import styles from "./edit-project-page.module.css";
import {Client, Project} from "@/types";
import {getAllUserClients} from "@/services/clientService";
import {ProjectDifficulty} from "@/generated/prisma";
import {getTranslations} from "next-intl/server";
import {getFormattedDate} from "@/utils/utils";

const EditProjectPage = async ({ params }: { params: Promise<{ id: string}>}) => {
    const { id } = await params;
    const t = await getTranslations();
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return <p>Vous devez être connecté</p>;
    }

    const userClients: Client[] = await getAllUserClients({}, Number(session.user.id));
    const project: Project | null = await getProject(Number(id), Number(session.user.id));

    if(!project){
        return <p>Projet non trouvé.</p>;
    }

    const inputs: InputProps[] = [
        {type: "hidden", name: "projectId", label: "projectId", defaultValue: id},
        {type: "hidden", name: "parentProjectId", label: "parentProjectId", defaultValue: project.parentProjectId ?? undefined},
        {type: "text", name: "title", label: "Titre", defaultValue: project.title},
        {type: "text", name: "description", label: "Description", defaultValue: project.description},
        {type: "number", name: "cost", label: "Gains", defaultValue: project.cost},
        {type: "date", name: "startDate", label: "Date de début", defaultValue: getFormattedDate(project.startDate)},
        {type: "date", name: "endDate", label: "Date de fin", defaultValue: getFormattedDate(project.endDate)},
        {type: "file", name: "cover", label: "Image de couverture", defaultValue: undefined, required: false}
    ];

    return (
        <form action={updateProject} className={styles.editForm}>
            { inputs.map((input: InputProps) => (
                <Input key={input.name}
                       type={input.type}
                       name={input.name}
                       label={input.label}
                       defaultValue={input.defaultValue}
                       required={input.required} />
            ))}

            <select name="clientId" defaultValue={project.clientId}>
                {userClients.map((client: Client, index: number) => <option key={`${client.firstName}-${index}`} value={client.id}>{client.firstName} {client.lastName}</option>)}
            </select>

            <select name="difficulty" defaultValue={project.difficulty}>
                {(Object.keys(ProjectDifficulty) as Array<keyof typeof ProjectDifficulty>).map((key) => (
                    <option key={key} value={key}>{t(key)}</option>
                ))}
            </select>
            
            <button type="submit">{t("edit")}</button>
        </form>
    );
};

export default EditProjectPage;
