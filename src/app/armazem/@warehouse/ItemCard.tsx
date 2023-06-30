import { ProductsContext } from '@/context/ProductsContext';
import { FoodTypes, ProductType } from '@/lib/types';
import { CaretDown, Check, CoinVertical, ImageSquare, Minus, Package, Plus, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { ImageEdition } from './ImageEdition';

export const ItemCard = ({ product }: { product: ProductType }) => {
	const [productName, setProductName] = useState<string>(product.name);
	const [outdated, setOutdated] = useState<boolean>(false);
	const { handleFoodTypeChange, handleFoodRename, handleQuantityChange, handlePriceChange, deleteFood } =
		useContext(ProductsContext);

	useEffect(() => {
		if (productName !== product.name) {
			setOutdated(true);
		} else {
			setOutdated(false);
		}
	}, [productName, product.name]);

	return (
		<div className="card-bordered card card-compact max-w-[280px] flex-1 basis-full bg-base-100 shadow-lg sm:card-side sm:max-w-lg">
			<figure className="group relative aspect-square h-auto w-full sm:h-full sm:w-auto">
				<button
					onClick={() => {
						const dialog = document.getElementById(`${product.id}-edition`) as HTMLDialogElement;
						dialog.showModal();
					}}
					className="absolute left-0 top-0 z-[5] flex h-full w-full items-center justify-center bg-neutral bg-opacity-70 text-neutral-content opacity-0 duration-100 ease-in-out group-hover:opacity-100"
				>
					<ImageSquare size={64} />
				</button>
				<Image
					fill
					src={product.imageUrl}
					alt={product.name}
					className="pointer-events-none object-contain sm:object-cover"
				/>
			</figure>
			<ImageEdition productId={product.id} />
			<div className="card-body relative gap-3">
				<button
					className="btn-ghost btn-sm btn-circle btn absolute right-0 top-0 z-[5] mr-4 mt-3 text-error"
					onClick={() => {
						const dialog = document.getElementById(`delete_confirmation-${product.id}`) as HTMLDialogElement;
						dialog.showModal();
					}}
				>
					<Trash size={20} />
				</button>
				<dialog id={`delete_confirmation-${product.id}`} className="modal modal-bottom sm:modal-middle">
					<form method="dialog" className="modal-box">
						<h3 className="text-lg font-bold">APAGAR ITEM 😱</h3>
						<p className="py-4">
							Tem CERTEZA ABSOLUTA de que você quer <span className="font-bold italic text-red-700">apagar</span>{' '}
							esse item PARA SEMPRE?
						</p>
						<div className="modal-action">
							<button onClick={() => deleteFood(product.id)} className="btn-outline btn">
								Deletar
							</button>
							<button className="btn">Cancelar</button>
						</div>
					</form>
					<form method="dialog" className="modal-backdrop">
						<button>fechar</button>
					</form>
				</dialog>

				<div className="dropdown-bottom dropdown">
					<label tabIndex={0} className="btn-base-200 btn-xs btn grow-0">
						{product.category} <CaretDown size={16} />
					</label>
					<ul
						tabIndex={0}
						className="dropdown-content menu rounded-box z-[1] w-52 bg-base-100 p-2 shadow-lg ring-1 ring-black ring-opacity-10"
					>
						{Object.values(FoodTypes).map((foodType, id) => (
							<li key={`type-${product.id + id}`}>
								<button onClick={() => handleFoodTypeChange(foodType, product.id)}>{foodType}</button>
							</li>
						))}
					</ul>
				</div>
				<h2 className="group/name card-title my-1 text-base-content">
					<div className="indicator">
						<input
							maxLength={40}
							type="text"
							value={productName}
							onChange={(e) => setProductName(e.target.value)}
							placeholder="Escreva um nome"
							className={clsx('input-ghost input input-sm w-full max-w-xs text-lg', outdated && 'input-warning')}
						/>
						{outdated && (
							<span className="indicator-center badge badge-warning indicator-item visible text-warning-content group-focus-within/name:invisible">
								Não salvo
							</span>
						)}
					</div>
					<button
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							handleFoodRename(productName, product.id);
						}}
						className="btn-ghost btn-outline btn-sm btn-circle btn invisible group-focus-within/name:visible"
					>
						<Check />
					</button>
				</h2>
				<div className="card-actions flex flex-col justify-start gap-2">
					<div className="flex w-full max-w-sm items-center justify-between">
						<p className="whitespace-nowrap font-bold text-base-content">
							<CoinVertical className="mr-1 inline" size={24} />
							Preço:
						</p>
						<div className="flex items-center gap-2">
							<p className="font-base badge">{product.price}</p>
							<button
								disabled={product.price <= 1}
								onClick={() => handlePriceChange('DECREASE', product.id)}
								className={clsx('btn-sm btn-circle btn text-red-700')}
							>
								<Minus size={16} />
							</button>
							<button
								disabled={product.price >= 99}
								onClick={() => handlePriceChange('INCREASE', product.id)}
								className="btn-sm btn-circle btn text-emerald-700"
							>
								<Plus size={16} />
							</button>
						</div>
					</div>
					<div className="flex w-full max-w-sm items-center justify-between">
						<p className="whitespace-nowrap font-bold text-base-content">
							<Package className="mr-1 inline" size={24} />
							Quantidade:
						</p>
						<div className="flex items-center gap-2">
							<p className="font-base badge">{product.quantity}</p>
							<button
								disabled={product.quantity <= 1}
								onClick={() => handleQuantityChange('DECREASE', product.id)}
								className={clsx('btn-sm btn-circle btn text-red-700')}
							>
								<Minus size={16} />
							</button>
							<button
								disabled={product.quantity >= 99}
								onClick={() => handleQuantityChange('INCREASE', product.id)}
								className="btn-sm btn-circle btn text-emerald-700"
							>
								<Plus size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
