import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginInput, loginSchema } from "@cookscorner/shared";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { errorMessage } from "@/lib/api";
import { startGoogleLogin } from "../auth.api";
import { useLogin, useProviders } from "../useAuth";

export function LoginCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useLogin();
  const { data: providers } = useProviders();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const googleFailed = searchParams.get("error") === "google";
  // Send people back where they came from after signing in.
  const next = searchParams.get("next") ?? "/dashboard";

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      navigate(next, { replace: true });
    } catch {
      // Rendered from login.error below.
    }
  });

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Inloggen</CardTitle>
        <CardDescription>Welkom terug bij CooksCorner.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          {googleFailed && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              Inloggen met Google is niet gelukt. Probeer het opnieuw of gebruik je wachtwoord.
            </p>
          )}

          {login.error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage(login.error, "Inloggen is niet gelukt")}
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jij@voorbeeld.nl"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || login.isPending}>
            {login.isPending ? "Bezig met inloggen..." : "Inloggen"}
          </Button>
        </form>

        {/* Only shown when the server actually has Google credentials
            configured, so the button can never lead to a dead end. */}
        {providers?.google && (
          <>
            <div className="relative my-5">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs uppercase text-muted-foreground">
                of
              </span>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={startGoogleLogin}>
              Doorgaan met Google
            </Button>
          </>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nog geen account?{" "}
          <Link to="/register" className="font-medium text-foreground underline underline-offset-4">
            Maak er een aan
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default LoginCard;
