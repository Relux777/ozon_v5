// app/providers/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ComponentProps } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
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