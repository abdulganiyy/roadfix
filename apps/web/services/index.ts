import axios from "axios";

export const uploadImage = async (file: any) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const url = `https://api.cloudinary.com/v1_1/dm49zhija/upload`;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "jrlc8n92");
  formData.append("tags", "ileiyanbypods");
  formData.append("folder", "ileiyanbypods");
  formData.append("api_key", `${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`);

  const response = await axios.post(url, formData);

  return response.data;
};
