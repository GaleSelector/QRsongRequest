require("dotenv").config();
const express = require("express");
const { Resend } = require("resend");

const app = express();

const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_DESTINATION = process.env.EMAIL_DESTINATION;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/request", async (req, res) => {
  try {
    const { title, artist } = req.body;

    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: "Titolo e artista sono obbligatori.",
      });
    }

    const cleanTitle = String(title).trim();
    const cleanArtist = String(artist).trim();

    if (!cleanTitle || !cleanArtist) {
      return res.status(400).json({
        success: false,
        message: "Titolo e artista sono obbligatori.",
      });
    }

    const { data, error } = await resend.emails.send({
      from: "Richieste canzoni <onboarding@resend.dev>",
      to: [EMAIL_DESTINATION],
      subject: `🎵 Richiesta: ${cleanTitle} - ${cleanArtist}`,
      html: `
        <h2>🎵 Nuova richiesta musicale</h2>

        <p><strong>Titolo:</strong> ${escapeHtml(cleanTitle)}</p>
        <p><strong>Artista:</strong> ${escapeHtml(cleanArtist)}</p>
      `,
    });

    if (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Errore durante l'invio della richiesta.",
      });
    }

    console.log("Email inviata:", data);

    res.json({
      success: true,
      message: "Richiesta inviata!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Errore interno del server.",
    });
  }
});

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
