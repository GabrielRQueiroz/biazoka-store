'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { UserContext } from '@/context/UserContext';
import { Coins, ShoppingBag, SignOut, Warehouse } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

export const Navbar = () => {
	return (
		<div className="fixed z-10 flex w-full justify-center bg-base-100 shadow">
			<nav className="navbar h-24 max-w-7xl px-4 text-base-content sm:h-28 sm:px-8">
				<div className="h-full flex-1">
					<Link
						href="/"
						className="btn-ghost btn relative aspect-square h-full md:aspect-video"
					>
						<Image
							className="pointer-events-none object-contain px-1 py-1 md:px-2"
							src="/biazoka-store.webp"
							alt="Logo da Biazoka Store"
							fill
						/>
					</Link>
				</div>
				<div className="flex-none gap-2 sm:gap-4">
					<div 
							data-tip="Armazém"
					className="tooltip-bottom tooltip">
						<Link
							className="btn-ghost btn-circle btn"
							href="/armazem"
							>
							<Warehouse className="" size={32} />
						</Link>
					</div>
					<NavbarCart />
					<NavbarUser />
				</div>
			</nav>
		</div>
	);
};

const NavbarCart = () => {
	const { cartItemsCount, cartTotal } = useContext(ProductsContext);

	return (
		<div className="dropdown-end dropdown">
			<label tabIndex={0} className="btn-ghost btn-circle btn">
				<div className="indicator">
					<ShoppingBag size={32} />
					<span className="badge badge-neutral badge-sm indicator-item">
						{cartItemsCount}
					</span>
				</div>
			</label>
			<div
				tabIndex={0}
				className="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow ring-1 ring-black ring-opacity-5"
			>
				<div className="card-body">
					<span className="text-lg font-bold">{cartItemsCount} Items</span>
					<span className="mb-2 text-info">
						Subtotal: <Coins size={20} className="inline" /> {cartTotal}
					</span>
					<div className="card-actions">
						<Link href="/sacola" className="btn-primary btn-block btn">
							Ver sacola
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

const NavbarUser = () => {
	const { user, login, logout, authLoading } = useContext(UserContext);

	return user ? (
		<div className="dropdown-end dropdown">
			<label tabIndex={0} className="btn-ghost btn-circle avatar btn">
				<div className="relative aspect-square w-10 rounded-full">
					<Image
						fill
						alt="Sua foto de usuário"
						className="object-cover"
						src={user.photoUrl}
					/>
				</div>
			</label>
			<div
				tabIndex={0}
				className="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow ring-1 ring-black ring-opacity-5"
			>
				<div className="card-body">
					<h4 className="text-lg font-bold">{user.name}</h4>
					<span className="-mt-1 mb-2 text-neutral">
						Biedas: <Coins size={20} className="inline" /> {user.balance}
					</span>
					<div className="card-actions">
						<button
							className="btn-block btn"
							onClick={logout}
							type="button"
						>
							Sair <SignOut size={16} />
						</button>
					</div>
				</div>
			</div>
		</div>
	) : (
		<button
			disabled={authLoading}
			onClick={login}
			type="button"
			className={clsx('btn-primary btn px-5', authLoading && 'btn-disabled')}
		>
			{authLoading ? (
				<span className="loading loading-spinner"></span>
			) : (
				'Entrar'
			)}
		</button>
	);
};
