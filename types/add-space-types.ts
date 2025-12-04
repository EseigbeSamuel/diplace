export interface LocationData {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface CapacityData {
    caps?: string
    bathrooms?: number;
    kitchens?: number;
    rooms?: number;
    roomSize?: string;
    changingRooms?: number;
}

export interface SpaceDescriptionData {
    title?: string;
    description?: string
}

export interface MediaItem {
    uri: string;
    type: "image" | "video";
    id: string;
}
export interface AgreementFile {
    uri: string;
    name: string;
    size: number;
}

export interface TourVideo {
    uri: string;
    roomName: string;
    duration: number;
}

export type SpaceType = "apartment" | "event" | "shop" | "office" | null;

export interface BankDetails {
    accountName: string;
    accountNumber: string;
    bank: string;
}

export interface OwnerDetails {
    fullName?: string;
    phoneNumber?: string;
}
export interface InspectionTimeItem {
    id: string;
    startTime: string;
    endTime: string;
    label: string;
    selected: boolean;
}

export type InspectionTime = InspectionTimeItem[];

export interface RentalCost {
    maxRentPayout?: string;
    rentDuration?: string;
    rentalCost?: string
};

export interface ChargeItem {
    id: string;
    title: string;
    description: string;
    value: string;
    editable: boolean;
}


export type Charge = ChargeItem[];