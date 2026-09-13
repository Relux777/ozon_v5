// app/providers/theme-provider.tsx
"use client";

import { useEffect, type ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function useSuppressScriptTagWarning() {
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering")) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);
}

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  useSuppressScriptTagWarning();

  return (
    <NextThemesProvider
      attribute="data-theme"        // для ваших CSS-переменных
      defaultTheme="system"         // системная тема по умолчанию
      enableSystem={true}           // определять системную тему
      disableTransitionOnChange     // предотвращает мерцание при смене
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}