import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      themes={["light", "dark", "semi-dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}