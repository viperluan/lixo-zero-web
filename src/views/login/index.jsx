import { Lock, Mail } from 'lucide-react';
import { Button, Card, CardBody, FormGroup, Input, Label } from '~components/ui';

const Login = () => {
  return (
    <div className="mx-auto w-full max-w-md px-4">
      <Card>
        <CardBody className="p-8">
          <h1 className="mb-6 text-center font-display text-2xl text-brand-primary-dark">Entrar</h1>

          <form>
            <FormGroup>
              <Label htmlFor="login-email">E-mail</Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="login-email"
                  className="pl-10"
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="login-password">Senha</Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="login-password"
                  className="pl-10"
                  placeholder="Senha"
                  type="password"
                  autoComplete="current-password"
                />
              </div>
            </FormGroup>

            <label className="flex items-center gap-2 text-sm text-gray-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-primary-dark focus:ring-brand-primary-dark/30"
              />
              Lembrar
            </label>

            <Button className="mt-6 w-full" type="button">
              Entrar
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
