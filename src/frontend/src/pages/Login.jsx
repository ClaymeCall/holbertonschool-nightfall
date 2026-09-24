import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import Alert from "../components/ui/Alert";
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
    <main className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-canvas px-4 py-12 text-ink">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/nightfall-gates.webp)' }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-canvas/70" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--color-accent)/0.22),transparent_55%)]"
      />

      <section
        className="w-full max-w-md rounded-2xl border border-t-[3px] border-line border-t-accent bg-surface p-8 shadow-2xl shadow-black/50"
        aria-labelledby="login-title"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">
          Bon retour
        </p>
        <h1 id="login-title" className="mt-2 font-display text-4xl leading-tight text-ink">
          Connexion
        </h1>
        <p className="mt-3 text-ink-muted">
          Retrouvez vos réservations et réservez votre prochaine nuit.
        </p>

        <Alert variant="error" className="mt-6">{error}</Alert>
        <Alert variant="success" className="mt-6">{success}</Alert>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="ton@email.fr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <Field
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ton mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-ink-muted">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-bold text-highlight underline hover:brightness-125">
            Créer un compte
          </Link>
        </p>
      </section>
    </main>
  );
}
