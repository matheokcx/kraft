"use client"
import styles from "./client-form.module.css";
import BackButton from "@/components/UI/Buttons/BackButton/BackButton";
import Separator from "@/components/UI/Separator";
import Input from "@/components/UI/Input/Input";
import SelectField from "@/components/UI/SelectField/SelectField";
import {ClientStatus, GENDER} from "@/generated/prisma";
import {
    BriefcaseIcon,
    CakeIcon, CloudArrowUpIcon,
    EnvelopeIcon,
    GenderIntersexIcon, LinkIcon,
    PhoneIcon,
    ThermometerIcon
} from "@phosphor-icons/react/ssr";
import LinksList from "@/components/UI/LinksList";
import {useTranslations} from "next-intl";
import {createClient, updateClient} from "@/app/(home)/clients/action";
import toast from "react-hot-toast";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {Client} from "@/types";

type ClientFormProps = {
    client?: Client;
};

const ClientForm = ({client}: ClientFormProps) => {
    const t = useTranslations();
    const isEdit: boolean = !!client;

    const handleSubmit = async (formData: FormData): Promise<void> => {
        try{
            if(isEdit){
                await updateClient(formData);
            } else {
                await createClient(formData);
            }
        }
        catch(error: any){
            if(isRedirectError(error)) {
                throw error;
            }
            toast.error(error.message);
        }
    };

    return (
        <form action={handleSubmit} className={styles.gridForm}>
            <div className={styles.titleRow}>
                <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <BackButton />
                    {isEdit ? t('clients.updatePage.title') : t('clients.createPage.title')}
                </h1>
                <Separator widthPercent={30} />
            </div>
            <div style={{ display: "grid", gap: "32px" }}>
                <div className={styles.inputsLine}>
                    <Input type="text"
                           name="lastName"
                           label={t("lastName")}
                           placeholder="Dubois"
                           defaultValue={client?.lastName}
                    />
                    <Input type="text"
                           name="firstName"
                           label={t("firstName")}
                           placeholder="Alex"
                           defaultValue={client?.firstName}
                    />
                </div>

                <div className={styles.inputsLine}>

                    <div className={styles.selectDiv} style={{width: "50%"}}>
                        <SelectField name="gender"
                                     label="Sex*"
                                     values={Object.values(GENDER)}
                                     icon={<GenderIntersexIcon size={24} />}
                                     defaultValue={client?.gender}
                        />
                    </div>
                    <Input type="date"
                           name="birthdate"
                           label={t("birthdate")}
                           required={false}
                           icon={<CakeIcon size={24} />}
                           defaultValue={client?.birthdate?.toISOString().split("T")[0]}
                    />
                </div>

                <Input type="text"
                       name="job"
                       label={t("job")}
                       placeholder="CEO"
                       icon={<BriefcaseIcon size={24} />}
                       defaultValue={client?.job}
                />

                <SelectField name="status"
                             label={t("status")}
                             values={Object.values(ClientStatus)}
                             icon={<ThermometerIcon size={24} />}
                             defaultValue={client?.status}
                />


                <div className={styles.inputsLine}>
                    <Input type="mail"
                           name="mail"
                           label="Mail"
                           placeholder="alex.dubois@example.com"
                           required={false}
                           icon={<EnvelopeIcon size={24} />}
                           defaultValue={client?.mail ?? undefined}
                    />
                    <Input type="tel"
                           name="phone"
                           label={t("phone")}
                           placeholder="0707070707"
                           required={false}
                           icon={<PhoneIcon size={24} />}
                           defaultValue={client?.phone ?? undefined}
                    />
                </div>
                <button className={styles.valideFormButton} type="submit">{isEdit ? t('edit') : t('create')}</button>
            </div>
            <div>
                <div className={styles.dropFileBox}>
                    <CloudArrowUpIcon size={48} />
                    <Input type="file" name="image" label={t("clients.imageFileInputText")} required={false} />
                </div>
                <div style={{ marginTop: "32px"}}>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                        <LinkIcon size={24} />
                        {t("clients.associateLinksLabel")}
                    </label>
                    <LinksList existinglinks={client?.links} />
                </div>
            </div>
            {isEdit && (
                <Input type="hidden"
                       label="clientId"
                       name="clientId"
                       required={true}
                       defaultValue={client!.id}
                />
            )}
        </form>
    );
};

export default ClientForm;
