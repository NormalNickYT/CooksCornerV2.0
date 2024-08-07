import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export const LoginCard = () => {
  const handleOAuthSubmitEvent = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Card className="mx-auto items-center max-w-sm bg-light-background dark:bg-dark-background">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="dark:text-black"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="ml-auto inline-block text-sm underline"
                to={"/forgot"}
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              className="dark:text-black"
              id="password"
              type="password"
              placeholder="password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-dark-accent to-dark-primary"
          >
            Login
          </Button>
          <Button
            onClick={handleOAuthSubmitEvent}
            variant="outline"
            className="w-full dark:bg-dark-primary"
          >
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <br />
          <Link className="underline" to={"/register"}>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
