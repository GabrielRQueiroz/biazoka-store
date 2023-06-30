import { ProductsContext } from '@/context/ProductsContext';
import { handleImageSearch } from '@/lib/imageSearch';
import { MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useContext, useState } from 'react';

export const ImageEdition = ({ productId }: { productId: string }) => {
	const [imageMethod, setImageMethod] = useState<'IMAGEM' | 'PESQUISA'>('PESQUISA');
	const [imageQuery, setImageQuery] = useState<string>('');
	const [imageList, setImageList] = useState<string[]>([]);
	const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>('');
	const { handleImageUrlChange } = useContext(ProductsContext);

	const onImageSearch = async () => {
		setLoadingSearch(true);
		await handleImageSearch(imageQuery)
			.then((response) => setImageList(response))
			.finally(() => setLoadingSearch(false));
	};

	return (
		<dialog id={`${productId}-edition`} className="modal modal-bottom z-40 sm:modal-middle">
			<form method="dialog" className="modal-box">
				<div className="form-control w-full text-base-content">
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
												setImageUrl(image);
											}}
											type="button"
											key={`${image}-${id}-${productId}`}
											className={clsx(
												'carousel-item relative mx-0.5 my-1 aspect-square basis-1/3 border-2 shadow hover:brightness-95 md:basis-auto',
												image === imageUrl && 'rounded-sm border-primary',
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
						disabled={!imageUrl}
						onClick={() => {
                     handleImageUrlChange(imageUrl, productId)
                     setImageUrl('');
                     setImageQuery('');
                     setImageList([]);
							;(document?.getElementById(`${productId}-edition`) as HTMLDialogElement).close();
                  }}
						className="btn-neutral btn"
					>
						Editar
					</button>
					<button className="btn-ghost btn-outline btn">Cancelar</button>
				</div>
			</form>
		</dialog>
	);
};
