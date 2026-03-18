export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input, style } = req.body;

    const prompt = `Format the following citations into ${style} style.

Return ONLY the formatted citations.

${input}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    // Extract Claude text safely
    const text =
      data?.content?.[0]?.text ||
      "Could not format citations.";

    res.status(200).json({
      result: text
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
