import { Navbar } from '@/components';
import { ProductsProvider } from '@/context/ProductsContext';
import { UserProvider } from '@/context/UserContext';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Biazoka Store 🛍️',
	description: 'A loja da Bia 💖',
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
