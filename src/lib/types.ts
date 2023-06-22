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