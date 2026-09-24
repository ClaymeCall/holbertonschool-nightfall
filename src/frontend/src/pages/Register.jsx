import { useState } from "react";
import { apiRequest } from "../lib/api";
import Alert from "../components/ui/Alert";
import AuthCard from "../components/ui/AuthCard";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
       * 1. Création du compte
       */
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      /*
       * 2. Connexion automatique
       */
      const loginData = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      /*
       * 3. Vérification du token
       */
      if (
        typeof loginData.token !== "string" ||
        !loginData.token
      ) {
        setError("Compte créé, mais aucun token valide reçu");
        return;
      }

      /*
       * 4. Sauvegarde du token
       */
      localStorage.setItem("token", loginData.token);
      window.location.assign("/");
    } catch (err) {
      setError(err.message || "Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      id="register"
      tone="highlight"
      eyebrow="Première nuit ?"
      title="Inscription"
      intro="Un compte suffit pour réserver et suivre vos expériences."
      footerText="Déjà inscrit ?"
      footerTo="/login"
      footerLabel="Se connecter"
    >
      <Alert variant="error" className="mt-6">{error}</Alert>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="prenom@exemple.fr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <Field
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Choisissez un mot de passe"
          hint="8 caractères minimum."
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />

        <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
          {loading ? "Création du compte…" : "Créer mon compte"}
        </Button>
      </form>
    </AuthCard>
  );
}
