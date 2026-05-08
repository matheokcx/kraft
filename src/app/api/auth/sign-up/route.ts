import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/generated/prisma';
import { prismaClient } from '@/lib/prisma';
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit';
import bcrypt from 'bcrypt';
import * as z from 'zod';

export async function POST(request: NextRequest) {
	try {
		const limited = enforceRateLimit(`sign-up:${getClientIp(request)}`, 5, 60_000);

		if (limited) {
			return limited;
		}

		const { email, password, name, birthdate, gender, country } = await request.json();
		const UserSchema = z.object({
			email: z.email('Votre email doit respecter la structure standard: nom@domain.exemple'),
			password: z
				.string()
				.regex(
					/^[A-Za-z0-9!@#$%^&*()_+=\-]+$/,
					'Votre mot de passe doit contenir majuscules, minuscules, chiffres et caractères spéciaux',
				)
				.min(12, 'Votre mot de passe doit contenir au moins 12 caractères'),
			name: z
				.string()
				.min(2, 'Votre prénom doit faire au moins 2 caractères')
				.max(50, 'Votre prénom doit faire au maximum 50 caractères'),
			birthdate: z.coerce.date(),
			gender: z.enum(['MALE', 'FEMALE'], 'Soit homme ou femme'),
			country: z.string(),
		});
		const validation = UserSchema.safeParse({
			email: email,
			password: password,
			name: name,
			birthdate: birthdate,
			gender: gender,
			country: country,
		});

		if (!validation.success) {
			return NextResponse.json(
				{ error: [...validation.error.issues.map((e) => e.message)] },
				{ status: 400 },
			);
		}

		const existingUser = await prismaClient.user.findUnique({ where: { email: email } });

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Cette email est déjà utilisé par un autre utilisateur' },
				{ status: 409 },
			);
		}

		const user: User = await prismaClient.user.create({
			data: {
				name: name,
				email: email,
				password: await bcrypt.hash(password, 10),
				birthdate: new Date(birthdate),
				gender: gender,
				country: country,
			},
		});

		const { password: _, ...userWithoutPassword } = user;

		return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
	} catch (error: any) {
		console.error("Erreur lors de la création de l'utilisateur :", error);
		return NextResponse.json(
			{
				error: 'Une erreur est survenue lors de la création du compte.',
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
