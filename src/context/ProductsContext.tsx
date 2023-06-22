'use client';

import { database } from '@/lib/firebase';
import { CartItemType, ProductType } from '@/lib/types';
import { get, onValue, ref, remove, set, update } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import {toast, Toaster} from 'react-hot-toast'

type ProductsContextType = {
	cartItemsCount: number;
	cartTotal: number;
	cartItems: CartItemType[];
	addToCart: (productId: string) => void;
	removeFromCart: (productId: string) => void;
	productsList: ProductType[];
	buyCartItems: () => void;
};

export const ProductsContext = createContext({} as ProductsContextType);

export const ProductsProvider = ({ children }: any) => {
	const router = useRouter();
	const { user } = useContext(UserContext);
	const [cartItemsCount, setCartItemsCount] = useState<number>(0);
	const [cartTotal, setCartTotal] = useState<number>(0);
	const [cartItems, setCartItems] = useState<CartItemType[]>([]);
	const [productsList, setProductsList] = useState<ProductType[]>([]);

	useEffect(() => {
		const productsRef = ref(database, `products`);

		get(productsRef).then((products) => {
			if (products.exists()) {
				const productsArray: ProductType[] = [];
				products.forEach((product) => {
					productsArray.push({
						...product.val(),
						id: product.key,
					});
				});
				setProductsList(productsArray);
			}
		});
	}, []);

	useEffect(() => {
		const productRef = ref(database, `products`);

		onValue(productRef, (snapshot) => {
			const productsArray: ProductType[] = [];
			snapshot.forEach((product) => {
				productsArray.push({
					...product.val(),
					id: product.key,
				});
			});
			setProductsList(productsArray);
		});
	}, []);

	useEffect(() => {
		if (user) {
			const cartRef = ref(database, `users/${user.id}/cart`);

			onValue(cartRef, (snapshot) => {
				const cartItems: CartItemType[] = [];

				if (!snapshot.exists()) {
					setCartItemsCount(0);
					setCartTotal(0);
					setCartItems([]);
					return;
				}

				snapshot.forEach((cartItem) => {
					const { category, imageUrl, name }: ProductType =
						productsList.find((product) => product.id === cartItem.key)!;

					cartItems.push({
						id: cartItem.key,
						...cartItem.val(),
						category,
						imageUrl,
						name,
					});

					setCartItemsCount(
						cartItems.reduce(
							(total, cartItem) => total + cartItem.quantity,
							0,
						),
					);
					setCartTotal(
						cartItems.reduce(
							(total, cartItem) =>
								total + cartItem.price * cartItem.quantity,
							0,
						),
					);

					setCartItems(cartItems);
				});
			});
		}
	}, [user, productsList]);

	const addToCart = async (productId: string) => {
		if (user) {
			const productRef = ref(database, `products/${productId}`);

			await get(productRef).then((snapshot) => {
				if (snapshot.exists() && snapshot.val().quantity > 0) {
					const { price, quantity }: ProductType = snapshot.val();

					const cartItemRef = ref(
						database,
						`users/${user.id}/cart/${productId}`,
					);

					get(cartItemRef)
						.then((cartItem) => {
							if (cartItem.exists()) {
								const newQuantity = cartItem.val().quantity + 1;
								update(cartItemRef, {
									price,
									quantity: newQuantity,
								});
							} else {
								set(cartItemRef, {
									price,
									quantity: 1,
								});
							}
						})
						.finally(() =>
							update(productRef, {
								quantity: quantity - 1,
							}),
						);
				}
			});

			toast.success('Produto adicionado à sacola')
		}
	};

	const removeFromCart = (productId: string) => {
		if (user) {
			const cartItemRef = ref(
				database,
				`users/${user.id}/cart/${productId}`,
			);
			const productRef = ref(database, `products/${productId}`);

			get(cartItemRef).then((cartItem) => {
				if (cartItem.exists()) {
					const { quantity }: CartItemType = cartItem.val();

					if (quantity > 1) {
						update(cartItemRef, {
							quantity: quantity - 1,
						});
					} else {
						remove(cartItemRef);
					}

					get(productRef).then((product) => {
						if (product.exists()) {
							const { quantity }: ProductType = product.val();

							update(productRef, {
								quantity: quantity + 1,
							});
						}
					});
				}
			});
		}
	};

	const buyCartItems = async () => {
		if (user) {
			if (user.balance < cartTotal) {
				return alert('Você precisa de mais moedas 😢');
			}

			const cartRef = ref(database, `users/${user.id}/cart`);
			const userRef = ref(database, `users/${user.id}`);

			await get(cartRef).then((snapshot) => {
				if (snapshot.exists()) {
					snapshot.forEach((cartItem) => {
						const { price, quantity }: CartItemType = cartItem.val();

						update(userRef, {
							balance: user.balance - price * quantity,
						});
					});
				}
			});

			remove(cartRef);

			toast.success(`Compra realizada com sucesso! 🥳`, {
				position: 'top-center',
				duration: 10000,
				className: 'alert alert-primary'
			});

			router.refresh();
		}
	};

	return (
		<ProductsContext.Provider
			value={{
				addToCart,
				removeFromCart,
				cartItemsCount,
				cartTotal,
				cartItems,
				productsList,
				buyCartItems,
			}}
		>
			<Toaster />
			{children}
		</ProductsContext.Provider>
	);
};
