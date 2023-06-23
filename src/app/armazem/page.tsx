'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { UserContext } from '@/context/UserContext';
import { Coins } from '@phosphor-icons/react';
import Link from 'next/link';
import { useContext, useState } from 'react';

export default function Warehouse() {
	const { accessAsAdmin, isAdmin } = useContext(UserContext);
	const { historyList } = useContext(ProductsContext);
	const [password, setPassword] = useState<string>('');

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
					<h1 className='text-3xl font-bold text-center mb-4'>Estoque</h1>
					<div className="divider" />
					<h2 className='text-2xl font-bold text-center mt-8 mb-4'>Histórico</h2>
					<div className="mx-auto w-full overflow-x-auto">
						<table className="table-xs table md:table-sm lg:table-md">
							<thead>
								<tr>
									<th>Nome</th>
									<th>Compra</th>
									<th>Dia</th>
								</tr>
							</thead>
							<tbody>
								{historyList.map((historyItem) => (
									<tr key={historyItem.user.id}>
										<td>
											<div className="flex items-center">
												<div className="avatar mr-3">
													<div className="mask mask-squircle h-10 w-10 md:h-12 md:w-12">
														<img
															src={historyItem.user.photoUrl}
															alt={historyItem.user.name}
														/>
													</div>
												</div>
												<div className="whitespace-nowrap">
													<div className="font-bold">
														{historyItem.user.name}
													</div>
													<p className="text-xs">
														Tinha {historyItem.user.balance}{' '}
														<Coins className="inline" size={16} />
													</p>
												</div>
											</div>
										</td>
										<td>
											<ul>
												{historyItem.products.map((product) => (
													<li
														className="whitespace-nowrap"
														key={product.id}
													>
														{product.quantity}x {product.name}
													</li>
												))}
											</ul>
										</td>
										<td className="whitespace-nowrap w-full text-xs sm:text-sm uppercase">
											<span>{historyItem.date}
											</span>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr>
									<th>Nome</th>
									<th>Compra</th>
									<th>Horário</th>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			)}
		</main>
	);
}
