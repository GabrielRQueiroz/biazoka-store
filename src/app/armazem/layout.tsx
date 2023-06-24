'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export const metadata: Metadata = {
	title: 'Armazém',
};

export default function WarehouseLayout({
	warehouse,
	history,
}: {
	warehouse: React.ReactNode;
	history: React.ReactNode;
}) {
	const [password, setPassword] = useState<string>('');
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	useEffect(() => {
		accessAsAdmin();
	}, []);

	const accessAsAdmin = async (password?: string) => {
		const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
		const adminTimestamp = localStorage.getItem('adminTimestamp');
		const adminPersistance = 1000 * 60 * 10;

		if (
			(adminTimestamp && Date.now() < parseInt(adminTimestamp)) ||
			password === adminPassword
		) {
			localStorage.setItem(
				'adminTimestamp',
				(Date.now() + adminPersistance).toString(),
			);
			setIsAdmin(true);
			toast.success('Você entrou no armazém da Bia 👏', {
				duration: 2500,
			});
		} else if (password !== adminPassword) {
			toast.error('Senha incorreta 😿', {
				duration: 2500,
			});
		} else {
			toast("Você precisa da senha para entrar no armazém da Bia 🤨", {
				icon: "❗"
			})
		}
	};

	return (
		<main className="flex flex-row flex-wrap gap-4 bg-base-100 p-2 py-32 sm:px-8 md:px-16 lg:px-20">
			{!isAdmin ? (
				<dialog className="modal modal-open">
					<form
						method="dialog"
						className="modal-box"
						onSubmit={() => accessAsAdmin(password)}
					>
						<h3 className="text-lg font-bold">
							Bem-vindo ao armazém da Bia ✨
						</h3>
						<p className="py-4">
							Para acessar o armazém, você precisa usar a
							<span className="font-bold italic">
								🪄 senha super secreta da Bia 🪄
							</span>
							.
						</p>
						<div className="form-control w-full">
							<label className="label">
								<span className="label-text">Qual é a senha?</span>
							</label>
							<input
								placeholder="Senha aqui 👈"
								type="password"
								className="input-bordered input w-full"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="modal-action">
							<Link href="/" replace className="btn-link btn">
								Voltar 😿
							</Link>
							<button type="submit" className="btn-neutral btn">
								Pronto 👍
							</button>
						</div>
					</form>
				</dialog>
			) : (
				<div className="w-full text-base-content">
					<h1 className="mb-4 text-center text-3xl font-bold">Estoque</h1>
					{warehouse}
					<div className="divider" />
					<h2 className="mb-4 mt-8 text-center text-2xl font-bold">
						Histórico
					</h2>
					{history}
				</div>
			)}
		</main>
	);
}
