export type ProductType = {
   id: string;
	name: string;
	price: number;
	imageUrl: string;
	category: string;
	quantity: number;
};

export type CartItemType = {
   quantity: number
} & ProductType;

export type UserType = {
   id: string;
   name: string;
   photoUrl: string;
   balance: number;
   cart: CartItemType[];
}

export type HistoryEntryType = {
   entryId: string;
   user: Omit<UserType, 'cart'>;
   timestamp: number;
   products: ProductType[];
   cost: number;
}

export enum FoodTypes {
   'Fast food' = 'Fast food 🍔',
   'Refeição' =  'Refeição 🍛',
   'Salgado' =  'Salgado 🥟',
   'Bebida' =  'Bebida 🥤',
   'Doce' =  'Doce 🍩',
   'Lanche' =  'Lanche 🥪',
}