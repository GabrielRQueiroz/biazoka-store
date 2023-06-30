import { ProductsContext } from '@/context/ProductsContext';
import { handleImageSearch } from '@/lib/imageSearch';
import { FoodTypes, ProductType } from '@/lib/types';
import { MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext, useState } from 'react';

export const ItemCreation = () => {
	const [imageMethod, setImageMethod] = useState<'IMAGEM' | 'PESQUISA'>('PESQUISA');
	const [imageQuery, setImageQuery] = useState<string>('');
	const [imageList, setImageList] = useState<string[]>([]);
	const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
	const [product, setProduct] = useState<Omit<ProductType, 'id'>>({
		name: '',
		imageUrl: '',
		category: '',
		price: 1,
		quantity: 1,
	});
	const { createFood } = useContext(ProductsContext);

	const onImageSearch = async () => {
		setLoadingSearch(true);
		await handleImageSearch(imageQuery)
			.then((response) => setImageList(response))
			.finally(() => setLoadingSearch(false));
	};

	return (
		<dialog id="item_creation" className="modal modal-bottom z-40 sm:modal-middle">
			<form method="dialog" className="modal-box">
				<h3 className="text-lg font-bold">Criar novo item</h3>
				<div className="form-control w-full text-base-content">
					<label className="label mt-2">
						<span className="label-text">Nome</span>
					</label>
					<input
						maxLength={40}
						onChange={(e) => {
							setProduct({
								...product,
								name: e.target.value,
							});
						}}
                  value={product.name}
						type="text"
						placeholder="Nome aqui 👈"
						className="input-bordered input w-full"
					/>
					<label className="label mt-2">
						<span className="label-text">Categoria</span>
					</label>
					<select
						title="Tipo de alimento"
                  value={product.category}
						onChange={(e) => {
							setProduct({
								...product,
								category: e.target.value,
							});
						}}
						className="select-bordered select"
					>
						<option value="" disabled>
							Escolha um
						</option>
						{Object.values(FoodTypes).map((foodType, id) => (
							<option key={`${foodType}-${id}`}>{foodType}</option>
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
									maxLength={30}
									onChange={(e) => setImageQuery(e.target.value)}
                           value={imageQuery}
									type="search"
									placeholder="Procure seu item 🔍"
									className="input-bordered input join-item w-full"
								/>
								<button
									onClick={(e) => {
										e.preventDefault();
										onImageSearch();
									}}
									disabled={loadingSearch || imageQuery === ''}
									className="join-item btn rounded-r-full"
								>
									{loadingSearch ? (
										<span className="loading loading-spinner" />
									) : (
										<MagnifyingGlass size={24} />
									)}
								</button>
							</div>
							<div className="carousel-center carousel rounded-box overflow-x-scroll p-4 md:carousel-vertical md:mx-20 md:aspect-square md:overflow-x-auto md:overflow-y-scroll">
								{loadingSearch ? (
                           <div className="flex h-full items-center justify-center">
                              <span className="loading loading-dots text-primary mx-auto w-16" />
                           </div>
								) : (
									imageList.map((image, id) => (
										<button
											onClick={(e) => {
												e.preventDefault();
												setProduct({
													...product,
													imageUrl: image,
												});
											}}
											type="button"
											key={`${image}-${id}`}
											className={clsx(
												'carousel-item relative mx-0.5 my-1 aspect-square basis-1/3 border-2 shadow hover:brightness-95 md:basis-auto',
												image === product.imageUrl && 'rounded-sm border-primary',
											)}
										>
											<Image src={image} fill alt="" className="object-cover" />
										</button>
									))
								)}
							</div>
						</>
					)}
				</div>
				<div className="modal-action">
					<button
                  type='submit'
						disabled={product.name === '' || product.category === '' || product.imageUrl === ''}
						onClick={() => {
							createFood(product);
							setProduct({
								name: '',
								category: '',
								imageUrl: '',
								quantity: 1,
								price: 1,
							});
							setImageQuery('');
							setImageList([]);
							;(document?.getElementById('item_creation') as HTMLDialogElement).close();
						}}
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
