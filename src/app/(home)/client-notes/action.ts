'use server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import z from 'zod';
import { ClientNoteService } from '@/services/clientNoteService';
import { ClientService } from '@/services/clientService';
import { redirect } from 'next/dist/client/components/redirect';
import { Client, ClientNote } from '@/generated/prisma';
import { getTranslations } from 'next-intl/server';

const clientNoteSchema = z.object({
	text: z.string().min(1).max(200),
	clientId: z.number().nonnegative(),
});

export const addClientNote = async (
	_prevState: { error?: string } | null,
	formData: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const formDataObject = { ...Object.fromEntries(formData) };
	const isValid = clientNoteSchema.safeParse(formDataObject);

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
		return { error: t('clientNotes.errors.notYourClient') };
	}

	const newClientNote: ClientNote = await ClientNoteService.createClientNote(isValid.data);

	if (newClientNote) {
		redirect(`/client-notes/${newClientNote.id}`);
	} else {
		return { error: t('clientNotes.errors.creationFailed') };
	}
};

export const updateClientNote = async (
	_prevState: { error?: string } | null,
	formData: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const clientNoteId: number = Number(formData.get('clientNoteId') as string);
	const formDataObject = { ...Object.fromEntries(formData) };
	const isValid = clientNoteSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthenticated') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	await ClientNoteService.editClientNote(isValid.data, clientNoteId, Number(session.user.id));
	redirect(`/client-notes/${clientNoteId}`);
};

export const removeClientNote = async (clientNoteId: number): Promise<void> => {
	const session = await getServerSession(authOptions);

	if (session?.user?.id) {
		await ClientNoteService.deleteClientNote(clientNoteId, Number(session?.user?.id));
		redirect(`/client-notes`);
	}
};
