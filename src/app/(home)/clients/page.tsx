import styles from "./clients-page.module.css";
import {Client} from "@/types";
import ClientCard from "@/components/UI/Cards/Client/ClientCard";
import Link from "next/link";
import {Plus} from "@phosphor-icons/react/ssr";
import {ClientService} from "@/services/clientService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {getTranslations} from "next-intl/server";

const ClientsPage = async () => {
    const session = await getServerSession(authOptions);
    const t = await getTranslations();

    if(!session?.user?.id){
        return <p>Vous n'êtes pas connecté ...</p>
    }

    const clients: Client[] = await ClientService.getAllUserClients({}, Number(session.user.id));

    return (
      <section className={styles.clientsPage}>
        <div className={styles.topPage}>
            <h1>{t("clients.listPage.title")}</h1>
            <button className={styles.addButton}>
                <Plus size={24} />
                <Link href="/clients/create">{t('add')}</Link>
            </button>
        </div>

        <div className={styles.clientsList}>
            {clients.map((client: Client, index: number) => <ClientCard key={index} client={client} />)}
        </div>
      </section>
    );
};

export default ClientsPage;
