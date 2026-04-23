// import {
//     AgreementFile,
//     BankDetails,
//     CapacityData,
//     Charge,
//     ChargeItem,
//     InspectionTime,
//     LocationData,
//     MediaItem,
//     OwnerDetails,
//     RentalCost,
//     SpaceDescriptionData,
//     SpaceType,
//     TourVideo
// } from "@/types/add-space-types";
// import { PropertyListItem } from "@/types";

// import { create } from "zustand";

// export interface SpaceValue {
//     units?: number
//     eventSpace?: "indoor" | "outdoor";
//     location?: LocationData;
//     capacity?: CapacityData;
//     amenities?: string[];
//     description?: SpaceDescriptionData;
//     media?: MediaItem[];
//     tour?: TourVideo[];
//     owner?: "myself" | "3rdparty";
//     accountDetails?: BankDetails;
//     ownerDetails?: OwnerDetails
//     ownerAccountDetails?: BankDetails
//     inspectionFee?: number
//     inspectionTimeSlots?: InspectionTime
//     rentalCost?: RentalCost
//     otherCharges?: Charge
//     rentalAgreement?: AgreementFile | null
// }

// type PostSpaceState = {
//     spaceForm: {
//         type: SpaceType;
//         value: SpaceValue;
//     };
//     editingDraft: PropertyListItem | null;
//     previewProperty: PropertyListItem | null;
//     selectedPropertyDetails: PropertyListItem | null;
//     editContext: {
//         propertyId: string;
//         addressId: string;
//     } | null;

//     setType: (type: SpaceType) => void;
//     setValue: (data: Partial<SpaceValue>) => void;
//     setEditingDraft: (draft: PropertyListItem | null) => void;
//     setPreviewProperty: (property: PropertyListItem | null) => void;
//     setSelectedPropertyDetails: (property: PropertyListItem | null) => void;
//     setEditContext: (context: { propertyId: string; addressId: string } | null) => void;
//     clearForm: () => void;
// };

// export const useSpaceStore = create<PostSpaceState>((set) => ({
//     spaceForm: {
//         type: null,
//         value: {
//             media: [], accountDetails: {
//                 accountNumber: "8102934980",
//                 accountName: "ALEX IBE",
//                 bank: "ACCESS BANK PLC",
//             }, inspectionTimeSlots: [
//                 {
//                     id: "1",
//                     startTime: "10:00",
//                     endTime: "12:00",
//                     label: "Morning slot",
//                     selected: false,
//                 },
//                 {
//                     id: "2",
//                     startTime: "13:00",
//                     endTime: "15:00",
//                     label: "Afternoon slot",
//                     selected: false,
//                 },
//                 {
//                     id: "3",
//                     startTime: "16:00",
//                     endTime: "18:00",
//                     label: "Evening slot",
//                     selected: false,
//                 },
//             ], otherCharges: [
//                 {
//                     id: "1",
//                     title: "Platform fee",
//                     description: "DiPlace service charge.",
//                     value: "₦2,000",
//                     editable: false,
//                 },
//                 {
//                     id: "2",
//                     title: "Agent fee",
//                     description: "Your rental commission.",
//                     value: "0%",
//                     editable: true,
//                 },
//                 {
//                     id: "3",
//                     title: "Caution fee",
//                     description: "Refundable deposit.",
//                     value: "₦0",
//                     editable: true,
//                 },
//                 {
//                     id: "4",
//                     title: "Service charge",
//                     description: "Recurring fee for utilities.",
//                     value: "₦0",
//                     editable: true,
//                 },
//             ]
//         }
//     },
//     editingDraft: null,
//     previewProperty: null,
//     selectedPropertyDetails: null,
//     editContext: null,

//     setType: (type) =>
//         set((state) => {
//             const basePlatform: ChargeItem = {
//                 id: "1",
//                 title: "Platform fee",
//                 description: "DiPlace service charge.",
//                 value: "₦2,000",
//                 editable: false,
//             };

//             const agentFee: ChargeItem = {
//                 id: "2",
//                 title: "Agent fee",
//                 description: "Your rental commission.",
//                 value: "0%",
//                 editable: true,
//             };

//             const cautionFee: ChargeItem = {
//                 id: "3",
//                 title: "Caution fee",
//                 description: "Refundable deposit.",
//                 value: "₦0",
//                 editable: true,
//             };

//             const serviceCharge: ChargeItem = {
//                 id: "4",
//                 title: "Service charge",
//                 description: "Recurring fee for utilities.",
//                 value: "₦0",
//                 editable: true,
//             };

//             const updatedCharges =
//                 type === "event"
//                     ? [basePlatform, cautionFee]
//                     : [basePlatform, agentFee, cautionFee, serviceCharge];

//             return {
//                 spaceForm: {
//                     ...state.spaceForm,
//                     type,
//                     value: {
//                         ...state.spaceForm.value,
//                         otherCharges: updatedCharges,
//                     },
//                 },
//             };
//         }),

//     setValue: (data) =>
//         set((state) => ({
//             spaceForm: {
//                 ...state.spaceForm,
//                 value: {
//                     ...state.spaceForm.value,
//                     ...data
//                 }
//             }
//         })),

//     setEditingDraft: (draft) =>
//         set({
//             editingDraft: draft
//         }),

//     setPreviewProperty: (property) =>
//         set({
//             previewProperty: property
//         }),

//     setSelectedPropertyDetails: (property) =>
//         set({
//             selectedPropertyDetails: property
//         }),

//     setEditContext: (context) =>
//         set({
//             editContext: context
//         }),

