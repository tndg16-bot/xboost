export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidXHandle = (handle: string): boolean => {
  const xHandleRegex = /^@?[A-Za-z0-9_]{1,15}$/;
  return xHandleRegex.test(handle);
};

export const isValidDateString = (str: string): boolean => {
  return !isNaN(Date.parse(str));
};
