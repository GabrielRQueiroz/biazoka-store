'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { UserContext } from '@/context/UserContext';
import { Coins } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext } from 'react';

export default function Home() {
	const { productsList, addToCart } = useContext(ProductsContext);
	const { user } = useContext(UserContext);

	return (
		<main className="flex min-h-screen items-start justify-center bg-base-100 p-8 py-32 sm:px-20">
			<div className="flex max-w-7xl flex-row flex-wrap justify-center gap-4">
				{productsList.length > 0 ? (
					productsList.map((product) => (
						<div
							key={product.id}
							className="card card-compact max-w-xs flex-1 bg-base-100 shadow-lg"
						>
							<figure className="relative pointer-events-none  aspect-square">
								<div className="badge badge-neutral absolute right-0 top-0 z-[5] mr-2 mt-2">
									{product.quantity}x
								</div>
								<Image
									fill
									src={product.imageUrl}
									alt={product.name}
									className="object-contain"
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
								<div className="mt-2 flex grow items-center justify-between gap-10">
									<p className="flex items-center gap-1 text-base text-base-content">
										<Coins size={24} />
										<span>{product.price}</span>
									</p>
									<div className="card-actions justify-end">
										<button
											onClick={() => addToCart(product.id)}
											disabled={product.quantity === 0 || !user}
											className={clsx(
												'btn-primary btn-sm btn',
												product.quantity === 0 &&
													'btn-disabled cursor-not-allowed',
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
