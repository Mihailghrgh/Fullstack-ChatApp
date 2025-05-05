"use client";
import ThemeProvider from "./theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
      >
        {children}
      </ThemeProvider>
    </>
  );
}
export default Providers;
