import { postRequest } from "@/services";
import { UploadFilesResponse } from "@/types";

export type UploadAsset = {
  uri: string;
  type: string;
  name?: string;
};

const getExtFromUri = (uri: string): string => {
  const cleanUri = uri.split("?")[0] || "";
  const lastDot = cleanUri.lastIndexOf(".");
  if (lastDot === -1) return "";
  return cleanUri.slice(lastDot + 1).toLowerCase();
};

export const getMimeFromExt = (ext: string, fallback: string): string => {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
    mp4: "video/mp4",
    mov: "video/quicktime",
    m4v: "video/x-m4v",
    pdf: "application/pdf",
  };
  return map[ext] || fallback;
};

export const buildUploadFormData = (assets: UploadAsset[]) => {
  const formData = new FormData();

  assets.forEach((item, index) => {
    const ext =
      getExtFromUri(item.uri) || (item.type.startsWith("video") ? "mp4" : "jpg");
    const mime = item.type || getMimeFromExt(ext, "application/octet-stream");
    const name = item.name || `upload-${index}.${ext}`;

    formData.append("files", {
      uri: item.uri,
      name,
      type: mime,
    } as never);
  });

  return formData;
};

export const uploadAssets = async (
  assets: UploadAsset[],
  label: string,
): Promise<string[]> => {
  if (!assets.length) return [];

  console.log(`Upload: ${label} input`, assets);

  const uploadResponse = await postRequest<UploadFilesResponse, FormData>({
    url: "/uploads/",
    payload: buildUploadFormData(assets),
    protectedRoute: true,
  });

  console.log(`Upload: ${label} response URLs`, uploadResponse);
  return uploadResponse;
};
