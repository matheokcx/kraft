import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
};
const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

export default withNextIntl(nextConfig);
