
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

async function req(path, params = {}) {
  const q = new URLSearchParams(params).toString();
  const url = q ? `${API_BASE}${path}?${q}` : `${API_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const getRecords = (params) => req("/records", params);
export const getIndex   = (params) => req("/index", params);
