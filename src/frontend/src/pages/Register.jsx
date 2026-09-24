import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import AuthLayout from "../components/common/AuthLayout";
import useAuth from "../hooks/useAuth";

export default function Register() {
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
        setMessage(
          "Compte créé, mais aucun token valide reçu"
        );
        return;
      }

      /*
       * 4. Sauvegarde du token
       */
      login(loginData.token, loginData.user);
      window.location.assign("/");
    } catch (err) {
      setMessage(err.message || "Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <section
        aria-labelledby="register-title"
      >
        <p className="eyebrow">Rejoindre l’aventure</p>
        <h1
          id="register-title"
          className="auth-title"
        >
          Le premier pas<br />vers l’inconnu.
        </h1>

        <p className="text-ink-muted text-sm mb-8">
          Crée ton compte pour réserver tes expériences et réunir ton équipe.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-white font-medium"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ton@email.fr"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className="w-full rounded-md border border-gray-500 bg-white text-gray-900 placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-night-mauve"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-white font-medium"
            >
              Mot de passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="8 caractères minimum"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              required
              className="w-full rounded-md border border-gray-500 bg-white text-gray-900 placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-night-mauve"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blood-red text-white border-0 rounded-md cursor-pointer font-bold py-3 px-4 mt-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Création du compte..."
              : "Créer mon compte"}
          </button>
        </form>

        <p
          role="status"
          className="text-white text-center mt-6"
        >
          {message}
        </p>

        <p className="text-gray-300 text-center mt-4">
          Déjà inscrit ?{" "}
          <Link
            to="/login"
            className="text-night-mauve font-bold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </section>
    </AuthLayout>
  );
}
