'use client';

import { ProductsContext } from '@/context/ProductsContext';
import { UserContext } from '@/context/UserContext';
import { Coins, ShoppingBag, SignOut } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

export const Navbar = () => {
	return (
		<nav className="navbar fixed z-10 h-28 bg-base-100 px-2 text-base-content shadow sm:px-8">
			<div className="h-full flex-1">
				<Link
					href="/"
					className="btn-ghost btn relative aspect-video h-full"
				>
					<Image
						className="object-contain px-1 md:px-2 py-1 pointer-events-none"
						src="/biazoka-store.webp"
						alt="Logo da Biazoka Store"
						fill
					/>
				</Link>
			</div>
			<div className="flex-none gap-4">
				<NavbarCart />
				<NavbarUser />
			</div>
		</nav>
	);
};

const NavbarCart = () => {
	const { cartItemsCount, cartTotal } = useContext(ProductsContext);

	return (
		<div className="dropdown-end dropdown">
			<label tabIndex={0} className="btn-ghost btn-circle btn">
				<div className="indicator">
					<ShoppingBag size={32} />
					<span className="badge badge-primary badge-sm indicator-item">
						{cartItemsCount}
					</span>
				</div>
			</label>
			<div
				tabIndex={0}
				className="card dropdown-content ring-1 ring-black ring-opacity-5 card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
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
				className="card dropdown-content ring-1 ring-black ring-opacity-5 card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
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
