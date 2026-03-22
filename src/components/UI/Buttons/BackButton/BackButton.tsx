'use client'
import {useRouter} from 'next/navigation';
import styles from "./back-button.module.css";
import {CaretLeft} from "@phosphor-icons/react/ssr";

type BackButtonProps = {
    text?: string;
};

const BackButton = ({ text }: BackButtonProps) => {
    const router = useRouter();

    const handleBack = (): void => router.back();

    return (
        <button type="button" onClick={handleBack} className={styles.backButton} style={{borderRadius: text ? "12px" : "50%"}}>
            {text ? text : <CaretLeft size={24} weight={'bold'} />}
        </button>
    );
};

export default BackButton;
