import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type BottomSheetModalProps = Omit<
  React.ComponentProps<typeof BottomSheetModal>,
  "children"
>;
