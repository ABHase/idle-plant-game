// TraitsContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the type for TraitsContext
interface TraitsContextType {
  selectedTraits: string[];
  unselectedTraits: string[];
  setSelectedTraits: React.Dispatch<React.SetStateAction<string[]>>;
  setUnselectedTraits: React.Dispatch<React.SetStateAction<string[]>>;
}

// Define the type for props accepted by TraitsProvider
interface TraitsProviderProps {
  children: ReactNode;
}

// Create the context
const TraitsContext = createContext<TraitsContextType | undefined>(undefined);

// Define the TraitsProvider component
export const TraitsProvider: React.FC<TraitsProviderProps> = ({ children }) => {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [unselectedTraits, setUnselectedTraits] = useState<string[]>([]);

  useEffect(() => {}, [selectedTraits, unselectedTraits]);

  const value = {
    selectedTraits,
    unselectedTraits,
    setSelectedTraits,
    setUnselectedTraits,
  };

  return (
    <TraitsContext.Provider value={value}>{children}</TraitsContext.Provider>
  );
};

export const useTraits = () => {
  const context = useContext(TraitsContext);
  if (!context) {
    throw new Error("useTraits must be used within a TraitsProvider");
  }
  return context;
};
