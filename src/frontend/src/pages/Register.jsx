import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      /*
       * 1. Création du compte
       */
      const registerResponse = await fetch(
        "http://localhost:5080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setMessage(
          registerData.message || "Impossible de créer le compte"
        );
        return;
      }

      /*
       * 2. Connexion automatique
       */
      const loginResponse = await fetch(
        "http://localhost:5080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setMessage(
          loginData.message ||
          "Compte créé, mais connexion impossible"
        );
        return;
      }

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
      localStorage.setItem("token", loginData.token);

      /*
       * 5. Retour à l'accueil
       */
      navigate("/");
    } catch {
      setMessage(
        "Impossible de contacter le serveur"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-deep-black text-white flex items-center justify-center px-4 py-12">
      <section
        className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-8 shadow-xl"
        aria-labelledby="register-title"
      >
        <h1
          id="register-title"
          className="text-night-mauve text-3xl font-bold text-center mb-2"
        >
          Inscription NIGHTFALL
        </h1>

        <p className="text-gray-300 text-center mb-8">
          Crée ton compte.
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
    </main>
  );
}