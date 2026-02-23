// lib/kuromoji.ts
import kuromoji from "kuromoji";
import path from "path";

export type KToken = kuromoji.IpadicFeatures;

const DIC_DIR = path.join(process.cwd(), "public", "dict");

let tokenizerPromise: Promise<kuromoji.Tokenizer<KToken>> | null = null;

export async function getTokenizer() {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: DIC_DIR }).build((err, tokenizer) => {
        if (err || !tokenizer)
          reject(err ?? new Error("Tokenizer build failed"));
        else resolve(tokenizer);
      });
    });
  }
  return tokenizerPromise;
}

export async function tokenize(text: string) {
  const tokenizer = await getTokenizer();
  return tokenizer.tokenize(text);
}
