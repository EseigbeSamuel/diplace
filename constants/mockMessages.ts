interface Message {
    id: string;
    text: string;
    timestamp: string;
    isUser: boolean;
    type?: "text" | "property" | "system";
    replyTo?: string;
    propertyData?: {
        title: string;
        price: string;
        location: string;
        image: string;
    };
}
export const mockMessages: Message[] = [
    {
        id: "1",
        text: "Today",
        timestamp: "",
        isUser: false,
        type: "system",
    },
    {
        id: "2",
        text: "",
        timestamp: "14:02",
        isUser: false,
        type: "property",
        propertyData: {
            title: "2 Bedroom in-suite apartment",
            price: "₦200,000",
            location: "Road 13, Tony Estate, Port Harcourt",
            image:
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
    },
    {
        id: "3",
        text: "Please I love this apartment. Where exactly is it located.",
        timestamp: "14:03",
        isUser: true,
    },
    {
        id: "4",
        text: "At Rumuewhara",
        timestamp: "14:04",
        isUser: false,
    },
    {
        id: "5",
        text: "I already scheduled inspection.",
        timestamp: "14:05",
        isUser: true,
    },
    {
        id: "6",
        text: "Yes, I got the notification",
        timestamp: "14:07",
        isUser: false,
    },
    {
        id: "7",
        text: "I already scheduled inspection.",
        timestamp: "14:08",
        isUser: true,
        replyTo: "6",
    },
    {
        id: "8",
        text: "Please I will be running late. Can we reschedule the inspection?",
        timestamp: "14:09",
        isUser: false,
    },
];