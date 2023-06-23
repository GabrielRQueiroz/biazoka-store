import { Navbar } from '@/components';
import { ProductsProvider } from '@/context/ProductsContext';
import { UserProvider } from '@/context/UserContext';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	applicationName: 'Biazoka Store',
	openGraph: {
		type: 'website',
		locale: 'pt_BR',
		url: 'https://biazoka-store.vercel.app/',
		siteName: 'Biazoka Store',
		description: 'A loja da Bia 💖',
		images: [
			{
				url: 'https://biazoka-store.vercel.app/og.webp',
				width: 1024,
				height: 1024,
			},
		],
	},
	title: {
		template: '%s | Biazoka Store 🛍️',
		default: 'Biazoka Store 🛍️',
	},
	description: 'A loja da Bia 💖',
	manifest: '/site.webmanifest',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR" data-theme="valentine">
			<UserProvider>
				<ProductsProvider>
					<body className={inter.className}>
						<Navbar />
						{children}
					</body>
				</ProductsProvider>
			</UserProvider>
		</html>
	);
}
