import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const googleScriptURL = "https://script.google.com/macros/s/AKfycbwmZ0px1ELger-V5cNGHQkmqV-8RKqUaHzmoGa1Qf82YufKBLX_575ZKNK-31deDi_-VQ/exec";

    const params = new URLSearchParams({
      ...req.body,
      responses: JSON.stringify(req.body.responses || {})
    });

    const googleRes = await fetch(googleScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const result = await googleRes.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy error" });
  }
}
