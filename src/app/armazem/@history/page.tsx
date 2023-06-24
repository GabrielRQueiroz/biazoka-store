'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { Coins } from '@phosphor-icons/react';
import Image from 'next/image';
import { useContext } from 'react';

export default function HistoryList() {
	const { historyList } = useContext(ProductsContext);

	return (
		<div className="mx-auto w-full  max-w-7xl overflow-x-auto">
			<table className="table-xs table md:table-sm lg:table-md">
				<thead>
					<tr>
						<th>Nome</th>
						<th>Compra</th>
						<th>Horário</th>
					</tr>
				</thead>
				<tbody>
					{historyList.map((historyItem) => (
						<tr key={historyItem.user.id}>
							<td>
								<div className="flex items-center">
									<div className="avatar mr-3">
										<div className="mask mask-squircle relative h-10 w-10 md:h-12 md:w-12">
											<Image
												fill
												className="object-contain"
												src={historyItem.user.photoUrl}
												alt={historyItem.user.name}
											/>
										</div>
									</div>
									<div className="whitespace-nowrap">
										<div className="font-bold">{historyItem.user.name}</div>
										<p className="text-xs">
											Tinha {historyItem.user.balance} <Coins className="inline" size={16} />
										</p>
									</div>
								</div>
							</td>
							<td>
								<ul>
									{historyItem.products.map((product) => (
										<li className="whitespace-nowrap" key={product.id}>
											{product.quantity}x {product.name}
										</li>
									))}
								</ul>
							</td>
							<td className="w-full whitespace-nowrap text-xs uppercase sm:text-sm">
								<span>
									{historyItem.timestamp}
								</span>
							</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<th>Nome</th>
						<th>Compra</th>
						<th>Horário</th>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}
