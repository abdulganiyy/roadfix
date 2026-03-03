import { Session, User } from "@/types";
import { api } from "@/utils/api";
import { SignUpFormValues } from "@/types";
import { createSession } from "@/utils/session";

export const POST = async (request: Request) => {
  const body = (await request.json()) as SignUpFormValues;

  const response = await api.post<User>("/auth/register", body);

  await createSession(response.data as unknown as Session);

  return Response.json(response.data);
};
