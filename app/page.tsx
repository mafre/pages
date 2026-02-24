// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import * as hepburn from "hepburn";
import { Sawarabi_Mincho } from "next/font/google";

const sawarabiMincho = Sawarabi_Mincho({
  weight: "400",
});

type ApiToken = {
  surface: string;
  base?: string;
  reading?: string;
  pronunciation?: string;
  pos?: string;
  pos1?: string;
  pos2?: string;
  pos3?: string;
  translation?: string;
};

type ApiTokenWithRomanized = ApiToken & {
  romanized?: string;
};

export default function Page() {
  const [input, setInput] = useState(
    "このサイトで日本語を分析・翻訳できます。",
  );
  const [tokens, setTokens] = useState<ApiTokenWithRomanized[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [fullTextTranslation, setFullTextTranslation] = useState("");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Example data
  const exampleTokens: ApiToken[] = [
    {
      surface: "この",
      base: "この",
      reading: "コノ",
      pos: "接触詞",
      translation: "this",
    },
    {
      surface: "サイト",
      base: "サイト",
      reading: "サイト",
      pos: "名詞",
      translation: "site",
    },
    {
      surface: "で",
      base: "で",
      reading: "デ",
      pos: "助詞",
      translation: "in",
    },
    {
      surface: "日本語",
      base: "日本語",
      reading: "ニホンゴ",
      pos: "名詞",
      translation: "Japanese",
    },
    { surface: "を", base: "を", reading: "ヲ", pos: "助詞", translation: "" },
    {
      surface: "分析",
      base: "分析",
      reading: "ブンセキ",
      pos: "名詞",
      translation: "analyze",
    },
    { surface: "・", base: "・", reading: "・", pos: "記号", translation: "" },
    {
      surface: "翻訳",
      base: "翻訳",
      reading: "ホンヤク",
      pos: "名詞",
      translation: "translate",
    },
    {
      surface: "でき",
      base: "できる",
      reading: "デキ",
      pos: "動詞",
      translation: "can",
    },
    {
      surface: "ます",
      base: "ます",
      reading: "マス",
      pos: "助動詞",
      translation: "",
    },
    { surface: "。", base: "。", reading: "。", pos: "記号", translation: "" },
  ];
  const exampleTranslation =
    "You can analyze and translate Japanese on this site.";

  // Load example on mount
  useEffect(() => {
    const tokensWithRomanized = exampleTokens.map((t) => ({
      ...t,
      romanized: t.reading ? hepburn.fromKana(t.reading) : t.surface,
    }));
    setTokens(tokensWithRomanized);
    setFullTextTranslation(exampleTranslation);
    setSelected(new Set(tokensWithRomanized.map((_, i) => i)));
  }, []);

  const colors = {
    bg: isDark ? "#1a1a1a" : "#ffffff",
    text: isDark ? "#e0e0e0" : "#000000",
    border: isDark ? "#444444" : "#cccccc",
    inputBg: isDark ? "#2a2a2a" : "#ffffff",
    buttonBg: isDark ? "#444444" : "#f0f0f0",
    romanized: isDark ? "#ffffff" : "#0066cc",
    dimText: isDark ? "#999999" : "#666666",
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = (await res.json()) as {
        tokens: ApiToken[];
        fullTextTranslation?: string;
      };
      const tokensWithRomanized = (data.tokens ?? []).map((t) => ({
        ...t,
        romanized: t.reading ? hepburn.fromKana(t.reading) : t.surface,
      }));
      setTokens(tokensWithRomanized);
      setFullTextTranslation(data.fullTextTranslation ?? "");
      setSelected(new Set(tokensWithRomanized?.map((_, i) => i) ?? []));
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 32,
        backgroundColor: colors.bg,
        color: colors.text,
        transition: "background-color 0.3s, color 0.3s",
      }}
      className={sawarabiMincho.className}
    >
      <div style={{ width: "100%", maxWidth: 800, display: "grid", gap: 32 }}>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type Japanese text here..."
            style={{
              padding: 16,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              fontSize: 18,
              flex: 1,
              backgroundColor: colors.inputBg,
              color: colors.text,
              transition:
                "background-color 0.3s, color 0.3s, border-color 0.3s",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              fontSize: 20,
              cursor: "pointer",
              backgroundColor: colors.buttonBg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              transition: "background-color 0.3s, color 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 44,
              minHeight: 44,
            }}
            title="Submit"
          >
            {loading ? "..." : "→"}
          </button>
        </form>

        {tokens.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                fontSize: 26,
                lineHeight: 1.8,
                justifyContent: "center",
              }}
            >
              {tokens.map((t, i) => (
                <div
                  key={`${i}-${t.surface}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 500, color: colors.text }}>
                    {t.surface}
                  </div>
                  {t.romanized && (
                    <div
                      style={{
                        fontSize: 12,
                        color: colors.romanized,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        marginTop: 2,
                      }}
                      title={[
                        t.base ? `base: ${t.base}` : "",
                        t.reading ? `reading: ${t.reading}` : "",
                        t.pos ? `pos: ${t.pos}/${t.pos1 ?? ""}` : "",
                      ]
                        .filter(Boolean)
                        .join(" | ")}
                    >
                      {t.romanized}
                    </div>
                  )}
                  {t.translation && (
                    <div
                      style={{
                        fontSize: 11,
                        color: colors.dimText,
                        fontWeight: 500,
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      {t.translation}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {fullTextTranslation && (
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  backgroundColor: colors.inputBg,
                  borderRadius: 10,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: colors.dimText,
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  Translation
                </div>
                <div
                  style={{ fontSize: 16, lineHeight: 1.6, color: colors.text }}
                >
                  {fullTextTranslation}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
