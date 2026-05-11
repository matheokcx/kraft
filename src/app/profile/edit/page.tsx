'use server';
import ProfileForm from '@/components/UI/Forms/ProfileForm/ProfileForm';
import { prismaClient } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const ProfileEditPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		redirect('/sign-in');
	}

	const user = await prismaClient.user.findUnique({
		where: { id: Number(session.user.id) },
	});

	if (!user) {
		return null;
	}

	return (
		<main
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<ProfileForm user={user} />
		</main>
	);
};

export default ProfileEditPage;
