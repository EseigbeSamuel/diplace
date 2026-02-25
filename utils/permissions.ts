export const tabItems = (isDarkMode: boolean) => [
  {
    name: "index",
    label: "Home",
    activeIcon: isDarkMode
      ? require("../assets/icons/home-white-active.png")
      : require("../assets/icons/home-active.png"),
    inactiveIcon: isDarkMode
      ? require("../assets/icons/home-white.png")
      : require("../assets/icons/home.png"),
    grantPermission: ["renter", "owner"],
  },
  {
    name: "discover",
    label: "Discover",
    activeIcon: isDarkMode
      ? require("../assets/icons/discovery-white-active.png")
      : require("../assets/icons/discovery-active.png"),
    inactiveIcon: isDarkMode
      ? require("../assets/icons/discovery-white-inactive.png")
      : require("../assets/icons/discovery.png"),
    grantPermission: ["renter"],
  },
  {
    name: "spaces",
    label: "Spaces",
    activeIcon: isDarkMode
      ? require("../assets/icons/spaces-white-active.png")
      : require("../assets/icons/spaces-active.png"),
    inactiveIcon: isDarkMode
      ? require("../assets/icons/spaces-white-inactive.png")
      : require("../assets/icons/spaces.png"),
    grantPermission: ["owner"],
  },
  {
    name: "add",
    label: "Add",
    activeIcon: require("../assets/icons/plus-rounded.png"),
    inactiveIcon: require("../assets/icons/plus-rounded.png"),
    grantPermission: ["owner"],
  },
  {
    name: "chats",
    label: "Chats",
    activeIcon: isDarkMode
      ? require("../assets/icons/chat-white-active.png")
      : require("../assets/icons/chat-active.png"),
    inactiveIcon: isDarkMode
      ? require("../assets/icons/chat-white-inactive.png")
      : require("../assets/icons/chat.png"),
    grantPermission: ["renter", "owner"],
  },
  {
    name: "activity",
    label: "Activity",
    activeIcon: isDarkMode
      ? require("../assets/icons/activity-inactive-light.png")
      : require("../assets/icons/activity-active.png"),
    inactiveIcon: isDarkMode
      ? require("../assets/icons/activity-light-inactive.png")
      : require("../assets/icons/activity.png"),
    grantPermission: ["renter", "owner"],
  },
];
