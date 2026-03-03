import { withCheckRoute } from "@/utils/request";
import { api } from "@/utils/api";

type RouteContext = {
  params: {
    orderId: string;
  };
};

export const PATCH = withCheckRoute(
  async (request: Request, { params }: RouteContext) => {
    try {
      const body = await request.json();

      const { orderId } = await params;

      const response = await api.patch(`/order/${orderId}`, body);

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
      const { orderId } = await params;

      const response = await api.delete(`/order/${orderId}`);

      return Response.json(response.data);
    } catch (error: any) {
      return Response.json(
        { message: error?.response?.data?.message },
        { status: error?.response?.data?.statusCode || 500 },
      );
    }
  },
);
