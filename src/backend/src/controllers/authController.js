//verifie email et mdp login
const authServices = require("../services/authServices");

// req = demande client
// res = reponse a envoyer
async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires"
      });
    }

    const cleanEmail = email.trim();

    // nom@domaine.com -> email valide
    if (
      !cleanEmail ||
      cleanEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      !password
    ) {
      return res.status(400).json({
        message: "Email ou mot de passe invalide"
      });
    }

    const result = await authServices.login(req.db, {
        email: cleanEmail,
        password
    });

    if (!result) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    res.set("Cache-Control", "no-store");

    return res.status(200).json(result);
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

module.exports = { login };
