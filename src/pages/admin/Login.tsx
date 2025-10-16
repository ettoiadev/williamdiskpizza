/**
 * Admin Login Page
 * 
 * Página de login para área administrativa.
 * Autentica usuários admin/editor para acessar o CMS.
 * 
 * @module pages/admin/Login
 */

import { useState, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pizza, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Login - Página de autenticação administrativa
 * 
 * @example
 * ```typescript
 * // No router
 * <Route path="/admin/login" element={<Login />} />
 * ```
 */
export default function Login() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se já estiver autenticado, redirecionar para dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  /**
   * Handler do formulário de login
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validações básicas
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError);
        setLoading(false);
        return;
      }

      // Sucesso - mostrar toast e redirecionar
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo ao painel administrativo.',
      });

      navigate('/admin/dashboard');
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Pizza className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            William Disk Pizza
          </h1>
          <p className="text-gray-600 mt-2">Painel Administrativo</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Erro */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Esqueci minha senha */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    toast({
                      title: 'Recuperação de senha',
                      description: 'Entre em contato com o administrador do sistema.',
                    });
                  }}
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full pizza-gradient text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Dica para desenvolvimento */}
            {import.meta.env.DEV && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-xs text-blue-800 font-semibold mb-2">
                  🔧 Credenciais de Teste (DEV)
                </p>
                <p className="text-xs text-blue-600 font-mono">
                  Email: admin@admin.com<br />
                  Senha: 123456
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            © 2025 William Disk Pizza - Sistema Administrativo
          </p>
        </div>
      </div>
    </div>
  );
}
