import { CategoryInfo, Category, CurrencyInfo, CurrencyCode } from '../types'

// ====================================
// CATEGORY CONFIGURATION
// Using Lucide icon names (not emojis!)
// ====================================

export const CATEGORIES: Record<Category, CategoryInfo> = {
  food: {
    id: 'food',
    label: 'Food & Dining',
    color: '#FF6B6B',
    icon: 'Utensils', // Lucide icon name
  },
  transport: {
    id: 'transport',
    label: 'Transport',
    color: '#4ECDC4',
    icon: 'Car',
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    color: '#45B7D1',
    icon: 'ShoppingBag',
  },
  entertainment: {
    id: 'entertainment',
    label: 'Entertainment',
    color: '#96CEB4',
    icon: 'Clapperboard',
  },
  bills: {
    id: 'bills',
    label: 'Bills & Utilities',
    color: '#FFEAA7',
    icon: 'Receipt',
  },
  health: {
    id: 'health',
    label: 'Health',
    color: '#DDA0DD',
    icon: 'Heart',
  },
  income: {
    id: 'income',
    label: 'Income',
    color: '#51CF66',
    icon: 'Wallet',
  },
  other: {
    id: 'other',
    label: 'Other',
    color: '#B8B8B8',
    icon: 'Package',
  },
}

// ====================================
// CURRENCY CONFIGURATION
// All major world currencies
// ====================================

export const CURRENCIES: Record<string, CurrencyInfo> = {
  // North America
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  MXN: { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },

  // Europe
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL' },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ' },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU' },
  RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', locale: 'ro-RO' },
  BGN: { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', locale: 'bg-BG' },
  HRK: { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', locale: 'hr-HR' },
  RSD: { code: 'RSD', symbol: 'дин', name: 'Serbian Dinar', locale: 'sr-RS' },
  UAH: { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', locale: 'uk-UA' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
  ISK: { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna', locale: 'is-IS' },

  // Asia
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK' },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', locale: 'zh-TW' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', locale: 'en-PK' },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', locale: 'bn-BD' },
  LKR: { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', locale: 'si-LK' },
  NPR: { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee', locale: 'ne-NP' },
  MMK: { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat', locale: 'my-MM' },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN' },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
  KZT: { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge', locale: 'kk-KZ' },
  UZS: { code: 'UZS', symbol: 'сўм', name: 'Uzbekistani Som', locale: 'uz-UZ' },
  AFN: { code: 'AFN', symbol: '؋', name: 'Afghan Afghani', locale: 'fa-AF' },
  IRR: { code: 'IRR', symbol: '﷼', name: 'Iranian Rial', locale: 'fa-IR' },
  IQD: { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar', locale: 'ar-IQ' },

  // Middle East
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  QAR: { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', locale: 'ar-QA' },
  KWD: { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', locale: 'ar-KW' },
  BHD: { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', locale: 'ar-BH' },
  OMR: { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial', locale: 'ar-OM' },
  JOD: { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', locale: 'ar-JO' },
  LBP: { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound', locale: 'ar-LB' },
  SYP: { code: 'SYP', symbol: '£', name: 'Syrian Pound', locale: 'ar-SY' },
  YER: { code: 'YER', symbol: '﷼', name: 'Yemeni Rial', locale: 'ar-YE' },
  ILS: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', locale: 'he-IL' },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', locale: 'ar-EG' },

  // Africa
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE' },
  GHS: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', locale: 'en-GH' },
  TZS: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', locale: 'sw-TZ' },
  UGX: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', locale: 'en-UG' },
  ETB: { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', locale: 'am-ET' },
  MAD: { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham', locale: 'ar-MA' },
  DZD: { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar', locale: 'ar-DZ' },
  TND: { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', locale: 'ar-TN' },
  XOF: { code: 'XOF', symbol: 'CFA', name: 'West African CFA', locale: 'fr-SN' },
  XAF: { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA', locale: 'fr-CM' },

  // South America
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso', locale: 'es-AR' },
  CLP: { code: 'CLP', symbol: '$', name: 'Chilean Peso', locale: 'es-CL' },
  COP: { code: 'COP', symbol: '$', name: 'Colombian Peso', locale: 'es-CO' },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', locale: 'es-PE' },
  VES: { code: 'VES', symbol: 'Bs', name: 'Venezuelan Bolívar', locale: 'es-VE' },
  UYU: { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', locale: 'es-UY' },
  BOB: { code: 'BOB', symbol: 'Bs', name: 'Bolivian Boliviano', locale: 'es-BO' },
  PYG: { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani', locale: 'es-PY' },

  // Oceania
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  FJD: { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar', locale: 'en-FJ' },

  // Caribbean & Central America
  JMD: { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar', locale: 'en-JM' },
  TTD: { code: 'TTD', symbol: 'TT$', name: 'Trinidad Dollar', locale: 'en-TT' },
  BBD: { code: 'BBD', symbol: 'Bds$', name: 'Barbadian Dollar', locale: 'en-BB' },
  DOP: { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso', locale: 'es-DO' },
  CRC: { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón', locale: 'es-CR' },
  GTQ: { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal', locale: 'es-GT' },
  HNL: { code: 'HNL', symbol: 'L', name: 'Honduran Lempira', locale: 'es-HN' },
  PAB: { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa', locale: 'es-PA' },

  // Crypto (Popular)
  BTC: { code: 'BTC', symbol: '₿', name: 'Bitcoin', locale: 'en-US' },
  ETH: { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', locale: 'en-US' },
}

// Get currency options for select dropdown
export const getCurrencyOptions = () => {
  return Object.values(CURRENCIES).map(currency => ({
    value: currency.code,
    label: `${currency.symbol} ${currency.code} - ${currency.name}`,
  }))
}

// ====================================
// LOCAL STORAGE KEYS
// ====================================

export const STORAGE_KEYS = {
  TRANSACTIONS: 'expense-tracker-transactions',
  THEME: 'expense-tracker-theme',
  CURRENCY: 'expense-tracker-currency',
} as const

// ====================================
// APP CONFIGURATION
// ====================================

export const APP_CONFIG = {
  APP_NAME: 'ExpenseFlow',
  DEFAULT_CURRENCY: 'USD' as CurrencyCode,
} as const