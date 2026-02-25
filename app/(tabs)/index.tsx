// Home.tsx

import { useUser } from "@/contexts/user-context";
import OwnersHome from "../views/home/owners";
import RenterHome from "../views/home/renter";
import React from "react";

const Home = () => {
  const { userType } = useUser();

  if (userType === "renter") {
    return <RenterHome />;
  }

  return <OwnersHome />;
};

export default Home;
