import styles from './project-create-page.module.css';
import { ClientService } from '@/services/clientService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import ProjectForm from '@/components/UI/Forms/ProjectForm/ProjectForm';
import { Client } from '@/generated/prisma';

const ProjectCreatePage = async () => {
	const session = await getServerSession(authOptions);
	const t = await getTranslations();

	if (!session?.user) {
		return <p>{t('auth.notAuthText')}</p>;
	}

	const userClients: Client[] = await ClientService.getAllUserClients(
		{},
		Number(session.user.id),
	);

	return (
		<section className={styles.page}>
			<ProjectForm clients={userClients} />
		</section>
	);
};

export default ProjectCreatePage;
