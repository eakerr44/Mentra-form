"use client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const googleScriptURL =
      "https://script.google.com/macros/s/AKfycbwmZ0px1ELger-V5cNGHQkmqV-8RKqUaHzmoGa1Qf82YufKBLX_575ZKNK-31deDi_-VQ/exec";

    const body = JSON.stringify(req.body);

    console.log("🟡 Submitting to Google Script with:", body);

    const googleRes = await fetch(googleScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const rawText = await googleRes.text();

    // Additional safety: ensure response starts with { to be parsed
    if (!rawText.trim().startsWith("{")) {
      console.error("🔴 Response not valid JSON:", rawText);
      return res.status(502).json({ status: "error", message: "Invalid JSON response from Google Script", raw: rawText });
    }
    console.log("🟢 Raw response from Google Apps Script:", rawText);

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("🔴 JSON parse error from Google Script response:", err);
      return res.status(502).json({ status: "error", message: "Bad response format from Google Script", rawText });
    }

    return res.status(200).json(parsed);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    console.error("🔴 Proxy submission error:", errorMessage);
    return res.status(500).json({ status: "error", message: "Internal server error", error: errorMessage });
  }
}