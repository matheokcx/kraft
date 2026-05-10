'use server';
import z from 'zod';
import { redirect } from 'next/dist/client/components/redirect';
import { MeetingService } from '@/services/meetingService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ProjectService } from '@/services/projectService';
import { Meeting, Project } from '@/generated/prisma';
import { getTranslations } from 'next-intl/server';

const meetingSchema = z
	.object({
		title: z.string().min(1).max(100),
		description: z.string().max(250).optional(),
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
		projectId: z.coerce.number().nonnegative(),
	})
	.refine((data) => data.endDate > data.startDate, {
		path: ['endDate'],
	});

export const createMeeting = async (
	_prevState: { error?: string } | null,
	inputs: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const formDataObject = {
		...Object.fromEntries(inputs),
		links: inputs.getAll('links'),
	};
	const isValid = meetingSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthorized') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	const project: Project | null = await ProjectService.getProject(
		isValid.data.projectId,
		Number(session?.user?.id),
	);

	if (!project) {
		return { error: t('meetings.errors.notYourProject') };
	}

	const newMeeting: Meeting = await MeetingService.addMeeting(isValid.data);

	if (newMeeting) {
		redirect(`/meetings/${newMeeting.id}`);
	} else {
		return { error: t('meetings.errors.creationFailed') };
	}
};

export const updateMeeting = async (
	_prevState: { error?: string } | null,
	data: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const meetingId: number = Number(data.get('meetingId') as string);
	const formDataObject = Object.fromEntries(data);
	const isValid = meetingSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthorized') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	const project: Project | null = await ProjectService.getProject(
		isValid.data.projectId,
		Number(session.user.id),
	);

	if (!project) {
		return { error: t('meetings.errors.notYourProject') };
	}

	await MeetingService.editMeeting(isValid.data, meetingId, Number(session.user.id));
	redirect(`/meetings/${meetingId}`);
};

export const removeMeeting = async (meetingId: number): Promise<void> => {
	const session = await getServerSession(authOptions);

	if (session?.user?.id) {
		await MeetingService.deleteMeeting(meetingId, Number(session?.user?.id));
		redirect(`/meetings`);
	}
};
