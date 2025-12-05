// Home.tsx

import { useUser } from "@/contexts/user-context";
import OwnersHome from "../views/home/owners";
import RenterHome from "../views/home/renter";

const Home = () => {
  const { userType } = useUser();

  if (userType === "tenant") {
    return <RenterHome />;
  }

  return <OwnersHome />;
};

export default Home;
