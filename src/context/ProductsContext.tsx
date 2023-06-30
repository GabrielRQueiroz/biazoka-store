'use client';

import { database } from '@/lib/firebase';
import { CartItemType, FoodTypes, HistoryEntryType, ProductType } from '@/lib/types';
import { get, onValue, ref, remove, set, update } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from './UserContext';

type ProductsContextType = {
	cartItemsCount: number;
	cartTotal: number;
	cartItems: CartItemType[];
	addToCart: (productId: string) => void;
	removeFromCart: (productId: string) => void;
	productsList: ProductType[];
	buyCartItems: () => void;
	historyList: HistoryEntryType[];
	handlePriceChange: (action: 'INCREASE' | 'DECREASE', productId: string) => void;
	handleQuantityChange: (action: 'INCREASE' | 'DECREASE', productId: string) => void;
	handleImageUrlChange: (imageUrl: string, productId: string) => void;
	handleFoodTypeChange: (type: FoodTypes, productId: string) => void;
	handleFoodRename: (name: string, productId: string) => void;
	deleteFood: (productId: string) => void;
	createFood: (product: Omit<ProductType, 'id'>) => void;
};

export const ProductsContext = createContext({} as ProductsContextType);

export const ProductsProvider = ({ children }: any) => {
	const router = useRouter();
	const { user } = useContext(UserContext);
	const [cartItemsCount, setCartItemsCount] = useState<number>(0);
	const [cartTotal, setCartTotal] = useState<number>(0);
	const [cartItems, setCartItems] = useState<CartItemType[]>([]);
	const [productsList, setProductsList] = useState<ProductType[]>([]);
	const [historyList, setHistoryList] = useState<HistoryEntryType[]>([]);

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
					const { category, imageUrl, price, name }: ProductType = productsList.find(
						(product) => product.id === cartItem.key,
					)!;

					cartItems.push({
						id: cartItem.key,
						...cartItem.val(),
						price,
						category,
						imageUrl,
						name,
					});

					setCartItemsCount(cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0));
					setCartTotal(cartItems.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0));

					setCartItems(cartItems);
				});
			});
		}
	}, [user, productsList]);

	useEffect(() => {
		const historyRef = ref(database, `history`);

		onValue(historyRef, (snapshot) => {
			const history: HistoryEntryType[] = [];

			if (!snapshot.exists()) {
				setHistoryList([]);
				return;
			}

			snapshot.forEach((historyItem) => {
				history.push({
					id: historyItem.key,
					...historyItem.val(),
					timestamp: new Date(historyItem.val().timestamp).toLocaleTimeString('pt-BR', {
						weekday: 'long',
						day: 'numeric',
						month: 'long',
						year: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
						second: undefined,
					}),
				});
			});

			history.sort().reverse();

			setHistoryList(history);
		});
	}, []);

	const addToCart = async (productId: string) => {
		if (user) {
			const productRef = ref(database, `products/${productId}`);

			await get(productRef).then((snapshot) => {
				if (snapshot.exists() && snapshot.val().quantity > 0) {
					const { price, quantity }: ProductType = snapshot.val();

					const cartItemRef = ref(database, `users/${user.id}/cart/${productId}`);

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

			toast.success('Produto adicionado à sacola', {
				position: 'bottom-center',
			});
		} else {
			toast.error('Entre com uma conta para poder comprar 👉🚪', {
				duration: 3000
			});
		}
	};

	const removeFromCart = (productId: string) => {
		if (user) {
			const cartItemRef = ref(database, `users/${user.id}/cart/${productId}`);
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

			const historyEntry: Omit<HistoryEntryType, 'entryId'> = {
				user: {
					...user,
				},
				timestamp: Date.now(),
				products: cartItems,
				cost: cartTotal,
			};

			await get(cartRef).then((snapshot) => {
				if (snapshot.exists()) {
					const purchaseId = uuidv4();

					snapshot.forEach((cartItem) => {
						const { price, quantity }: CartItemType = cartItem.val();

						update(userRef, {
							balance: user.balance - price * quantity,
						});
					});

					set(ref(database, `history/${purchaseId}`), historyEntry);
				}
			});

			remove(cartRef);

			toast.success(`Compra realizada com sucesso! 🥳`, {
				position: 'bottom-center',
				duration: 10000,
				className: 'alert alert-primary',
			});

			router.refresh();
		}
	};

	const handlePriceChange = (action: string, productId: string) => {
		const productRef = ref(database, `products/${productId}`);

		get(productRef).then((product) => {
			if (product.exists()) {
				const { price }: ProductType = product.val();

				if (action === 'INCREASE') {
					update(productRef, {
						price: price + 1,
					});
				} else {
					update(productRef, {
						price: price - 1,
					});
				}
			}
		});
	};

	const handleQuantityChange = (action: string, productId: string) => {
		const productRef = ref(database, `products/${productId}`);

		get(productRef).then((product) => {
			if (product.exists()) {
				const { quantity }: ProductType = product.val();

				if (action === 'INCREASE') {
					update(productRef, {
						quantity: quantity + 1,
					});
				} else {
					update(productRef, {
						quantity: quantity - 1,
					});
				}
			}
		});
	};

	const handleFoodTypeChange = (type: FoodTypes, productId: string) => {
		const productRef = ref(database, `products/${productId}`);

		update(productRef, {
			category: type,
		});
	};

	const handleFoodRename = (name: string, productId: string) => {
		const productRef = ref(database, `products/${productId}`);

		update(productRef, {
			name,
		});

		toast.success('O novo nome foi salvo 👍');
	};

	const handleImageUrlChange = (imageUrl: string, productId: string) => {
		const productRef = ref(database, `products/${productId}`);

		update(productRef, {
			imageUrl,
		});

		toast.success('A imagem foi alterada 🖼️');
	};

	const deleteFood = (productId: string) => {
		const productRef = ref(database, `products/${productId}`);

		remove(productRef);
		toast.success('O novo nome foi apagado (para sempre) 🗑️');
	};

	const createFood = (product: Omit<ProductType, 'id'>) => {
		const productId = uuidv4();

		const productRef = ref(database, `products/${productId}`);

		set(productRef, {
			...product,
			id: productId,
		});

		toast.success('O novo produto foi criado 🥳', {
			duration: 5000,
		});
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
				historyList,
				handlePriceChange,
				handleQuantityChange,
				handleImageUrlChange,
				handleFoodTypeChange,
				handleFoodRename,
				deleteFood,
				createFood,
			}}
		>
			<Toaster />
			{children}
		</ProductsContext.Provider>
	);
};
