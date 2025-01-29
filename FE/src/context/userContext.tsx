import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { User } from '../types/userTypes';
import { AUTH_LOCAL_STORAGE_KEY } from '../constants/globalConstants';
import { getCurrentUser } from '../services/userService';
import useSpotify from '../hooks/useSpotify';

interface UserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logOutUser: () => void;
  localStorageAuthToken: string | null;
  loadingUser: boolean;
  fetchUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { initSpotify } = useSpotify();
  const [localStorageAuthToken, setLocalStorageAuthToken] = useState<
    string | null
  >(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY));
  const [loadingUser, setLoadingUser] = useState(false);

  const logOutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!localStorageAuthToken || user?.authToken || loadingUser) return;

    try {
      setLoadingUser(true);
      const data = await getCurrentUser(localStorageAuthToken);
      const userData = data.data;

      if (userData) {
        setUser({ ...userData, authToken: localStorageAuthToken });
        await initSpotify();
      } else {
        logOutUser(); // Log out if no user data is found
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logOutUser();
    } finally {
      setLoadingUser(false);
    }
  }, [localStorageAuthToken, user?.authToken, loadingUser, logOutUser]);

  useEffect(() => {
    if (localStorageAuthToken) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      localStorageAuthToken,
      logOutUser,
      fetchUser,
      loadingUser,
    }),
    [user, setUser, localStorageAuthToken, logOutUser, loadingUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
