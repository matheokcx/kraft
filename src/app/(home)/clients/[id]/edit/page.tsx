import {getTranslations} from "next-intl/server";
import styles from "./edit-client-page.module.css";
import {Client} from "@/types";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";
import {ClientService} from "@/services/clientService";
import ClientForm from "@/components/UI/Forms/ClientForm/ClientForm";

const EditClientPage = async ({ params }: { params: Promise<{ id: string}>}) => {
    const { id } = await params;
    const t = await getTranslations();
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return <p>{t('auth.notAuthText')}</p>;
    }

    const client: Client | null = await ClientService.getClient(Number(id), Number(session.user.id));

    if(!client) {
        return <p>{t("clients.notFound")}</p>;
    }

    return (
        <section className={styles.page}>
            <ClientForm client={client} />
        </section>
    );
};

export default EditClientPage;
