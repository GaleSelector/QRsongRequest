const form = document.getElementById("songForm");
const button = document.getElementById("submitButton");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();

  if (!title || !artist) {
    message.textContent = "Inserisci sia il titolo che l'artista.";
    return;
  }

  button.disabled = true;
  button.textContent = "Invio in corso...";
  message.textContent = "";

  try {
    const response = await fetch("/api/request", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title,
        artist,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Errore durante l'invio.");
    }

    message.textContent = "✅ Richiesta inviata!";

    form.reset();

  } catch (error) {
    console.error(error);

    message.textContent =
      "❌ Non è stato possibile inviare la richiesta.";

  } finally {
    button.disabled = false;
    button.textContent = "Invia richiesta";
  }
});
