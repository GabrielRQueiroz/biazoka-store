'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { UserContext } from '@/context/UserContext';
import { ProductType } from '@/lib/types';
import { CoinVertical, Coins, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext } from 'react';

export default function Bag() {
	const { user } = useContext(UserContext);
	const {
		removeFromCart,
		cartTotal,
		cartItemsCount,
		cartItems,
		buyCartItems,
	} = useContext(ProductsContext);

	return (
		<main className="flex flex-row flex-wrap gap-4 bg-base-100 p-6 py-32 sm:px-16 md:px-20">
			<section className="flex flex-1 flex-col gap-4">
				{cartItems.map((product) => (
					<CartCard key={product.id} product={product} removeFromCart={removeFromCart} />
				))}
			</section>
			<aside className="grow-1 w-full sm:w-auto sm:grow-0">
				<div className="card card-compact shadow-xl sm:card-normal">
					<div className="card-body">
						<h2 className="card-title text-base-content">Resumo</h2>
						<div className="overflow-x-auto">
							<table className="table-xs table sm:table-sm">
								<thead>
									<tr>
										<th>Item</th>
										<th>Preço</th>
									</tr>
								</thead>

								<tbody>
									{cartItems.map((product) => (
										<tr
											className="text-base-content"
											key={product.id}
										>
											<td className="text-ellipsis">
												{product.name}
											</td>
											<td>
												<CoinVertical
													className="inline"
													size={16}
												/>
												{product.price * product.quantity}{' '}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr className="text-base-content">
										<td>Total:</td>
										<td>
											<Coins className="inline" size={16} />{' '}
											{cartTotal}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>

						<div className="card-actions justify-center">
							<button
								type="button"
								disabled={
									!user ||
									user.balance < cartTotal ||
									cartItemsCount === 0
								}
								onClick={() => {
									const dialog = document.getElementById(
										'purchase_confirmation',
									) as HTMLDialogElement;
									dialog.showModal();
								}}
								className={clsx(
									'btn mt-4',
									!user ||
										cartItemsCount === 0 ||
										(user.balance < cartTotal &&
											'cursor-not-allowed'),
								)}
							>
								{user && user.balance < cartTotal ? (
									<>Saldo insuficiente</>
								) : (
									<>Finalizar compra</>
								)}
							</button>

							<dialog id="purchase_confirmation" className="modal">
								<form method="dialog" className="modal-box">
									<h3 className="text-lg font-bold">COMPRAR ITENS</h3>
									<p className="py-4">
										Tem CERTEZA ABSOLUTA de que você quer comprar
										esses itens?
									</p>
									<div className="modal-action">
										<button
											onClick={buyCartItems}
											className="btn-primary btn-outline btn"
										>
											Comprar
										</button>
										<button className="btn-warning btn text-warning-content">
											Cancelar
										</button>
									</div>
								</form>
							</dialog>
						</div>
					</div>
				</div>
			</aside>
		</main>
	);
}

const CartCard = ({
	product,
	removeFromCart,
}: {
	product: ProductType;
	removeFromCart: (id: string) => void;
}) => {
	return (
		<div
			key={product.id}
			className="card-compact card bg-base-100 shadow-lg md:card-side"
		>
			<figure className="relative aspect-square h-40 w-full md:h-full md:w-40">
				<Image
					fill
					src={product.imageUrl}
					alt={product.name}
					className="pointer-events-none object-cover object-center"
				/>
			</figure>
			<div className="card-body">
				<div className="flex flex-row items-center justify-between">
					<p className="badge badge-neutral grow-0 text-neutral-content">
						{product.category}
					</p>
				</div>
				<h2 className="card-title text-base-content">{product.name}</h2>
				<div className="mt-2 flex grow flex-wrap items-end justify-between gap-4 md:gap-8">
					<div className="flex-0 flex flex-col-reverse justify-start gap-2 sm:flex-col">
						{product.quantity > 0 && (
							<p className="badge badge-neutral badge-outline grow-0 text-neutral-content">
								{product.quantity}x
							</p>
						)}
						<span className="text-base-content">
							<Coins className="inline" size={24} />{' '}
							{product.price * product.quantity}
						</span>
					</div>
					<div className="flex-0 card-actions justify-end">
						<button
							onClick={() => removeFromCart(product.id)}
							type="button"
							disabled={product.quantity === 0}
							className={clsx(
								'btn-primary btn-sm btn w-full text-xs text-primary-content md:text-sm',
								product.quantity === 0 && 'btn-disabled',
							)}
						>
							Remover <Trash className="inline" size={24} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
