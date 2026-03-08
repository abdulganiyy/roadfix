import { CreateReport } from "@/types";
import { api } from "@/utils/api";

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as CreateReport;

    const response = await api.post("/report", body);

    return Response.json(response.data);
  } catch (error: any) {
    return Response.json(
      { message: error.response.data.message },
      { status: error.response.data.statusCode },
    );
  }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  try {
    const response = await api.get("/report", {
      params: Object.fromEntries(searchParams),
    });

    return Response.json(response.data);
  } catch (error: any) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch reports" },
      { status: error?.response?.status || 500 },
    );
  }
}
