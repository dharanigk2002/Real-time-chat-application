import { BASE_URL } from "../constants";

export async function sendMessage(token, message) {
  const response = await fetch(`${BASE_URL}/api/v1/message/new-message`, {
    method: "POST",
    body: JSON.stringify(message),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function getAllMessages(token, chatId) {
  const response = await fetch(
    `${BASE_URL}/api/v1/message/get-all-messages/${chatId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}

export async function clearUnreadMessageCount(token, chatId) {
  const response = await fetch(
    `${BASE_URL}/api/v1/message/clear-unread-message/${chatId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error, { cause: data });
  return data;
}
