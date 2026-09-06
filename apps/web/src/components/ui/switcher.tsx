import { Moon, Sun } from "lucide-react";
import useDarkSide from "@/hooks/useDarkSide";
import { Button } from "@/components/ui/button";

export default function Switcher() {
  const [theme, setTheme] = useDarkSide();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={next === "dark" ? "Schakel naar donker thema" : "Schakel naar licht thema"}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
