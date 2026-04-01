export const getCurrencyFlag = (currency) => {
  const flags = {
    USD: '🇺🇸', // US Dollar
    EUR: '🇪🇺', // Euro
    GBP: '🇬🇧', // British Pound
    CHF: '🇨🇭', // Swiss Franc
    JPY: '🇯🇵', // Japanese Yen
    AUD: '🇦🇺', // Australian Dollar
    CAD: '🇨🇦', // Canadian Dollar
    CNY: '🇨🇳', // Chinese Yuan
    HKD: '🇭🇰', // Hong Kong Dollar
    NZD: '🇳🇿', // New Zealand Dollar
    SEK: '🇸🇪', // Swedish Krona
    KRW: '🇰🇷', // South Korean Won
    SGD: '🇸🇬', // Singapore Dollar
    NOK: '🇳🇴', // Norwegian Krone
    MXN: '🇲🇽', // Mexican Peso
    INR: '🇮🇳', // Indian Rupee
    RUB: '🇷🇺', // Russian Ruble
    ZAR: '🇿🇦', // South African Rand
    TRY: '🇹🇷', // Turkish Lira
    BRL: '🇧🇷', // Brazilian Real
    PLN: '🇵🇱', // Polish Zloty
  };
  return flags[currency] || '💱';
};
