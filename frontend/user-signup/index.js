async function validerEmail() {
  const emailInput = document.getElementById("emailFelt").value;
  const adgangskode = document.getElementById("adgangskodeFelt").value;
  const beskedElement = document.getElementById("beskedFelt");

  // Tilladt domæne
  const tilladtDomæne = "@edu.sde.dk";

  if (!emailInput.toLowerCase().endsWith(tilladtDomæne)) {
    beskedElement.textContent =
      "Fejl: Du skal bruge en " + tilladtDomæne + " adresse.";
    return;
  }
  if (!validerAdgangskode()) {
    beskedElement.textContent = "Fejl: Adgangskoderne matcher ikke.";
    return;
  }

  const backendUrl = "https://udlaan.itskp-odense.dk";

  const res = await fetch(backendUrl + "/api/auth/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: emailInput, password: adgangskode }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    beskedElement.textContent =
      "Fejl: " +
      (errorData.message ||
        errorData.error ||
        errorData ||
        "Ukendt fejl opstod.");
    return;
  }

  setTimeout(function () {
    window.location.href =
      "confirm.html" + "?email=" + encodeURIComponent(emailInput);
  }, 0);
}
function validerAdgangskode() {
  const adgangskode = document.getElementById("adgangskodeFelt").value;
  const bekraftAdgangskode = document.getElementById(
    "bekraftAdgangskodeFelt",
  ).value;
  const beskedElement = document.getElementById("beskedFelt");

  if (adgangskode.trim() === "" || adgangskode !== bekraftAdgangskode) {
    return false;
  }
  return true;
}
