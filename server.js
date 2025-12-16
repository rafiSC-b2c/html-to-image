const express = require("express");
const { chromium } = require("playwright");

const app = express();
app.use(express.json({ limit: "15mb" }));

app.post("/render", async (req, res) => {
  try {
    const {
      html,
      width = 1080,
      height = 1920,
      deviceScaleFactor = 2
    } = req.body;

    if (!html) {
      return res.status(400).send("HTML fehlt");
    }

    const browser = await chromium.launch({
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor
    });

    await page.setContent(html, { waitUntil: "networkidle" });

    const image = await page.screenshot({
      type: "png",
      fullPage: false
    });

    await browser.close();

    res.set("Content-Type", "image/png");
    res.send(image);

  } catch (err) {
    console.error(err);
    res.status(500).send("Rendering Fehler");
  }
});

app.listen(3000, () => {
  console.log("✅ HTML→Image API läuft auf http://localhost:3000/render");
});
