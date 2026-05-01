import {ClientService} from "@/services/clientService";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth/next";
import {Client, ClientNote} from "@/types";
import styles from "./client-detail-page.module.css";
import Chip from "@/components/UI/Chip/Chip";
import {$Enums, ClientStatus} from "@/generated/prisma";
import {statusColors} from "@/lib/statusColors";
import {Envelope, GenderFemale, GenderMale, PencilIcon, Phone, TrashIcon} from "@phosphor-icons/react/ssr";
import Separator from "@/components/UI/Separator";
import Avatar from "@/components/UI/Avatar/Avatar";
import BackButton from "@/components/UI/Buttons/BackButton/BackButton";
import {ClientNoteService} from "@/services/clientNoteService";
import ClientNotesSection from "@/components/Layout/Client/ClientNotesSection";
import {getTranslations} from "next-intl/server";
import {removeClient} from "@/app/(home)/clients/action";
import Link from "next/link";
import GENDER = $Enums.GENDER;


const ClientDetailsPage = async ({params}: {params: Promise<{id: string}>}) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const t = await getTranslations();

    if(!session?.user?.id){
        return <p>{t("auth.notAuthText")}</p>
    }

    const client: Client | null = await ClientService.getClient(Number(id), Number(session.user.id));

    if(!client){
        return <p>{t("clients.notFound")}</p>
    }

    const clientNotes: ClientNote[] = await ClientNoteService.getClientNotes(client.id, Number(session.user.id));

    const calculateAge = (birthdate: Date): number => {
        const today: Date = new Date();
        let age: number = today.getFullYear() - birthdate.getFullYear();
        const monthDifference: number = today.getMonth() - birthdate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    };

    const deleteClient = removeClient.bind(null, client.id);

    return (
        <main className={styles.page}>
            <BackButton />
            <div className={styles.pageHeader}>
                <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
                    <Avatar firstName={client.firstName} lastName={client.lastName} image={client.image}/>
                    <div>
                        <h2>{client.firstName} {client.lastName}</h2>
                        <p>{client.job}</p>
                        <Chip text={t(client.status)} color={statusColors[client.status as ClientStatus]} />
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px"}}>
                    <button className={styles.editButton}>
                        <Link href={`/clients/${client.id}/edit`}>
                            <PencilIcon size={24} />
                        </Link>
                    </button>
                    <form action={deleteClient}>
                        <button className={styles.deleteButton} type="submit">
                            <TrashIcon size={24} />
                        </button>
                    </form>
                </div>
            </div>
            <Separator widthPercent={100} />
            <div className={styles.infos}>
                <div className={styles.contactInformation}>
                    <h3><u>{t("information")}:</u></h3>
                    {client.gender === GENDER.MALE ?
                        (<span className={styles.contactLine}>
                        <GenderMale size={24} />
                        <p>{t('MALE')}</p>
                    </span>)
                        : (<span className={styles.contactLine}>
                        <GenderFemale size={24} />
                        <p>{t('FEMALE')}</p>
                    </span>)
                    }
                    {client.birthdate && (
                        <p>{client.birthdate.toISOString().split("T")[0]} ({calculateAge(client.birthdate)} {t("years")})</p>
                    )}
                </div>
                {(client.mail || client.phone) && (
                    <div className={styles.contactInformation}>
                        <h3><u>{t("contacts")}:</u></h3>
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
                )}
            </div>

            {client.links.length > 0 && (
                <div className={styles.contactInformation}>
                    <h3><u>{t("links.links")}:</u></h3>
                    {client.links.map((link: string, index: number) => (
                        <a key={index} href={link} target="_blank">
                            {link}
                        </a>
                    ))}
                </div>
            )}
            <ClientNotesSection clientNotes={clientNotes} />
        </main>
    );
};

export default ClientDetailsPage;
