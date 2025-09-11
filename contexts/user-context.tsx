import React, { createContext } from "react";

export type UserType = "tenant" | "owner";

interface UserContextType {
  userType: UserType;
  setUserType: (userType: UserType) => void;
}

const UserContext = createContext<undefined | UserContextType>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = (props: UserProviderProps) => {
  const [userType, setUserType] = React.useState<UserType>("owner");

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
