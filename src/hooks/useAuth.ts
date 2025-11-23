import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseClient';

interface CSSPData {
  board: string;
  boardNumber: string;
  profession: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface UserData {
  role: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  clinicAddress?: string;
  verified?: boolean;
  cssp?: CSSPData;
  location?: LocationData;
  reviewStatus?: string;
  createdAt?: any;
  uid?: string;
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userData: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Obtener datos adicionales del usuario desde Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setAuthState({
              user,
              userData: {
                ...userData,
                email: user.email || '',
              },
              loading: false,
              isAdmin: userData.role === 'admin',
            });
          } else {
            setAuthState({
              user,
              userData: null,
              loading: false,
              isAdmin: false,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthState({
            user,
            userData: null,
            loading: false,
            isAdmin: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          userData: null,
          loading: false,
          isAdmin: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    ...authState,
    logout,
  };
};
