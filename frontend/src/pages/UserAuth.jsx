import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Banner from "../components/Banner";

export default function UserAuth() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await api.post("/user/signup", form);
        // backend has no auto-login on signup, so sign in right after
      }
      const res = await api.post("/user/signin", {
        email: form.email,
        password: form.password,
      });
      loginUser(res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-ink mb-1">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="font-sans text-sm text-ink/60 mb-8">
        {mode === "signin" ? "Sign in to buy and access courses." : "Takes less than a minute."}
      </p>

      <Banner message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="flex gap-3">
            <input
              required
              placeholder="First name"
              value={form.firstName}
              onChange={update("firstName")}
              className="w-1/2 border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
            />
            <input
              required
              placeholder="Last name"
              value={form.lastName}
              onChange={update("lastName")}
              className="w-1/2 border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
            />
          </div>
        )}

        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          className="w-full border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={update("password")}
          className="w-full border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo text-paper font-sans text-sm py-2.5 hover:bg-indigo-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <button
        onClick={() => {
          setError("");
          setMode(mode === "signin" ? "signup" : "signin");
        }}
        className="mt-6 font-sans text-sm text-ink/60 hover:text-ink underline underline-offset-4"
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
