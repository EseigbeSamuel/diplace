import { useGetCurrentUser } from "@/hooks";
import { UserType } from "@/types";
import { router } from "expo-router";
import React, { createContext, useEffect, useState } from "react";

interface UserContextType {
  userType: UserType;
  setUserType: (userType: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userType, setUserType] = useState<UserType>("renter");
  const { currentUser, isCurrentUserLoading } = useGetCurrentUser();

  // Update userType when currentUser changes
  useEffect(() => {
    if (currentUser?.user_type) {
      setUserType(currentUser.user_type);
      return;
    }

    if (!isCurrentUserLoading) {
      setUserType("renter");
    }
  }, [currentUser, isCurrentUserLoading]);

  // Handle redirect properly inside useEffect
  useEffect(() => {
    if (!isCurrentUserLoading && !currentUser) {
      router.replace("/auth/login");
    }
  }, [isCurrentUserLoading, currentUser]);

  // Optional: show nothing or splash while loading
  // if (isCurrentUserLoading || !userType) {
  //   return; // or a loading component/
  // }

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
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
