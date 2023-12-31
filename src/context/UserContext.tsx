'use client';

import { auth, authProvider, database } from '@/lib/firebase';
import { UserType } from '@/lib/types';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { get, onValue, ref, set } from 'firebase/database';
import nookies from 'nookies';
import { ReactNode, createContext, useEffect, useState } from 'react';

type AuthContextProviderProps = {
	children?: ReactNode;
};

type AuthContextType = {
	user: UserType | undefined;
	authLoading: boolean;
	login: () => void;
	logout: () => void;
};

export const UserContext = createContext({} as AuthContextType);

export const UserProvider = ({ children }: AuthContextProviderProps) => {
	const [user, setUser] = useState<UserType>();
	const [authLoading, setAuthLoading] = useState<boolean>(true);

	useEffect(
		() =>
			auth.onIdTokenChanged(async (user) => {
				if (!user) {
					nookies.set(undefined, 'token', '', { path: '/' });
				} else {
					const token = await user.getIdToken();
					nookies.set(undefined, 'token', token, { path: '/' });
				}
			}),
		[],
	);

	useEffect(() => {
		const handle = setInterval(async () => {
		  const user = auth.currentUser;
		  if (user) await user.getIdToken(true);
		}, 10 * 60 * 1000);
  
		// clean up setInterval
		return () => clearInterval(handle);
	 }, []);

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

	return (
		<UserContext.Provider
			value={{
				user,
				login,
				logout,
				authLoading,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
