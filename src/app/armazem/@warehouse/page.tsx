'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { ForkKnife } from '@phosphor-icons/react';
import { useContext } from 'react';
import { ItemCard } from './ItemCard';
import { ItemCreation } from './ItemCreation';

export default function WarehouseList() {
	const { productsList } = useContext(ProductsContext);

	return (
		<div className="relative mx-auto flex w-full max-w-7xl flex-row flex-wrap justify-center gap-4">
			{productsList.length > 0 ? (
				productsList.map((product) => <ItemCard product={product} key={product.id} />)
			) : (
				<div className="loading-spinner self-center"></div>
			)}
			<div className="pointer-events-none sticky bottom-[5%] z-[8] flex w-full basis-full justify-end">
				<button
					onClick={() => {
						const dialog = document.getElementById('item_creation') as HTMLDialogElement;
						dialog.showModal();
					}}
					className="btn-neutral btn pointer-events-auto shadow"
				>
					Criar <ForkKnife className="inline" size={24} />
				</button>
			</div>
			<ItemCreation />
		</div>
	);
}
