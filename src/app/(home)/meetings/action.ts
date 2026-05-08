'use server';
import z from 'zod';
import { redirect } from 'next/dist/client/components/redirect';
import { MeetingService } from '@/services/meetingService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ProjectService } from '@/services/projectService';
import { Meeting, Project } from '@/generated/prisma';

const meetingSchema = z
	.object({
		title: z
			.string()
			.min(1, 'Le titre doit avoir au minimum une longueur de 1')
			.max(100, 'Le titre doit avoir au maximum une longueur de 100'),
		description: z
			.string()
			.max(250, 'La description doit avoir au maximum une longueur de 250')
			.optional(),
		startDate: z.date(),
		endDate: z.date(),
		projectId: z.number().nonnegative(),
	})
	.refine((data) => data.endDate > data.startDate, {
		message: 'La date de fin doit être après à la date de début',
		path: ['endDate'],
	});

export const createMeeting = async (
	_prevState: { error?: string } | null,
	inputs: FormData,
): Promise<{ error?: string } | null> => {
	const session = await getServerSession(authOptions);
	const formDataObject = {
		...Object.fromEntries(inputs),
		links: inputs.getAll('links'),
	};
	const isValid = meetingSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: 'Unauthorized' };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	const project: Project | null = await ProjectService.getProject(
		isValid.data.projectId,
		Number(session?.user?.id),
	);

	if (!project) {
		return { error: "Ce n'est pas l'un de vos projets" };
	}

	const newMeeting: Meeting = await MeetingService.addMeeting(isValid.data);

	if (newMeeting) {
		redirect(`/meetings/${newMeeting.id}`);
	} else {
		return { error: "La réunion n'a pas pu être créée" };
	}
};

export const updateMeeting = async (
	_prevState: { error?: string } | null,
	data: FormData,
): Promise<{ error?: string } | null> => {
	const session = await getServerSession(authOptions);
	const meetingId: number = Number(data.get('meetingId') as string);
	const formDataObject = Object.fromEntries(data);
	const isValid = meetingSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: 'Unauthorized' };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	const project: Project | null = await ProjectService.getProject(
		isValid.data.projectId,
		Number(session.user.id),
	);

	if (!project) {
		return { error: "Ce n'est pas l'un de vos projets" };
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
