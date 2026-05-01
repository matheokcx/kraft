import {ClientNote} from "@/types";
import styles from "./client-note-section.module.css";
import {getTranslations} from "next-intl/server";



type ClientNotesSectionProps = {
    clientNotes: ClientNote[];
};

const ClientNotesSection = async ({clientNotes}: ClientNotesSectionProps) => {
    const t = await getTranslations();

    return (
        <section className={styles.clientNotesSection}>
            <h3>{t("clients.detailsPage.aboutNotes")}:</h3>
            {clientNotes.map((clientNote) => (
                <div key={clientNote.id} className={styles.clientNoteCard}>
                    <p>{clientNote.text}</p>
                    <p className={styles.clientNoteDateText}>{clientNote.createdAt.toISOString().split("T")[0]}</p>
                </div>
            ))}
        </section>
    );
};

export default ClientNotesSection;
