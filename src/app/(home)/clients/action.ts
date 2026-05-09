'use server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Client, ClientStatus, GENDER } from '@/generated/prisma';
import { ClientService } from '@/services/clientService';
import { redirect } from 'next/dist/client/components/redirect';
import z from 'zod';
import { FileStorageService } from '@/services/fileStorageService';
import { getTranslations } from 'next-intl/server';

const clientSchema = z.object({
	firstName: z.string().min(2).max(100),
	lastName: z.string().min(2).max(100),
	job: z.string().max(100),
	status: z.enum(Object.values(ClientStatus)),
	birthdate: z.union([z.literal('').transform(() => null), z.iso.date()]).nullable(),
	mail: z.union([z.literal('').transform(() => null), z.string().email()]).nullable(),
	phone: z.union([z.literal('').transform(() => null), z.string()]).nullable(),
	image: z.union([
		z
			.file()
			.mime(FileStorageService.supportedMimeTypes.images)
			.max(FileStorageService.maxFileSize),
		z
			.file()
			.refine((file) => file.size === 0)
			.transform(() => null),
	]),
	links: z
		.array(z.string().url().or(z.literal('')))
		.transform((arr) => arr.filter((s) => s !== '')),
	gender: z.enum(Object.values(GENDER)),
});

export const createClient = async (
	_prevState: { error?: string } | null,
	inputs: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const formDataObject = {
		...Object.fromEntries(inputs),
		links: inputs.getAll('links'),
	};
	const isValid = clientSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthenticated') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	const newClient: Client = await ClientService.addClient(isValid.data, Number(session.user.id));

	if (newClient) {
		redirect(`/clients/${newClient.id}`);
	} else {
		return { error: t('clients.errors.creationFailed') };
	}
};

export const updateClient = async (
	_prevState: { error?: string } | null,
	data: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const clientId: number = Number(data.get('clientId') as string);
	const formDataObject = {
		...Object.fromEntries(data),
		links: data.getAll('links'),
	};
	const isValid = clientSchema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthenticated') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	await ClientService.editClient(isValid.data, clientId, Number(session.user.id));
	redirect(`/clients/${clientId}`);
};

export const removeClient = async (clientId: number): Promise<void> => {
	const session = await getServerSession(authOptions);

	if (session?.user?.id) {
		await ClientService.deleteClient(clientId, Number(session.user.id));
		redirect('/clients');
	}
};
