'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { Coins } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext } from 'react';

export default function Home() {
	const { productsList, addToCart } = useContext(ProductsContext);

	return (
		<main className="flex min-h-screen items-start justify-center bg-base-100 p-8 py-32 sm:px-20">
			<div className="flex max-w-7xl w-full flex-row flex-wrap justify-center gap-4">
				{productsList.length > 0 ? (
					productsList.map((product) => (
						<div
							key={product.id}
							className="card card-compact max-w-[240px] flex-1 bg-base-100 shadow-lg"
						>
							<figure className="pointer-events-none relative aspect-square">
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
									<p className="badge badge-ghost grow-0">
										{product.category}
									</p>
								</div>
								<h2 className="card-title text-base-content">
									{product.name}
								</h2>
								<div className="mt-2 flex items-center justify-between">
									<p className="mr-4 flex items-center gap-1 text-base text-base-content">
										<Coins size={24} />
										<span>{product.price}</span>
									</p>
									<div className="card-actions justify-end">
										<button
											onClick={() => addToCart(product.id)}
											disabled={product.quantity === 0}
											className={clsx(
												'btn-neutral btn-sm btn h-full',
												product.quantity === 0 &&
													'cursor-not-allowed',
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
