export function getFullName(user) {
  return user ? `${user.firstName} ${user.lastName}` : "";
}

export function getLettersOfName(user) {
  return user
    ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
    : "";
}
