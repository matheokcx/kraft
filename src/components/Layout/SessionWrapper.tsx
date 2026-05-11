'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

type SessionWraperProps = {
	children: ReactNode;
};

const SessionWraper = ({ children }: SessionWraperProps) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWraper;
