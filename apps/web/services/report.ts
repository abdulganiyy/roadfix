import axios from "axios";

export async function fetchReports(params: Record<string, any>) {
  const query = new URLSearchParams(params).toString();

  const res = await axios(`/api/report?${query}`);

  return res.data;
}

export async function fetchReport(id: string) {
  const res = await axios(`/api/report/${id}`);

  return res.data;
}
