import { zodResolver } from "@hookform/resolvers/zod";
import { type RegisterInput, registerSchema } from "@cookscorner/shared";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { useProviders, useRegister } from "../useAuth";

/**
 * Account creation.
 *
 * The validation rules come from the same Zod schema the API enforces, so the
 * browser and the server always agree on what a valid password is.
 */
export function RegisterCard() {
  const navigate = useNavigate();
  const registerUser = useRegister();
  const { data: providers } = useProviders();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser.mutateAsync(values);
      navigate("/dashboard", { replace: true });
    } catch {
      // Rendered from registerUser.error below.
    }
  });

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Account aanmaken</CardTitle>
        <CardDescription>Deel je recepten met je familie.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          {registerUser.error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage(registerUser.error, "Registreren is niet gelukt")}
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Naam</Label>
            <Input id="name" autoComplete="name" placeholder="Nick" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Gebruikersnaam</Label>
            <Input
              id="username"
              autoComplete="username"
              placeholder="nick"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

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
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Minstens 10 tekens.</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Herhaal wachtwoord</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || registerUser.isPending}>
            {registerUser.isPending ? "Bezig..." : "Account aanmaken"}
          </Button>
        </form>

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
          Heb je al een account?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Inloggen
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default RegisterCard;
