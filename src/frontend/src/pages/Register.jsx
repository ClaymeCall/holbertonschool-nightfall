import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import Alert from "../components/ui/Alert";
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
    <main className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-canvas px-4 py-12 text-ink">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--color-highlight)/0.2),transparent_55%)]"
      />

      <section
        className="w-full max-w-md rounded-2xl border border-t-[3px] border-line border-t-highlight bg-surface p-8 shadow-2xl shadow-black/50"
        aria-labelledby="register-title"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">
          Première nuit ?
        </p>
        <h1 id="register-title" className="mt-2 font-display text-4xl leading-tight text-ink">
          Inscription
        </h1>
        <p className="mt-3 text-ink-muted">
          Un compte suffit pour réserver et suivre vos expériences.
        </p>

        <Alert variant="error" className="mt-6">{error}</Alert>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ton@email.fr"
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

        <p className="mt-6 text-center text-ink-muted">
          Déjà inscrit ?{" "}
          <Link to="/login" className="font-bold text-highlight underline hover:brightness-125">
            Se connecter
          </Link>
        </p>
      </section>
    </main>
  );
}
