import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prismaClient } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { enforceRateLimit, getClientIp } from '@/lib/rateLimit';
import { User } from '@/types';

export async function GET(request: NextRequest) {
	const limited = enforceRateLimit(`me:${getClientIp(request)}`, 30, 60_000);

	if (limited) {
		return limited;
	}

	const session = await getServerSession(authOptions);

	if (!session || !session?.user?.id) {
		return NextResponse.json({ error: "Vous n'êtes pas connecté" }, { status: 401 });
	}

	const currentUser: User | null = await prismaClient.user.findUnique({
		where: {
			id: Number(session.user.id),
		},
	});

	if (!currentUser) {
		return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
	}

	const { password, ...userWithoutPassword } = currentUser;

	return NextResponse.json(userWithoutPassword, { status: 200 });
}
