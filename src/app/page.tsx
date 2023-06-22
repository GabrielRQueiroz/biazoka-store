'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { UserContext } from '@/context/UserContext';
import { Coins } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext } from 'react';

export default function Home() {
	const { productsList, addToCart, } = useContext(ProductsContext);
	const { user } = useContext(UserContext);

	return (
		<main className="flex min-h-screen items-start justify-center bg-base-100 p-8 py-32 sm:px-24">
			<div className="flex max-w-7xl flex-row flex-wrap justify-center gap-4">
				{productsList.length > 0 ? (
					productsList.map((product) => (
						<div
							key={product.id}
							className="card card-compact max-w-xs flex-1 bg-base-100 shadow-lg"
						>
							<figure className="relative aspect-square">
								<Image
									fill
									src={product.imageUrl}
									alt={product.name}
									className="pointer-events-none object-contain"
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
									<span className="text-base-content">
										<Coins className="inline" size={24} />{' '}
										{product.price}
									</span>
									<div className="card-actions justify-end">
										<button
											onClick={() => addToCart(product.id)}
											disabled={product.quantity === 0 || !user}
											className={clsx(
												'btn-primary btn-sm btn',
												product.quantity === 0 && 'btn-disabled',
											)}
										>
											{product.quantity === 0
												? 'Esgotado'
												: 'Comprar'}
										</button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="spinner"></div>
				)}
			</div>
		</main>
	);
}
