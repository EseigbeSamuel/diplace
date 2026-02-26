// hooks/inspection/useCreateInspection.ts
import { postRequest } from "@/services";
import {
  CreateInspectionResponse,
  InspectionPayload,
} from "@/types/screens/inspection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export const useCreateInspection = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: createInspection,
    mutateAsync: createInspectionAsync,
    isPending: isCreatingInspection,
    isError: isCreateInspectionError,
    error: createInspectionError,
    isSuccess: isCreateInspectionSuccess,
  } = useMutation({
    mutationFn: async ({
      propertyId,
      payload,
    }: {
      propertyId: string;
      payload: InspectionPayload;
    }) => {
      return await postRequest<CreateInspectionResponse, InspectionPayload>({
        url: `/inspection/inspections`,
        payload,
        protectedRoute: true,
      });
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({
        queryKey: ["property-inspections", data.property.public_id],
      });
    },
    onError: (error) => {
      console.error("Failed to create inspection:", error);
    },
  });

  return {
    createInspection,
    createInspectionAsync,
    isCreatingInspection,
    isCreateInspectionError,
    createInspectionError,
    isCreateInspectionSuccess,
  };
};
