declare module "hepburn" {
  /** Convert Japanese kana to Hepburn romanization */
  export function fromKana(kana: string): string;

  /** Convert hiragana to Hepburn romanization */
  export function hiraganaToRomaji(hiragana: string): string;

  /** Convert katakana to Hepburn romanization */
  export function katakanaToRomaji(katakana: string): string;

  const _default: {
    fromKana: typeof fromKana;
    hiraganaToRomaji: typeof hiraganaToRomaji;
    katakanaToRomaji: typeof katakanaToRomaji;
  };

  export default _default;
}
