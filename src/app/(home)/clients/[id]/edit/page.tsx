import {updateClient} from "@/app/(home)/clients/action";
import {prismaClient} from "@/lib/prisma";
import Input from "@/components/UI/Input/Input";
import {getTranslations} from "next-intl/server";
import styles from "./edit-client-page.module.css";
import Separator from "@/components/UI/Separator";
import {ClientStatus, GENDER} from "@/generated/prisma";
import {Gender} from "@/types";
import BackButton from "@/components/UI/Buttons/BackButton/BackButton";
import {
    BriefcaseIcon,
    CakeIcon,
    CloudArrowUpIcon,
    EnvelopeIcon,
    GenderIntersexIcon,
    LinkIcon,
    PhoneIcon,
    ThermometerIcon
} from "@phosphor-icons/react/ssr";
import LinksList from "@/components/UI/LinksList";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";

const EditClientPage = async ({ params }: { params: Promise<{ id: string}>}) => {
    const { id } = await params;
    const t = await getTranslations();
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return <p>Vous devez être connecté</p>;
    }

    const client = await prismaClient.client.findUnique({
        where: {
            id: Number(id),
            freelanceId: Number(session.user.id)
        }
    });

    if(!client) {
        return <p>Ce client n'a pas été trouvé</p>;
    }

    return (
        <section className={styles.page}>
            <form action={updateClient} className={styles.gridForm}>
                <div className={styles.titleRow}>
                    <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <BackButton />
                        {t("clients.updatePage.title")}
                    </h1>
                    <Separator widthPercent={30} />
                </div>
                <div style={{ display: "grid", gap: "32px" }}>
                    <div className={styles.inputsLine}>
                        <Input type="text"
                               name="lastName"
                               label={t("lastName")}
                               placeholder="Dubois"
                               defaultValue={client.lastName}
                        />
                        <Input type="text"
                               name="firstName"
                               label={t("firstName")}
                               placeholder="Alex"
                               defaultValue={client.firstName}
                        />
                    </div>

                    <div className={styles.inputsLine}>
                        <div className={styles.selectDiv} style={{width: "50%"}}>
                            <label htmlFor="gender">
                                <GenderIntersexIcon size={24} />
                                Sex*
                            </label>
                            <select name="gender" id="gender" defaultValue={client.gender} required>
                                {Object.values(GENDER).map((gender: Gender) => (
                                    <option key={gender} value={gender}>
                                        {t(gender)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input type="date"
                               name="birthdate"
                               label={t("birthdate")}
                               required={false}
                               icon={<CakeIcon size={24} />}
                               defaultValue={client.birthdate?.toISOString().split("T")[0]}
                        />
                    </div>

                    <Input type="text"
                           name="job"
                           label={t("job")}
                           placeholder="CEO"
                           icon={<BriefcaseIcon size={24} />}
                           defaultValue={client.job}
                    />
                    <div className={styles.selectDiv}>
                        <label htmlFor="status">
                            <ThermometerIcon size={24} />
                            {t("status")}
                        </label>
                        <select name="status" id="status" defaultValue={client.status}>
                            {Object.values(ClientStatus).map((status: ClientStatus) => (
                                <option key={status} value={status}>
                                    {t(status)}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className={styles.inputsLine}>
                        <Input type="mail"
                               name="mail"
                               label="Mail"
                               placeholder="alex.dubois@example.com"
                               required={false}
                               icon={<EnvelopeIcon size={24} />}
                               defaultValue={client.mail ?? undefined}
                        />
                        <Input type="tel"
                               name="phone"
                               label={t("phone")}
                               placeholder="0707070707"
                               required={false}
                               icon={<PhoneIcon size={24} />}
                               defaultValue={client.phone ?? undefined}
                        />
                    </div>
                    <button className={styles.valideFormButton} type="submit">{t('edit')}</button>
                </div>
                <div>
                    <div className={styles.dropFileBox}>
                        <CloudArrowUpIcon size={48} />
                        <Input type="file" name="image" label="Lâcher ou choisir la photo de votre client (max 5Mo)" required={false} />
                    </div>
                    <div style={{ marginTop: "32px"}}>
                        <label style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                            <LinkIcon size={24} />
                            Lien(s) associé(s)
                        </label>
                        <LinksList existinglinks={client.links} />
                    </div>
                </div>

                <Input type="hidden"
                       label="clientId"
                       name="clientId"
                       required={true}
                       defaultValue={client.id}
                />
            </form>
        </section>
    );
};

export default EditClientPage;
