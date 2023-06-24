'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { FoodTypes, ProductType } from '@/lib/types';
import {
	CaretDown,
	Check,
	CoinVertical,
	ForkKnife,
	ImageSquare,
	MagnifyingGlass,
	Minus,
	Package,
	Plus,
	Trash,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

export default function WarehouseList() {
	const { productsList } = useContext(ProductsContext);

	return (
		<div className="relative mx-auto flex w-full max-w-7xl flex-row flex-wrap justify-center gap-4">
			{productsList.length > 0 ? (
				productsList.map((product) => <ItemCard product={product} key={product.id} />)
			) : (
				<div className="loading-spinner self-center"></div>
			)}
			<div className="sticky bottom-[5%] z-[8] flex w-full basis-full justify-end">
				<button
					onClick={() => {
						const dialog = document.getElementById('item_creation') as HTMLDialogElement;
						dialog.showModal();
					}}
					className="btn-neutral btn shadow"
				>
					Criar <ForkKnife className="inline" size={24} />
				</button>
			</div>
			<ItemCreation />
		</div>
	);
}

const ItemCard = ({ product }: { product: ProductType }) => {
	const [productName, setProductName] = useState<string>(product.name);
	const [outdated, setOutdated] = useState<boolean>(false);
	const {
		handleFoodTypeChange,
		handleFoodRename,
		handleImageUrlChange,
		handlePriceChange,
		handleQuantityChange,
		deleteFood,
	} = useContext(ProductsContext);

	useEffect(() => {
		if (productName !== product.name) {
			setOutdated(true);
		} else {
			setOutdated(false);
		}
	}, [productName, product.name]);

	return (
		<div
			key={product.id}
			className="card-bordered card card-compact max-w-[280px] flex-1 basis-full bg-base-100 shadow-lg sm:card-side sm:max-w-lg"
		>
			<figure className="group relative aspect-square h-auto w-full sm:h-full sm:w-auto">
				<button className="absolute left-0 top-0 z-[5] flex h-full w-full items-center justify-center bg-neutral bg-opacity-70 text-neutral-content opacity-0 duration-100 ease-in-out group-hover:opacity-100">
					<ImageSquare size={64} />
				</button>
				<Image
					fill
					src={product.imageUrl}
					alt={product.name}
					className="pointer-events-none object-contain sm:object-cover"
				/>
			</figure>
			<div className="card-body relative gap-3">
				<button
					className="btn-ghost btn-sm btn-circle btn absolute right-0 top-0 z-[5] mr-4 mt-3 text-error"
					onClick={() => {
						const dialog = document.getElementById('delete_confirmation') as HTMLDialogElement;
						dialog.showModal();
					}}
				>
					<Trash size={20} />
				</button>
				<dialog id="delete_confirmation" className="modal modal-bottom sm:modal-middle">
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
							<li key={id}>
								<button onClick={() => handleFoodTypeChange(foodType, product.id)}>{foodType}</button>
							</li>
						))}
					</ul>
				</div>
				<h2 className="group/name card-title my-1 text-base-content">
					<div className="indicator">
						<input
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

const ItemCreation = () => {
	const [imageMethod, setImageMethod] = useState<'IMAGEM' | 'PESQUISA'>('IMAGEM');
	const [imageQuery, setImageQuery] = useState<string>('');
	const [product, setProduct] = useState<Omit<ProductType, 'id'>>({
		name: '',
		imageUrl: '',
		category: '',
		price: 1,
		quantity: 1,
	});
	const { createFood } = useContext(ProductsContext);

	return (
		<dialog id="item_creation" className="modal modal-bottom sm:modal-middle">
			<form method="dialog" className="modal-box">
				<h3 className="text-lg font-bold">Criar novo item</h3>
				<div className="form-control w-full text-base-content">
					<label className="label mt-2">
						<span className="label-text">Nome</span>
					</label>
					<input
						onChange={(e) => {
							setProduct({
								...product,
								name: e.target.value,
							});
						}}
						type="text"
						placeholder="Nome aqui 👈"
						className="input-bordered input w-full"
					/>
					<label className="label mt-2">
						<span className="label-text">Categoria</span>
					</label>
					<select
						title="Tipo de alimento"
						onChange={(e) => {
							setProduct({
								...product,
								category: e.target.value,
							});
						}}
						className="select-bordered select"
					>
						<option disabled selected>
							Escolha um
						</option>
						{Object.values(FoodTypes).map((foodType, id) => (
							<option key={id}>{foodType}</option>
						))}
					</select>

					<label className="label mt-2">
						<span className="label-text">Imagem</span>
					</label>
					<div className="tabs mb-4">
						<button
							type="button"
							onClick={() => setImageMethod('IMAGEM')}
							className={clsx('tab-bordered tab flex-1', imageMethod === 'IMAGEM' && 'tab-active')}
						>
							Enviar 📷
						</button>
						<button
							type="button"
							onClick={() => setImageMethod('PESQUISA')}
							className={clsx('tab-bordered tab flex-1', imageMethod === 'PESQUISA' && 'tab-active')}
						>
							Pesquisar 🔍
						</button>
					</div>

					{imageMethod === 'IMAGEM' ? (
						<>
							<input
								type="file"
								onChange={(e) => {
									e.preventDefault();
								}}
								capture="environment"
								accept="image/*"
								className="file-input-bordered file-input w-full"
							/>
							<div className="relative mx-auto aspect-square w-1/3 p-4"></div>
						</>
					) : (
						<>
							<div className="join">
								<input
									onChange={(e) => setImageQuery(e.target.value)}
									type="search"
									placeholder="Procure seu item 🔍"
									className="input-bordered input join-item w-full"
								/>
								<button onClick={(e) => {
										e.preventDefault();
									}} className="join-item btn rounded-r-full">
									<MagnifyingGlass size={24} />
								</button>
							</div>
							<div className="carousel-center carousel rounded-box p-4 md:carousel-vertical md:aspect-square md:overflow-y-scroll">
								<div className="carousel-item relative aspect-square basis-1/3 md:basis-0"></div>
								<div className="carousel-item relative aspect-square basis-1/3 md:basis-0"></div>
								<div className="carousel-item relative aspect-square basis-1/3 md:basis-0"></div>
							</div>
						</>
					)}
				</div>
				<div className="modal-action">
					<button
						disabled={product.name === '' || product.category === '' || product.imageUrl === ''}
						onClick={() => createFood(product)}
						className="btn-neutral btn"
					>
						Criar
					</button>
					<button className="btn-ghost btn-outline btn">Cancelar</button>
				</div>
			</form>
		</dialog>
	);
};
