import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

interface SpotifyContextValue {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const SpotifyContext = createContext<SpotifyContextValue | null>(null);

interface SpotifyProviderProps {
  children: ReactNode;
}

export const SpotifyProvider: React.FC<SpotifyProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string>('');

  const value = useMemo(() => ({ token, setToken }), [token]);

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

export const useSpotifyContext = (): SpotifyContextValue => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotifyContext must be used within a SpotifyProvider');
  }
  return context;
};
