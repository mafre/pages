/**
 * Hepburn romanization library for converting Japanese kana to romaji
 */

/**
 * Convert Japanese kana to Hepburn romanization
 * @param kana - The Japanese kana string to convert
 * @returns The romanized string in Hepburn notation
 */
export function fromKana(kana: string): string;

/**
 * Convert hiragana to Hepburn romanization
 * @param hiragana - The hiragana string to convert
 * @returns The romanized string in Hepburn notation
 */
export function hiraganaToRomaji(hiragana: string): string;

/**
 * Convert katakana to Hepburn romanization
 * @param katakana - The katakana string to convert
 * @returns The romanized string in Hepburn notation
 */
export function katakanaToRomaji(katakana: string): string;
