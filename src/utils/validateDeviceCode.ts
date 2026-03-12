  const validateDeviceCode = (code: string): string | null => {
  const trimmed = code.trim().toUpperCase();

  if (!trimmed) {
    return "Please enter a device code.";
  }

  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(trimmed)) {
    return "Invalid format. Expected: XXXX-XXXX";
  }

  return null;
};

export default validateDeviceCode;