import { withCheckRoute } from "@/utils/request";
import { api } from "@/utils/api";

type RouteContext = {
  params: {
    menuId: string;
  };
};

export const PATCH = withCheckRoute(
  async (request: Request, { params }: RouteContext) => {
    try {
      const body = await request.json();

      const { menuId } = await params;

      const response = await api.patch(`/menu/${menuId}`, body);

      return Response.json(response.data);
    } catch (error: any) {
      return Response.json(
        { message: error?.response?.data?.message },
        { status: error?.response?.data?.statusCode },
      );
    }
  },
);

export const DELETE = withCheckRoute(
  async (_request: Request, { params }: RouteContext) => {
    try {
      const { menuId } = await params;

      const response = await api.delete(`/menu/${menuId}`);

      return Response.json(response.data);
    } catch (error: any) {
      return Response.json(
        { message: error?.response?.data?.message },
        { status: error?.response?.data?.statusCode || 500 },
      );
    }
  },
);
