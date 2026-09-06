import { BASE_URL } from "../constants";

export async function getLoggedUser(token) {
  const response = await fetch(`${BASE_URL}/api/v1/user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function getAllUsers(token) {
  const response = await fetch(`${BASE_URL}/api/v1/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function uploadProfile(token, profile) {
  const response = await fetch(`${BASE_URL}/api/v1/upload-profile-pic`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: profile,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });

  return data;
}
