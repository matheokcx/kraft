"use client";
import {useState} from "react";
import {PlusIcon} from "@phosphor-icons/react";
import {useTranslations} from "next-intl";

type LinksListProps = {
    existinglinks?: string[];
};

const LinksList = ({existinglinks = [""]}: LinksListProps) => {
    const t = useTranslations();
    const [links, setLinks] = useState<string[]>(existinglinks);

    return (
        <div style={{maxHeight: "300px", overflowY: "auto", display: "grid", gap: "20px"}}>
            {links.map((link, index) => (
                <div key={index} style={{display: "flex", gap: "14px", alignItems: "center"}}>
                    <input
                        type="url"
                        name="links"
                        value={link}
                        onChange={(event) => setLinks(links.map((link: string, i: number) => i === index ? event.target.value : link))}
                        placeholder="https://exemple.com"
                        style={{width: "100%"}}
                    />
                    {links.length > 1 && (
                        <button type="button"
                                onClick={() => setLinks(links.filter((_, i: number) => i !== index))}
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={() => setLinks([...links, ""])} style={{justifySelf: "start", cursor: "pointer"}}>
                <PlusIcon size={24} />
                {t("clients.addLink")}
            </button>
        </div>
    );
};

export default LinksList;
