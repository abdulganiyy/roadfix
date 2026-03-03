import { withCheckRoute } from "@/utils/request";
import { api } from "@/utils/api";

export const POST = withCheckRoute(async (request: Request) => {
  try {
    const body = await request.json();

    const response = await api.post("/menu", body);

    return Response.json(response.data.data);
  } catch (error: any) {
    return Response.json(
      { message: error?.response?.data?.message },
      { status: error?.response?.data?.statusCode },
    );
  }
});

export const GET = withCheckRoute(async (request: Request) => {
  try {
    const response = await api.get("/menu");

    return Response.json(response.data);
  } catch (error: any) {
    return Response.json(
      { message: error?.response?.data?.message },
      { status: error?.response?.data?.statusCode },
    );
  }
});
