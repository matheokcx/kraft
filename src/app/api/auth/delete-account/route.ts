import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prismaClient } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const DELETE = async (): Promise<NextResponse | null> => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		return NextResponse.json({}, { status: 401 });
	}

	await prismaClient.user.delete({
		where: {
			id: Number(session.user.id),
		},
	});

	const cookieStore = await cookies();
	cookieStore.delete('next-auth.csrf-token');
	cookieStore.delete('next-auth.session-token');

	redirect('/sign-in');
};
