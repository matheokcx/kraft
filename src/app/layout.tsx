import type { Metadata } from 'next';
import './globals.css';
import SessionWrapper from '@/components/Layout/SessionWrapper';
import { Inter, Poppins } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { NextFont } from 'next/dist/compiled/@next/font';
import { Toaster } from 'react-hot-toast';

const inter: NextFont = Inter({ subsets: ['latin'] });
const poppins: NextFont = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

export const metadata: Metadata = {
	title: process.env.APP_NAME,
	description:
		"Kraft est une application type 'CRM' qui va vous permettre de pouvoir centraliser et gérer vos clients et vos projets plus simplement à un seul endroit.",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<html lang="fr">
			<body className={`${inter.className} ${poppins.className}`}>
				<SessionWrapper>
					<NextIntlClientProvider>
						<Toaster />
						{children}
					</NextIntlClientProvider>
				</SessionWrapper>
			</body>
		</html>
	);
};

export default RootLayout;
