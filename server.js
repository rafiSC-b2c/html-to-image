app.post("/render", async (req, res) => {
  try {
    const { html, width = 1080, height = 1920 } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML fehlt" });
    }

    const browser = await chromium.launch({
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 2
    });

    await page.setContent(html, { waitUntil: "networkidle" });

    const image = await page.screenshot({ type: "png" });

    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(image);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Rendering Fehler", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`HTML→Image API läuft auf Port ${PORT}`)
);
