export const Notes = [
  {
    id: "1",
    title: "Payment successful",
    date: "24 mins ago",
    desc: "Your payment of ₦1,004,800 was completed successfully.",
    type: "",
    action: "Download receipt",
    unread: true,
  },
  {
    id: "2",
    title: "Inspection scheduled",
    date: "30th jul, 2025",
    desc: "Your inspection is confirmed for Wed. 9th August, 2025 within 10AM - 12PM.",
    type: "bell",
    action: "View schedule",
    unread: true,
  },
  {
    id: "3",
    title: "Reminder",
    date: "30th jul, 2025",
    desc: "Complete your booking within 10 minutes to secure your space.",
    type: "bell",
    action: "Complete booking",
    unread: false,
  },

  {
    id: "4",
    title: "Listing Alert",
    date: "30th jul, 2025",
    desc: "New apartment listing now available in Yaba.",
    type: "",
    action: "View listing",
    unread: false,
  },
  //   {
  //     title: "",
  //     date: "30th jul, 2025",
  //     desc: "",
  //     type: "",
  //     action: "",
  //   },
];

export const NotesTabs = [
  { id: "1", name: "all", icons: "" },
  { id: "2", name: "unread", icons: "" },
  { id: "3", name: "Previous", icons: "" },
  {
    id: "4",
    name: "date",
    icons: require("@/assets/icons/calender-light.png"),
  },
];
