import { ClientStatus } from '@/generated/prisma';

export const statusColors: Record<ClientStatus, string> = {
	LEAD: 'hsl(200, 70%, 45%)',
	SIGNED: 'hsl(140, 60%, 40%)',
	LOST: 'hsl(0, 65%, 50%)',
	ARCHIVED: 'hsl(0, 0%, 50%)',
};
