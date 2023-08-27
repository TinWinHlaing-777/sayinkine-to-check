import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Category from "../Category/Category";
import Dashboard from "../Dashboard/Dashboard";
import Home from "../Home/Home";
import Profile from "../Profile/Profile";
const HomeRoute = () => <Home />;

const CategoryRoute = () => <Category />;

const DashboardRoute = () => <Dashboard />;

const ProfileRoute = () => <Profile />;
const Navigation = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "home" },
    { key: "category", title: "Category", icon: "grid" },
    { key: "dashboard", title: "Dashboard", icon: "chart-line" },
    { key: "profile", title: "Setting", icon: "account-cog" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    category: CategoryRoute,
    dashboard: DashboardRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: "#2471A3" }}
    />
  );
};

export default Navigation;
