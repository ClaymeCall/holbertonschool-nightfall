import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { apiRequest } from "../lib/api";
import Alert from "../components/ui/Alert";
import AuthCard from "../components/ui/AuthCard";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (typeof data.token !== "string" || !data.token) {
        setError("La réponse du serveur ne contient pas de token valide");
        return;
      }

      login(data.token, data.user);
      setPassword("");
      setSuccess("Connexion réussie !");
      window.location.assign(data.user?.is_admin ? "/admin" : "/dashboard")
    } catch (err) {
      setError(err.message || "Connexion refusée");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      id="login"
      tone="accent"
      eyebrow="Bon retour"
      title="Connexion"
      intro="Retrouvez vos réservations et réservez votre prochaine nuit."
      footerText="Pas encore de compte ?"
      footerTo="/register"
      footerLabel="Créer un compte"
    >
      <Alert variant="error" className="mt-6">{error}</Alert>
      <Alert variant="success" className="mt-6">{success}</Alert>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="prenom@exemple.fr"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <Field
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </AuthCard>
  );
}
