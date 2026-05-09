'use server';
import z from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { prismaClient } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { GENDER } from '@/generated/prisma';

export const editProfile = async (
	_prevState: { error?: string } | null,
	formData: FormData,
): Promise<{ error?: string } | null> => {
	const t = await getTranslations();
	const session = await getServerSession(authOptions);
	const schema = z.object({
		name: z.string().max(100),
		email: z.string().email().max(150),
		birthdate: z.coerce.date(),
		gender: z.enum(Object.values(GENDER)),
		country: z.string(),
	});
	const formDataObject = { ...Object.fromEntries(formData) };
	const isValid = schema.safeParse(formDataObject);

	if (!session?.user?.id) {
		return { error: t('errors.unauthenticated') };
	}

	if (!isValid.success) {
		return { error: isValid.error.issues.map((i) => i.message).join('\n\n') };
	}

	await prismaClient.user.update({
		where: {
			id: Number(session.user.id),
		},
		data: {
			...isValid.data,
		},
	});

	redirect('/profile');
};
