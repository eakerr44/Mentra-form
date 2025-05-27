import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const googleScriptURL =
      "https://script.google.com/macros/s/AKfycbwmZ0px1ELger-V5cNGHQkmqV-8RKqUaHzmoGa1Qf82YufKBLX_575ZKNK-31deDi_-VQ/exec";

    const { name = "", email = "", referralCode = "", persona = "", responses = {} } = req.body;

    const params = new URLSearchParams({
      name,
      email,
      referralCode,
      persona,
      responses: JSON.stringify(responses),
    });

    console.log("🟡 Submitting to Google Script with:", params.toString());

    const googleRes = await fetch(googleScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const rawText = await googleRes.text();
    console.log("🟢 Raw response from Google Apps Script:", rawText);

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("🔴 JSON parse error from Google Script response:", err);
      return res.status(502).json({ status: "error", message: "Bad response format from Google Script", rawText });
    }

    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error("🔴 Proxy submission error:", err.message);
    return res.status(500).json({ status: "error", message: "Internal server error", error: err.message });
  }
}
