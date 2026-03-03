import { api } from "@/utils/api";

export const GET = async () => {
  try {
    const response = await api.get("/category");

    return Response.json(response.data);
  } catch (error: any) {
    return Response.json(
      { message: error.response.data.message },
      { status: error.response.data.statusCode },
    );
  }
};
