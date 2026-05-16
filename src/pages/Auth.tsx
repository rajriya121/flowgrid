import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckSquare2, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useStore } from "@/context/AppContext";
import { Logo } from "@/components/Logo";

interface AuthProps {
  mode: "login" | "signup";
}

export default function Auth({ mode }: AuthProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();
  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setLoading(true);
    
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup ? { name, email, password } : { email, password };
      const { data } = await api.post(endpoint, payload);
      
      login(data);
      toast.success(isSignup ? "Account created!" : "Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — marketing illustration */}
      <div className="hidden lg:flex relative bg-gradient-mesh items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/10" />
        <div className="relative z-10 max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <Logo className="h-12 w-12 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-xl tracking-tight text-primary">FLOWGRID</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Enterprise Workflow</span>
            </div>
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              <Sparkles className="h-3 w-3" /> Built for high-performing teams
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Streamline execution with{" "}
              <span className="text-gradient">end-to-end visibility</span>.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Unify planning, execution, and reporting across your entire organization — with the clarity your team needs to move faster.
            </p>

            <div className="grid gap-3 pt-4">
              {["Adaptive kanban & structured list views", "Cross-functional team collaboration", "Intelligent analytics & reporting"].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full bg-success/15 flex items-center justify-center">
                    <CheckSquare2 className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-foreground/80">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="mt-12 rounded-xl border border-border bg-card/80 backdrop-blur p-4 shadow-elevated">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground">TODAY'S PROGRESS</span>
              <span className="text-xs text-success font-semibold">+24%</span>
            </div>
            <div className="space-y-2">
              {[80, 60, 45].map((w, i) => (
                <div key={i} className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-4">
            <Logo className="h-10 w-10 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg tracking-tight text-primary">FLOWGRID</span>
            </div>
          </Link>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isSignup ? "Set up your workspace" : "Welcome back"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {isSignup
                ? "Get your team aligned and operating at peak efficiency."
                : "Continue where your team left off."}
            </p>
          </div>

          {/* Social login */}
          <div className="grid gap-2.5">
            <Button variant="outline" className="h-11 font-medium gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-wider">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-1.5">
                <Label htmlFor="auth-name">Full name</Label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="auth-name" 
                    placeholder="Alex Morgan" 
                    className="pl-9 h-11" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="you@company.com"
                  className={cn("pl-9 h-11", emailError && "border-destructive focus-visible:ring-destructive")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-password">Password</Label>
                {!isSignup && (
                  <Link to="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="flex items-start gap-2">
                <Checkbox id="auth-terms" required className="mt-0.5" />
                <label htmlFor="auth-terms" className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-primary font-medium hover:underline">Terms</a>
                  {" "}and{" "}
                  <a href="#" className="text-primary font-medium hover:underline">Privacy Policy</a>.
                </label>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary hover:opacity-90 text-white shadow-glow gap-1.5">
              {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? "Sign in" : "Sign up free"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
