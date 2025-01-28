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

interface UserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logOutUser: () => void;
  localStorageAuthToken: string | null;
  loadingUser: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [localStorageAuthToken, setLocalStorageAuthToken] = useState<
    string | null
  >(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY));
  const [loadingUser, setLoadingUser] = useState(false);

  const logOutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  }, []);

  const fetchUser = async () => {
    if (!localStorageAuthToken) return;
    try {
      setLoadingUser(true);
      const data = await getCurrentUser(localStorageAuthToken);
      const userData = data.data;

      if (userData) {
        setUser(userData);
        localStorage.setItem(
          AUTH_LOCAL_STORAGE_KEY,
          JSON.stringify({
            access_token: localStorageAuthToken,
            user: userData,
          }),
        );
      } else {
        logOutUser();
      }
      setLoadingUser(false);
    } catch (error) {
      setLoadingUser(false);
      console.error('Error fetching user data:', error);
      logOutUser();
    }
  };

  useEffect(() => {
    if (localStorageAuthToken) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [localStorageAuthToken]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      localStorageAuthToken,
      logOutUser,
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
