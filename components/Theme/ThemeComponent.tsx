import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function ThemeComponent() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Button
        variant="ghost"
        className="hover:cursor-pointer items-center justify-center"
        onClick={() =>
          theme === "dark" ? setTheme(() => "light") : setTheme(() => "dark")
        }
      >
        {" Theme"}
        {theme === "light" ? <Sun /> : <Moon />}
      </Button>
    </>
  );
}
export default ThemeComponent;