//     clearForm: () =>
//         set({
//             spaceForm: {
//                 type: null,
//                 value: {
//                     media: []
//                 }
//             },
//             editingDraft: null,
//             previewProperty: null,
//             selectedPropertyDetails: null,
//             editContext: null
//         })
// }));
import { PropertyDraftItem, PropertyListItem } from "@/types";
import {
  AgreementFile,
  BankDetails,
  CapacityData,
  Charge,
  ChargeItem,
  InspectionTime,
  LocationData,
  MediaItem,
  OwnerDetails,
  RentalCost,
  SpaceDescriptionData,
  SpaceType,
  TourVideo,
} from "@/types/add-space-types";

import { create } from "zustand";

export interface SpaceValue {
  units?: number;
  eventSpace?: "indoor" | "outdoor";
  location?: LocationData;
  capacity?: CapacityData;
  amenities?: string[];
  description?: SpaceDescriptionData;
  media?: MediaItem[];
  tour?: TourVideo[];
  owner?: "myself" | "3rdparty";
  accountDetails?: BankDetails;
  ownerDetails?: OwnerDetails;
  ownerAccountDetails?: BankDetails;
  inspectionFee?: number;
  inspectionTimeSlots?: InspectionTime;
  rentalCost?: RentalCost;
  otherCharges?: Charge;
  rentalAgreement?: AgreementFile | null;
}

type PostSpaceState = {
  spaceForm: {
    type: SpaceType;
    value: SpaceValue;
  };
  editingDraft: PropertyListItem | PropertyDraftItem | null;
  previewProperty: PropertyListItem | null;
  selectedPropertyDetails: PropertyListItem | null;
  editContext: {
    propertyId: string;
    addressId: string;
  } | null;

  setType: (type: SpaceType) => void;
  setValue: (data: Partial<SpaceValue>) => void;
  setEditingDraft: (draft: PropertyListItem | PropertyDraftItem | null) => void;
  setPreviewProperty: (property: PropertyListItem | null) => void;
  setSelectedPropertyDetails: (property: PropertyListItem | null) => void;
  setEditContext: (
    context: { propertyId: string; addressId: string } | null,
  ) => void;
  clearForm: () => void;
};

export const useSpaceStore = create<PostSpaceState>((set) => ({
  spaceForm: {
    type: null,
    value: {
      media: [],
      accountDetails: {
        accountNumber: "8102934980",
        accountName: "ALEX IBE",
        bank: "ACCESS BANK PLC",
      },
      inspectionTimeSlots: [
        {
          id: "1",
          startTime: "10:00",
          endTime: "12:00",
          label: "Morning slot",
          selected: false,
        },
        {
          id: "2",
          startTime: "13:00",
          endTime: "15:00",
          label: "Afternoon slot",
          selected: false,
        },
        {
          id: "3",
          startTime: "16:00",
          endTime: "18:00",
          label: "Evening slot",
          selected: false,
        },
      ],
      otherCharges: [
        {
          id: "1",
          title: "Platform fee",
          description: "DiPlace service charge.",
          value: "₦2,000",
          editable: false,
        },
        {
          id: "2",
          title: "Agent fee",
          description: "Your rental commission.",
          value: "0%",
          editable: true,
        },
        {
          id: "3",
          title: "Caution fee",
          description: "Refundable deposit.",
          value: "₦0",
          editable: true,
        },
        {
          id: "4",
          title: "Service charge",
          description: "Recurring fee for utilities.",
          value: "₦0",
          editable: true,
        },
      ],
    },
  },
  editingDraft: null,
  previewProperty: null,
  selectedPropertyDetails: null,
  editContext: null,

  setType: (type) =>
    set((state) => {
      const basePlatform: ChargeItem = {
        id: "1",
        title: "Platform fee",
        description: "DiPlace service charge.",
        value: "₦2,000",
        editable: false,
      };

      const agentFee: ChargeItem = {
        id: "2",
        title: "Agent fee",
        description: "Your rental commission.",
        value: "0%",
        editable: true,
      };

      const cautionFee: ChargeItem = {
        id: "3",
        title: "Caution fee",
        description: "Refundable deposit.",
        value: "₦0",
        editable: true,
      };

      const serviceCharge: ChargeItem = {
        id: "4",
        title: "Service charge",
        description: "Recurring fee for utilities.",
        value: "₦0",
        editable: true,
      };

      const updatedCharges =
        type === "event"
          ? [basePlatform, cautionFee]
          : [basePlatform, agentFee, cautionFee, serviceCharge];

      return {
        spaceForm: {
          ...state.spaceForm,
          type,
          value: {
            ...state.spaceForm.value,
            otherCharges: updatedCharges,
          },
        },
      };
    }),

  setValue: (data) =>
    set((state) => ({
      spaceForm: {
        ...state.spaceForm,
        value: {
          ...state.spaceForm.value,
          ...data,
        },
      },
    })),

  setEditingDraft: (draft) =>
    set({
      editingDraft: draft,
    }),

  setPreviewProperty: (property) =>
    set({
      previewProperty: property,
    }),

  setSelectedPropertyDetails: (property) =>
    set({
      selectedPropertyDetails: property,
    }),

  setEditContext: (context) =>
    set({
      editContext: context,
    }),

  clearForm: () =>
    set({
      spaceForm: {
        type: null,
        value: {
          media: [],
        },
      },
      editingDraft: null,
      previewProperty: null,
      selectedPropertyDetails: null,
      editContext: null,
    }),
}));
