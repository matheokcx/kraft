import styles from "./client-create-page.module.css";
import ClientForm from "@/components/UI/Forms/ClientForm/ClientForm";

const ClientCreatePage = async () => {
    return (
        <section className={styles.page}>
            <ClientForm />
        </section>
    );
};

export default ClientCreatePage;
