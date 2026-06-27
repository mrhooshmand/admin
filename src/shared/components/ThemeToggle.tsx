import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button variant="ghost" size="icon" aria-label="Submit" onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
    );
}