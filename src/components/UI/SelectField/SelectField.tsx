"use client"
import styles from "./select-field.module.css";
import {JSX} from "react";
import {useTranslations} from "next-intl";

type SelectFieldProps = {
    name: string;
    values: any[];
    label: string;
    displayKey?: string;
    icon?: JSX.Element;
    required?: boolean;
    defaultValue?: any;
};

const SelectField = ({name, values, label, displayKey, icon, required = true}: SelectFieldProps) => {
    const t = useTranslations();

    return (
        <div className={styles.selectDiv}>
            <label htmlFor={name} className={styles.selectLabel}>
                {icon && icon}
                {label}
            </label>
            <select id={name} name={name} required={required}>
                {values.map((object: any, index: number) => (
                    <option key={index} value={displayKey ? object.id : object}>{displayKey ? object[displayKey] : t(object)}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
