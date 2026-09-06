import { BASE_URL } from "../constants";

export async function getAllChats(token) {
  const response = await fetch(`${BASE_URL}/api/v1/chat/get-all-chats`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function createNewChat(token, members) {
  const response = await fetch(`${BASE_URL}/api/v1/chat/create-new-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ members }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}
