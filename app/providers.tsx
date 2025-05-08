"use client";
import ThemeProvider from "./theme-provider";

function ShadCnThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
}
export default ShadCnThemeProvider;
