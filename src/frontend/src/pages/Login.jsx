import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import AuthLayout from "../components/common/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (typeof data.token !== "string" || !data.token) {
        setMessage(
          "La réponse du serveur ne contient pas de token valide"
        );
        return;
      }

      login(data.token, data.user);
      setPassword("");
      setMessage("Connexion réussie !");
      window.location.assign(data.user?.is_admin ? "/admin" : "/dashboard")
    } catch (err) {
      setMessage(err.message || "Connexion refusée");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <section
        aria-labelledby="login-title"
      >
        <p className="eyebrow">L’espace des aventuriers</p>
        <h1
          id="login-title"
          className="auth-title"
        >
          De retour<br />dans la nuit.
        </h1>

        <p className="text-ink-muted text-sm mb-8">
          Connecte-toi pour retrouver tes réservations et préparer ta prochaine aventure.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white font-medium">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="ton@email.fr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-md border border-gray-500 bg-white text-gray-900 placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-night-mauve"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white font-medium">
              Mot de passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ton mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-md border border-gray-500 bg-white text-gray-900 placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-night-mauve"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blood-red text-white border-0 rounded-md cursor-pointer font-bold py-3 px-4 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>

            <Link
              to="/register"
              className="border border-night-mauve text-night-mauve rounded-md font-bold py-3 px-4 text-center no-underline hover:bg-night-mauve hover:text-white"
            >
              Inscription
            </Link>
          </div>
        </form>

        <p role="status" className="text-white text-center mt-6">
          {message}
        </p>
      </section>
    </AuthLayout>
  );
}
