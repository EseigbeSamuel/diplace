export function formatNigerianPhoneForCall(
  rawNumber?: string | null,
): string | null {
  if (!rawNumber) return null;

  // Strip everything except digits and leading +
  const cleaned = rawNumber.replace(/[^\d+]/g, "");

  // Already in international format
  if (cleaned.startsWith("+234")) return cleaned;

  // 234xxxxxxxxxx (missing +)
  if (cleaned.startsWith("234")) return `+${cleaned}`;

  // Local format: 0801234567 -> +234801234567
  if (cleaned.startsWith("0")) return `+234${cleaned.slice(1)}`;

  // Fallback: assume it's a bare 10-digit local number without the leading 0
  if (cleaned.length === 10) return `+234${cleaned}`;

  return cleaned; // last resort, let the OS dialer try
}

export function isValidNigerianPhone(rawNumber?: string | null): boolean {
  const formatted = formatNigerianPhoneForCall(rawNumber);
  return /^\+234\d{10}$/.test(formatted ?? "");
}
