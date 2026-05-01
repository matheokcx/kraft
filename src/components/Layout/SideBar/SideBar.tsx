'use client'
import {signOut} from "next-auth/react";
import {JSX} from "react";
import {useRouter} from "next/navigation";
import LinkLine from "@/components/UI/Lines/LinkLine";
import {Browsers, CalendarDots, House, Users} from "@phosphor-icons/react";
import LanguageButton from "@/components/UI/Buttons/LanguageButton";
import {useTranslations} from "next-intl";
import styles from "./sidebar.module.css";
import Separator from "@/components/UI/Separator";

const SideBar = () => {
    const t = useTranslations();
    type linkType = {
        link: string;
        title: string;
        icon: JSX.Element;
    };
    const links: linkType[] = [
        {link: "/", title: t("links.home"), icon: <House size={32} weight="bold" />},
        {link: "/clients", title: t("clients.clients"), icon: <Users size={32} weight="bold" />},
        {link: "/projects", title: t("projects.projects"), icon: <Browsers size={32} weight="bold" />},
        {link: "/meetings", title: t("meetings.meetings"), icon: <CalendarDots size={32} weight="bold" />}
    ];
    const router = useRouter();

    return (
        <header className={styles.homeSideBar}>
            <div onClick={() => router.push("/")} className={styles.logo}>
                <img src="/logo.svg" alt="Logo of the application" />
            </div>
            <Separator widthPercent={100} />

            <nav>
                {links.map((link, index: number) =>
                    <LinkLine key={index}
                              title={link.title}
                              link={link.link}
                              icon={link.icon}
                    />
                )}
            </nav>

            <div className={styles.buttonsSection}>
                <LanguageButton />
                <button onClick={() => signOut()} className={styles.logoutButton}>
                    {t('auth.logout')}
                </button>
            </div>
        </header>
    );
};

export default SideBar;
