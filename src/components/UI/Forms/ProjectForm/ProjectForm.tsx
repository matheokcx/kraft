"use client"
import {createProject, updateProject} from "@/app/(home)/projects/action";
import styles from "./project-form.module.css";
import Separator from "@/components/UI/Separator";
import Input, {InputProps} from "@/components/UI/Input/Input";
import {
    ChartBarIcon,
    UserIcon
} from "@phosphor-icons/react/ssr";
import SelectField from "@/components/UI/SelectField/SelectField";
import {Client, Project, ProjectDifficulty} from "@/generated/prisma";
import {useTranslations} from "next-intl";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import toast from "react-hot-toast";
import {useActionState, useEffect} from "react";

type ProjectFormProps = {
    clients: Client[];
    project?: Project;
};

const ProjectForm = ({ clients, project }: ProjectFormProps) => {
    const t = useTranslations();
    const [createState, create, isCreating] = useActionState(createProject, null);
    const [updateState, update, isUpdating] = useActionState(updateProject, null);

    const getFormattedDate = (date: Date): string => {
        const year: number = date.getFullYear();
        const month: string = String(date.getMonth() + 1).padStart(2, '0');
        const day: string = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const inputs: InputProps[] = [
        {
            type: "hidden",
            name: "parentProjectId",
            label: "parentProjectId",
            defaultValue: project?.parentProjectId ?? undefined
        },
        {
            type: "text",
            name: "title",
            label: t("title"),
            defaultValue: project?.title
        },
        {
            type: "text",
            name: "description",
            label: t("description"),
            defaultValue: project?.description
        },
        {
            type: "number",
            name: "cost",
            label: t("gain"),
            defaultValue: project?.cost
        },
        {
            type: "date",
            name: "startDate",
            label: t("startDate"),
            defaultValue: project?.startDate ? getFormattedDate(project.startDate) : undefined
        },
        {
            type: "date",
            name: "endDate",
            label: t("endDate"),
            defaultValue: project?.endDate ? getFormattedDate(project.endDate) : undefined
        },
        {
            type: "file",
            name: "cover",
            label: t("cover"),
            defaultValue: undefined,
            required: false
        }
    ];

    useEffect(() => {
        if(createState?.error) toast.error(createState.error);
    }, [createState]);

    useEffect(() => {
        if(updateState?.error) toast.error(updateState.error);
    }, [updateState]);

    if(project){
        inputs.push({
            type: "hidden",
            name: "projectId",
            label: "projectId",
            defaultValue: project.id
        });
    }

    return (
        <form action={project ? update : create} className={styles.projectForm}>
            <div>
                <h1>{project ? project.title : t('projects.createPage.title')}</h1>
                <Separator widthPercent={30} />
            </div>
            <div className={styles.grid}>
                <div className={styles.inputs}>
                    {inputs.map((input: InputProps) => <Input key={input.name} {...input} />)}

                    <SelectField label={t("clients.client", { count: 1 })}
                                 name="clientId"
                                 values={clients}
                                 displayKey="firstName"
                                 icon={<UserIcon size={24} />}
                    />

                    <SelectField label={t("difficulties")}
                                 name="difficulty"
                                 required={true}
                                 values={Object.keys(ProjectDifficulty) as Array<keyof typeof ProjectDifficulty>}
                                 icon={<ChartBarIcon size={24} />}
                    />

                    <button className={styles.valideFormButton}
                            type="submit"
                            disabled={isCreating || isUpdating}
                    >
                        {project ? t("edit") : t('create')}
                    </button>
                </div>
                <div>
                    {(project && project.cover) && <img src={project.cover} alt="Cover" style={{ width: "100%", height: "60%"}}/>}
                </div>
            </div>
        </form>
    );
};

export default ProjectForm;
