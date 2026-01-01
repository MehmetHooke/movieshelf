import { useState } from "react";
import { login, register } from "../services/authService";
import { getAxiosErrorInfo } from "../services/movieService"; // sende getAxiosErrorInfo varsa onu da kullanabilirsin
import bg from "../assets/loginbackground.jpg";
import { useNavigate } from "react-router-dom";


export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();


    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (mode === "login") await login(email, password);
            else await register(email, password);
            navigate("/", { replace: true });

        } catch (err: unknown) {
            setError(getAxiosErrorInfo(err).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center -mt-15 justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(0,0,0,0.15),
        rgba(0,0,0,0.65)
      ),
      url(${bg})
    `,
                filter: "saturate(0.7) brightness(0.75)",
            }}
        >
            <div className="mx-auto max-w-md px-4 py-12">
                <div className="rounded-3xl border border-white/10 bg-black/50 p-8 backdrop-blur-xs">
                    <h1 className="text-2xl font-semibold text-white">
                        {mode === "login" ? "Sign in" : "Create account"}
                    </h1>
                    <p className="mt-2 text-white/70">
                        {mode === "login"
                            ? "Sign in to sync favorites in your account."
                            : "Create an account to save favorites across devices."}
                    </p>

                    {error && (
                        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                            {error}
                        </p>
                    )}

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/20"
                            required
                        />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/20"
                            required
                            minLength={6}
                        />

                        <button
                            disabled={loading}
                            className="w-full rounded-xl bg-white px-5 py-3 font-medium text-black hover:bg-white/90 disabled:opacity-60"
                        >
                            {loading
                                ? "Please wait…"
                                : mode === "login"
                                    ? "Sign in"
                                    : "Create account"}
                        </button>
                    </form>

                    <button
                        className="mt-4 w-full rounded-xl bg-white/10 px-5 py-3 text-sm text-white/80 hover:bg-white/15"
                        onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
                        disabled={loading}
                    >
                        {mode === "login"
                            ? "New here? Create an account"
                            : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
