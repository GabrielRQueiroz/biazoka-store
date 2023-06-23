'use client';

import { auth, authProvider, database } from '@/lib/firebase';
import { UserType } from '@/lib/types';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { get, onValue, ref, set } from 'firebase/database';
import { ReactNode, createContext, useEffect, useState } from 'react';

type AuthContextProviderProps = {
	children?: ReactNode;
};

type AuthContextType = {
	user: UserType | undefined;
	isAdmin: boolean;
	authLoading: boolean;
	accessAsAdmin: (password: string) => void;
	login: () => void;
	logout: () => void;
};

export const UserContext = createContext({} as AuthContextType);

export const UserProvider = ({ children }: AuthContextProviderProps) => {
	const [user, setUser] = useState<UserType>();
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [authLoading, setAuthLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (user) {
				const { displayName, photoURL, uid } = user;

				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.');
				}

				const userRef = ref(database, `users/${uid}`);
				await get(userRef).then((snapshot) => {
					if (snapshot.exists()) {
						setUser({
							id: uid,
							...snapshot.val(),
						});
					} else {
						setUser({
							id: uid,
							name: displayName,
							photoUrl: photoURL,
							balance: 10,
							cart: [],
						});
					}
				});
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (user) {
			const userRef = ref(database, `users/${user?.id}`);

			onValue(userRef, (snapshot) => {
				setUser({
					id: user.id,
					...snapshot.val(),
				});
			});
		}
	}, [user?.balance]);

	useEffect(() => {
		if (!user) {
			setAuthLoading(false);
		} else {
			setAuthLoading(true);
		}
	}, [user]);

	const login = async () => {
		await signInWithPopup(auth, authProvider).then(async (result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;

			const user = result.user;

			if (!user.displayName || !user.photoURL) {
				throw new Error('Missing information from Google Account.');
			}

			const userRef = ref(database, `users/${user.uid}`);
			await get(userRef).then((snapshot) => {
				if (!snapshot.exists()) {
					set(userRef, {
						name: user.displayName,
						photoUrl: user.photoURL,
						balance: 10,
						cart: [],
					});
				}
			});
		});
	};

	const logout = async () => {
		await signOut(auth).then(() => {
			setUser(undefined);
		});
	};

	const accessAsAdmin = async (password: string) => {
		const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

		if (password === adminPassword) {
			setIsAdmin(true);
		}
	}

	return (
		<UserContext.Provider
			value={{
				user,
				isAdmin,
				login,
				logout,
				accessAsAdmin,
				authLoading,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
