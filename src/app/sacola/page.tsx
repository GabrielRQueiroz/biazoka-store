'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { UserContext } from '@/context/UserContext';
import { Coins, Trash } from '@phosphor-icons/react';
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
		<main className="flex flex-row flex-wrap gap-4 bg-base-100 p-8 py-32 sm:px-24">
			<section className="flex flex-1 flex-col gap-4">
				{cartItems.map((product) => (
					<div
						key={product.id}
						className="card-compact card card-side bg-base-100 shadow-lg"
					>
						<figure className="relative h-full w-24 flex-1">
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
							<h2 className="card-title text-base-content">
								{product.name}
							</h2>
							<div className="mt-2 flex grow items-center justify-between gap-8">
								<div className="flex flex-col justify-start gap-2">
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
								<div className="card-actions justify-end">
									<button
										onClick={() => removeFromCart(product.id)}
										type="button"
										disabled={product.quantity === 0 || !user}
										className={clsx(
											'btn-primary btn-outline btn-md btn text-primary-content md:btn-sm',
											product.quantity === 0 && 'btn-disabled',
										)}
									>
										Remover do carrinho{' '}
										<Trash className="inline" size={24} />
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</section>
			<aside className="flex-grow-0">
				<div className="card shadow-xl">
					<div className="card-body">
						<h2 className="card-title">Total</h2>
						<p className="text-center text-2xl">{cartTotal}</p>
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
									'btn-secondary btn',
									cartItemsCount === 0 ||
										!user ||
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
                              Tem CERTEZA ABSOLUTA de que você quer comprar esses itens?
									</p>
									<div className="modal-action">
										<button onClick={buyCartItems} className="btn btn-outline btn-primary">
											Comprar
										</button>
										<button className="btn btn-warning text-warning-content">Cancelar</button>
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
