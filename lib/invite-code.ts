const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateInviteCode(length = 6) {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * ALPHABET.length);
    return ALPHABET[index];
  }).join("");
}
