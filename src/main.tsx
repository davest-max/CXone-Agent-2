import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      <App />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
