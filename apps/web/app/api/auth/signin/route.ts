import { Session, User, LoginFormValues } from "@/types";
import { api } from "@/utils/api";
import { createSession } from "@/utils/session";

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as LoginFormValues;

    const response = await api.post<User>("/auth/login/staff", body);

    await createSession(response.data as unknown as Session);

    return Response.json(response.data);
  } catch (error: any) {
    return Response.json(
      { message: error.response.data.message },
      { status: error.response.data.statusCode },
    );
  }
};
