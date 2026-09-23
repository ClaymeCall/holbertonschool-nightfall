import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
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
      const response = await fetch(
        "http://localhost:5080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Connexion refusée");
        return;
      }

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
    } catch {
      setMessage(
        "Connexion impossible : vérifie l’API et l’accès au stockage du navigateur."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-deep-black text-white flex items-center justify-center px-4 py-12">
      <section
        className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-8 shadow-xl"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          className="text-night-mauve text-3xl font-bold text-center mb-2"
        >
          Connexion NIGHTFALL
        </h1>

        <p className="text-gray-300 text-center mb-8">
          Connecte-toi à ton compte.
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
    </main>
  );
}
