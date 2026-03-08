import axios from "axios";

export async function fetchReports(params: Record<string, any>) {
  const query = new URLSearchParams(params).toString();

  const res = await axios(`/api/report?${query}`);

  return res.data;
}
