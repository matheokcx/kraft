import {createProject} from "@/app/(home)/projects/action";
import styles from "./project-create-page.module.css";
import Input, {InputProps} from "@/components/UI/Input/Input";
import {Client} from "@/types";
import {ClientService} from "@/services/clientService";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {ProjectDifficulty} from "@/generated/prisma";
import {getTranslations} from "next-intl/server";
import Separator from "@/components/UI/Separator";
import SelectField from "@/components/UI/SelectField/SelectField";
import {
    ArticleIcon,
    CalendarCheckIcon,
    CalendarIcon,
    ChartBarIcon,
    MoneyIcon,
    PanoramaIcon,
    TextTIcon,
    UserIcon
} from "@phosphor-icons/react/ssr";

const ProjectCreatePage = async () => {
    const session = await getServerSession(authOptions);
    const t = await getTranslations();
    const inputsData: InputProps[] = [
        {type: "text", name: "title", label: t('title'), icon: <TextTIcon size={24} />},
        {type: "text", name: "description", label: t('description'), icon: <ArticleIcon size={24} />},
        {type: "number", name: "cost", label: t('gain'), placeholder: "1000", icon: <MoneyIcon size={24} />},
        {type: "hidden", name: "parentProjectId", label: t('projects.parentProject'), required: false}
    ];

    if(!session?.user){
        return <p>{t("auth.notAuthText")}</p>;
    }

    const userClients: Client[] = await ClientService.getAllUserClients({}, Number(session.user.id));

    return (
        <section className={styles.page}>
            <form action={createProject} className={styles.projectForm}>
                <div className={styles.formHeader}>
                    <h1>{t('projects.createPage.title')}</h1>
                    <Separator widthPercent={30} />
                </div>
                <div className={styles.inputsColumn}>
                    {inputsData.map((input: InputProps) => <Input key={input.name} {...input} />)}

                    <div className={styles.inputsLine}>
                        <Input type="date"
                               label={t('startDate')}
                               name="startDate"
                               icon={<CalendarIcon size={24} />}
                        />
                        <Input type="date"
                               label={t('endDate')}
                               name="endDate"
                               icon={<CalendarCheckIcon size={24} />}
                        />
                    </div>

                    <SelectField label="Client*"
                                 name="clientId"
                                 values={userClients}
                                 displayKey="firstName"
                                 icon={<UserIcon size={24} />}
                    />

                    <SelectField label={t("difficulties")}
                                 name="difficulty"
                                 required={true}
                                 values={Object.keys(ProjectDifficulty) as Array<keyof typeof ProjectDifficulty>}
                                 icon={<ChartBarIcon size={24} />}
                    />

                    <button className={styles.valideFormButton} type="submit">
                        {t('create')}
                    </button>
                </div>
                <div>
                    <Input type="file"
                           label={t('cover')}
                           name="cover"
                           required={false}
                            icon={<PanoramaIcon size={24} />}
                    />
                </div>
            </form>
        </section>
    );
};

export default ProjectCreatePage;
