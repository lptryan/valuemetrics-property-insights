import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/admin");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[380px] space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy">
            <span className="text-sky font-bold text-sm">vm</span>
          </div>
          <span className="text-lg font-bold text-navy">Valuemetrics</span>
        </div>

        <div className="bg-card rounded-xl border border-border p-8">
          <h1 className="text-xl font-bold text-navy text-center mb-1">Admin Login</h1>
          <p className="text-sm text-mid text-center mb-6">
            Sign in to access the dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-navy">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@valuemetrics.io"
                required
                className="rounded-md"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-navy">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-md"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md bg-navy text-sky hover:bg-navy/90 font-semibold"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
