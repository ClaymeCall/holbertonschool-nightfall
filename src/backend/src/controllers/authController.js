//verifie email et mdp login
const authServices = require("../services/authServices");
const { isValidEmail } = require("../utils/validation");

// Login and register both start by reading two strings from the body.
function readCredentials(body) {
  const { email, password } = body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  return { email: email.trim(), password };
}

// req = demande client
// res = reponse a envoyer
async function login(req, res) {
  try {
    const credentials = readCredentials(req.body);

    if (!credentials) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires"
      });
    }

    const { email: cleanEmail, password } = credentials;

    // nom@domaine.com -> email valide
    if (!isValidEmail(cleanEmail) || !password) {
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

async function register(req, res) {
  try {
    const credentials = readCredentials(req.body);

    if (!credentials) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires"
      });
    }

    const { email: cleanEmail, password } = credentials;

    if (!isValidEmail(cleanEmail) || password.length < 8) {
      return res.status(400).json({
        message: "Email invalide ou mot de passe trop court"
      });
    }

    const user = await authServices.register(req.db, {
      email: cleanEmail,
      password
    });

    if (!user) {
      return res.status(409).json({
        message: "Cet email est déjà utilisé"
      });
    }

    return res.status(201).json(user);
  } catch (err) {
    console.error("Register error:", err);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

async function logout(req, res) {
  try {
    const deleted = await authServices.logout(
      req.db,
      req.token
    );

    if (!deleted) {
      return res.status(401).json({
        error: "Session invalide"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      error: "Erreur serveur"
    });
  }
}
module.exports = { login, register, logout };
