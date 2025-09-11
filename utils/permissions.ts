export const tabItems = [
  {
    name: "index",
    label: "Home",
    activeIcon: require("../assets/icons/home-active.png"),
    inactiveIcon: require("../assets/icons/home.png"),
    grantPermission: ["tenant", "owner"],
  },
  {
    name: "discover",
    label: "Discover",
    activeIcon: require("../assets/icons/discovery-active.png"),
    inactiveIcon: require("../assets/icons/discovery.png"),
    grantPermission: ["tenant"],
  },
  {
    name: "spaces",
    label: "Spaces",
    activeIcon: require("../assets/icons/spaces-active.png"),
    inactiveIcon: require("../assets/icons/spaces.png"),
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
    activeIcon: require("../assets/icons/chat-active.png"),
    inactiveIcon: require("../assets/icons/chat.png"),
    grantPermission: ["tenant", "owner"],
  },
  {
    name: "activity",
    label: "Activity",
    activeIcon: require("../assets/icons/activity-active.png"),
    inactiveIcon: require("../assets/icons/activity.png"),
    grantPermission: ["tenant", "owner"],
  },
];
