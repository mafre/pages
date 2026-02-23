// lib/kuromoji.ts
import path from "node:path";
import kuromoji from "kuromoji";

export type KToken = kuromoji.IpadicFeatures;

let tokenizerPromise: Promise<kuromoji.Tokenizer<KToken>> | null = null;

export function getDictPath(): string {
  // Uses the dict shipped in node_modules/kuromoji/dict
  return path.join(process.cwd(), "node_modules", "kuromoji", "dict");
}

export async function getTokenizer() {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: getDictPath() }).build((err, tokenizer) => {
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
