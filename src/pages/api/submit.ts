import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const googleScriptURL = "https://script.google.com/macros/s/AKfycbwmZ0px1ELger-V5cNGHQkmqV-8RKqUaHzmoGa1Qf82YufKBLX_575ZKNK-31deDi_-VQ/exec";

    const params = new URLSearchParams({
      name: req.body.name || '',
      email: req.body.email || '',
      referralCode: req.body.referralCode || '',
      persona: req.body.persona || '',
      responses: JSON.stringify(req.body.responses || {})
    });

    console.log("Forwarding to Google Apps Script with:", params.toString());

    const googleRes = await fetch(googleScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const resultText = await googleRes.text(); 

    console.log("Google Apps Script response text:", resultText);

    let parsed;
    try {
      parsed = JSON.parse(resultText);
    } catch (e) {
      console.error("Failed to parse JSON from Apps Script:", resultText);
      return res.status(500).json({ status: "error", message: "Invalid response from Google Script" });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
