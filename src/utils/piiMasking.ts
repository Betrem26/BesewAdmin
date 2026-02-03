export const maskPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Ethiopian phone number format: +251912345678
  if (phone.startsWith('+251') && phone.length === 13) {
    return `+251***${phone.slice(-5)}`;
  }

  // Generic masking for other formats
  if (phone.length > 6) {
    return `${phone.slice(0, 3)}***${phone.slice(-3)}`;
  }

  return '***';
};

export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return '';

  const [local, domain] = email.split('@');
  
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }

  return `${local[0]}***${local[local.length - 1]}@${domain}`;
};

export const maskName = (name: string): string => {
  if (!name) return '';

  const parts = name.split(' ');
  return parts.map(part => {
    if (part.length <= 2) return part;
    return `${part[0]}***`;
  }).join(' ');
};

export const maskBankAccount = (account: string): string => {
  if (!account) return '';
  if (account.length <= 4) return '***';
  return `***${account.slice(-4)}`;
};

export const maskPII = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => maskPII(item));
  }

  if (typeof data === 'object') {
    const masked: any = {};

    for (const key in data) {
      if (!data.hasOwnProperty(key)) continue;

      const value = data[key];

      // Mask specific PII fields
      if (key === 'phoneNumber' || key === 'phone' || key === 'mobile') {
        masked[key] = maskPhoneNumber(value);
      } else if (key === 'email') {
        masked[key] = maskEmail(value);
      } else if (key === 'name' || key === 'fullName' || key === 'profile_name') {
        masked[key] = maskName(value);
      } else if (key === 'bankAccount' || key === 'accountNumber') {
        masked[key] = maskBankAccount(value);
      } else if (key === 'password' || key === 'token' || key === 'secret') {
        // Never include these fields
        masked[key] = '***REDACTED***';
      } else if (typeof value === 'object') {
        // Recursively mask nested objects
        masked[key] = maskPII(value);
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  return data;
};

// Selective masking for admin view (show partial info)
export const maskPIIForAdmin = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => maskPIIForAdmin(item));
  }

  if (typeof data === 'object') {
    const masked: any = {};

    for (const key in data) {
      if (!data.hasOwnProperty(key)) continue;

      const value = data[key];

      // Admin can see more info, but still masked
      if (key === 'phoneNumber' || key === 'phone' || key === 'mobile') {
        masked[key] = maskPhoneNumber(value);
      } else if (key === 'email') {
        masked[key] = maskEmail(value);
      } else if (key === 'password' || key === 'token' || key === 'secret') {
        masked[key] = '***REDACTED***';
      } else if (typeof value === 'object') {
        masked[key] = maskPIIForAdmin(value);
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  return data;
};
