// app/api/tokenize/route.ts
import { NextResponse } from "next/server";
import { tokenize } from "@/lib/kuromoji";

export const runtime = "nodejs"; // ensure Node runtime (not Edge)

type ReqBody = { text: string };

// Simple translation function using a free API
async function translateToEnglish(text: string): Promise<string> {
  try {
    const response = await fetch("https://api.mymemory.translated.net/get", {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      //@ts-ignore
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const params = new URLSearchParams({
      q: text,
      langpair: "ja|en",
    });

    const translationResponse = await fetch(
      `https://api.mymemory.translated.net/get?${params}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      },
    );

    //@ts-ignore
    const data = await translationResponse.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // fallback to original text
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as ReqBody;
  const text = (body.text ?? "").trim();

  if (!text) {
    return NextResponse.json({ tokens: [] }, { status: 200 });
  }

  const tokens = await tokenize(text);

  // Return only the fields you want on the client
  const simplified = await Promise.all(
    tokens.map(async (t) => {
      // Get translation for each token
      const tokenText = t.surface_form;
      const translation =
        ["。", "、", "・", ",", "."].includes(tokenText) ||
        tokenText.match(/^[ぁ-ん]$/)
          ? ""
          : await translateToEnglish(tokenText);

      return {
        surface: t.surface_form,
        base: t.basic_form,
        reading: t.reading,
        pronunciation: t.pronunciation,
        pos: t.pos,
        pos1: t.pos_detail_1,
        pos2: t.pos_detail_2,
        pos3: t.pos_detail_3,
        translation,
      };
    }),
  );

  // Translate the entire text
  const fullTextTranslation = await translateToEnglish(text);

  return NextResponse.json(
    { tokens: simplified, fullTextTranslation },
    { status: 200 },
  );
}

// Explicitly handle GET and other unsupported methods
export async function GET() {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
