'use server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ProjectService } from '@/services/projectService';
import { redirect } from 'next/dist/client/components/redirect';
import { z } from 'zod';
import { Client, Project, ProjectDifficulty } from '@/generated/prisma';
import { FileStorageService } from '@/services/fileStorageService';
import { ClientService } from '@/services/clientService';
import { getTranslations } from 'next-intl/server';

const projectSchema = z.object({
	title: z.string().min(3).max(150),
	description: z.string().min(3).max(250),
	difficulty: z.enum(Object.values(ProjectDifficulty)),
	cost: z.coerce.number().nonnegative(),
	clientId: z.coerce.number().nonnegative(),
	parentProjectId: z.coerce
		.number()
		.refine((value: number) => value === 0)
		.transform(() => null)
		.nullable(),
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	cover: z.union([
		z
			.file()
			.mime(FileStorageService.supportedMimeTypes.images)
			.max(FileStorageService.maxFileSize),
		z
			.file()
			.refine((file) => file.size === 0)
			.transform(() => null),
	]),
});

export const createProject = async (
	_prevState: { error?: string } | null,
	data: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const clientId: number = Number(data.get('clientId'));
	const formDataObject = Object.fromEntries(data);
	const isValid = projectSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthenticated') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	const client: Client | null = await ClientService.getClient(
		isValid.data.clientId,
		Number(session.user.id),
	);

	if (!client) {
		return { error: t('projects.errors.notYourClient') };
	}

	const newProject: Project = await ProjectService.addProject(isValid.data, clientId);

	if (newProject) {
		redirect(`/projects/${newProject.id}`);
	} else {
		return { error: t('projects.errors.creationFailed') };
	}
};

export const updateProject = async (
	_prevState: { error?: string } | null,
	data: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const projectId: number = Number(data.get('projectId') as string);
	const formDataObject = Object.fromEntries(data);
	const isValid = projectSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthenticated') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	await ProjectService.editProject(isValid.data, projectId, Number(session.user.id));
	redirect(`/projects/${projectId}`);
};

export const removeProject = async (projectId: number): Promise<void> => {
	const session = await getServerSession(authOptions);

	if (session?.user?.id) {
		await ProjectService.deleteProject(projectId, Number(session.user.id));
		redirect('/projects');
	}
};
