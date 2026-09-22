import { useState } from "react";

export default function Login() {
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
        setMessage("La réponse du serveur ne contient pas de token valide");
        return;
      }

      localStorage.setItem("token", data.token);
      setPassword("");
      setMessage("Connexion réussie : token enregistré !");
    } catch {
      setMessage(
        "Connexion impossible : vérifie l’API et l’accès au stockage du navigateur."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: "60px auto", padding: 20 }}>
      <h1>Connexion NIGHTFALL</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 16 }}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p role="status">{message}</p>
    </main>
  );
}