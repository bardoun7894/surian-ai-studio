export interface CountryPhoneRule {
  code: string;
  country: string;
  countryAr: string;
  flag: string;
  placeholder: string;
  maxDigits: number;
}

export const COUNTRY_PHONE_RULES: CountryPhoneRule[] = [
  { code: '+963', country: 'Syria', countryAr: 'سوريا', flag: '🇸🇾', placeholder: '9xxxxxxxx', maxDigits: 9 },
  { code: '+961', country: 'Lebanon', countryAr: 'لبنان', flag: '🇱🇧', placeholder: 'xxxxxxxx', maxDigits: 8 },
  { code: '+962', country: 'Jordan', countryAr: 'الأردن', flag: '🇯🇴', placeholder: '7xxxxxxxx', maxDigits: 9 },
  { code: '+964', country: 'Iraq', countryAr: 'العراق', flag: '🇮🇶', placeholder: '7xxxxxxxxx', maxDigits: 10 },
  { code: '+971', country: 'UAE', countryAr: 'الإمارات', flag: '🇦🇪', placeholder: '5xxxxxxxx', maxDigits: 9 },
  { code: '+966', country: 'Saudi Arabia', countryAr: 'السعودية', flag: '🇸🇦', placeholder: '5xxxxxxxx', maxDigits: 9 },
  { code: '+20', country: 'Egypt', countryAr: 'مصر', flag: '🇪🇬', placeholder: '1xxxxxxxxx', maxDigits: 10 },
  { code: '+1', country: 'USA/Canada', countryAr: 'أمريكا/كندا', flag: '🇺🇸', placeholder: 'xxxxxxxxxx', maxDigits: 10 },
  { code: '+44', country: 'UK', countryAr: 'بريطانيا', flag: '🇬🇧', placeholder: '7xxxxxxxxx', maxDigits: 10 },
  { code: '+33', country: 'France', countryAr: 'فرنسا', flag: '🇫🇷', placeholder: '6xxxxxxxx', maxDigits: 9 },
  { code: '+49', country: 'Germany', countryAr: 'ألمانيا', flag: '🇩🇪', placeholder: 'xxxxxxxxxxx', maxDigits: 11 },
  { code: '+90', country: 'Turkey', countryAr: 'تركيا', flag: '🇹🇷', placeholder: '5xxxxxxxxx', maxDigits: 10 },
  { code: '+98', country: 'Iran', countryAr: 'إيران', flag: '🇮🇷', placeholder: '9xxxxxxxxx', maxDigits: 10 },
  { code: '+7', country: 'Russia', countryAr: 'روسيا', flag: '🇷🇺', placeholder: '9xxxxxxxxx', maxDigits: 10 },
  { code: '+86', country: 'China', countryAr: 'الصين', flag: '🇨🇳', placeholder: '1xxxxxxxxxx', maxDigits: 11 },
];

const SORTED_BY_CODE_LENGTH = [...COUNTRY_PHONE_RULES].sort((a, b) => b.code.length - a.code.length);

/**
 * Returns the full example phone number for a given country code.
 * e.g. "+963" → "09xxxxxxxx", "+962" → "07xxxxxxxx"
 * Falls back to the Syria example when no matching rule is found.
 */
export const getPhoneHelperText = (countryCode: string): string => {
  const rule = COUNTRY_PHONE_RULES.find((r) => r.code === countryCode);
  if (!rule) {
    const syria = COUNTRY_PHONE_RULES[0];
    return `0${syria.placeholder}`;
  }
  return `0${rule.placeholder}`;
};

export const detectCountryRule = (value: string): CountryPhoneRule | undefined => {
  return SORTED_BY_CODE_LENGTH.find((rule) => value.startsWith(rule.code));
};

export const sanitizeNationalPhoneInput = (value: string, maxDigits: number): string => {
  return value.replace(/\D/g, '').slice(0, maxDigits);
};

export const normalizePhoneWithCountryCode = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return hasPlus ? `+${digits}` : digits;
};

type PhoneValidationReason =
  | 'required'
  | 'missing_country_code'
  | 'invalid_format'
  | 'unsupported_country_code'
  | 'invalid_length';

export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string;
  reason?: PhoneValidationReason;
  countryCode?: string;
  maxDigits?: number;
}

export const validatePhoneWithCountryCode = (value: string): PhoneValidationResult => {
  const normalized = normalizePhoneWithCountryCode(value);

  if (!normalized) {
    return { isValid: false, normalized: '', reason: 'required' };
  }

  if (!normalized.startsWith('+')) {
    return { isValid: false, normalized, reason: 'missing_country_code' };
  }

  if (!/^\+\d+$/.test(normalized)) {
    return { isValid: false, normalized, reason: 'invalid_format' };
  }

  const countryRule = detectCountryRule(normalized);
  if (!countryRule) {
    return { isValid: false, normalized, reason: 'unsupported_country_code' };
  }

  const nationalNumber = sanitizeNationalPhoneInput(
    normalized.slice(countryRule.code.length),
    countryRule.maxDigits + 1
  );
  const normalizedNationalNumber =
    nationalNumber.length === countryRule.maxDigits + 1 && nationalNumber.startsWith('0')
      ? nationalNumber.slice(1)
      : nationalNumber;

  const normalizedWithCountryCode = `${countryRule.code}${normalizedNationalNumber}`;
  if (normalizedNationalNumber.length !== countryRule.maxDigits) {
    return {
      isValid: false,
      normalized: normalizedWithCountryCode,
      reason: 'invalid_length',
      countryCode: countryRule.code,
      maxDigits: countryRule.maxDigits,
    };
  }

  // Syrian mobile numbers must start with 9
  if (countryRule.code === '+963' && !normalizedNationalNumber.startsWith('9')) {
    return {
      isValid: false,
      normalized: normalizedWithCountryCode,
      reason: 'invalid_format',
      countryCode: countryRule.code,
      maxDigits: countryRule.maxDigits,
    };
  }

  return {
    isValid: true,
    normalized: normalizedWithCountryCode,
    countryCode: countryRule.code,
    maxDigits: countryRule.maxDigits,
  };
};

export const formatPhoneForLogin = (value: string): string => {
  const validation = validatePhoneWithCountryCode(value);

  if (!validation.isValid || !validation.countryCode) {
    return validation.normalized;
  }

  const nationalNumber = validation.normalized.slice(validation.countryCode.length);

  // Backend users are currently stored in local Syrian format (09xxxxxxxx).
  if (validation.countryCode === '+963') {
    return `0${nationalNumber}`;
  }

  return validation.normalized;
};

/**
 * Converts Latin numerals (0-9) to Eastern Arabic numerals (٠-٩)
 */
export const toArabicNumerals = (str: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (w) => arabicNumerals[parseInt(w)]);
};

/**
 * Conditionally localizes numerals based on language
 */
export const localizeNumbers = (str: string, language: 'ar' | 'en'): string => {
  if (language === 'ar') {
    return toArabicNumerals(str);
  }
  return str;
};
