import {createClient} from "@/app/(home)/clients/action";
import styles from "./client-create-page.module.css";
import {ClientStatus, GENDER} from "@/generated/prisma";
import Separator from "@/components/UI/Separator";
import Input from "@/components/UI/Input/Input";
import {getTranslations} from "next-intl/server";
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
import BackButton from "@/components/UI/Buttons/BackButton/BackButton";
import SelectField from "@/components/UI/SelectField/SelectField";

const ClientCreatePage = async () => {
    const t = await getTranslations();

    return (
        <section className={styles.page}>
            <form action={createClient} className={styles.gridForm}>
                <div className={styles.titleRow}>
                    <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <BackButton />
                        {t('clients.createPage.title')}
                    </h1>
                    <Separator widthPercent={30} />
                </div>
                <div style={{ display: "grid", gap: "32px" }}>
                    <div className={styles.inputsLine}>
                        <Input type="text"
                               name="lastName"
                               label={t("lastName")}
                               placeholder="Dubois"
                        />
                        <Input type="text"
                               name="firstName"
                               label={t("firstName")}
                               placeholder="Alex"
                        />
                    </div>

                    <div className={styles.inputsLine}>

                        <div className={styles.selectDiv} style={{width: "50%"}}>
                            <SelectField name="gender"
                                         label="Sex*"
                                         values={Object.values(GENDER)}
                                         icon={<GenderIntersexIcon size={24} />}
                            />
                        </div>
                        <Input type="date"
                               name="birthdate"
                               label={t("birthdate")}
                               required={false}
                               icon={<CakeIcon size={24} />}
                        />
                    </div>

                    <Input type="text"
                           name="job"
                           label={t("job")}
                           placeholder="CEO"
                           icon={<BriefcaseIcon size={24} />}
                    />

                    <SelectField name="status"
                                 label={t("status")}
                                 values={Object.values(ClientStatus)}
                                 icon={<ThermometerIcon size={24} />}
                    />


                    <div className={styles.inputsLine}>
                        <Input type="mail"
                               name="mail"
                               label="Mail"
                               placeholder="alex.dubois@example.com"
                               required={false}
                               icon={<EnvelopeIcon size={24} />}
                        />
                        <Input type="tel"
                               name="phone"
                               label={t("phone")}
                               placeholder="0707070707"
                               required={false}
                               icon={<PhoneIcon size={24} />}
                        />
                    </div>
                    <button className={styles.valideFormButton} type="submit">{t('create')}</button>
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
                        <LinksList />
                    </div>
                </div>
            </form>
        </section>
    );
};

export default ClientCreatePage;
