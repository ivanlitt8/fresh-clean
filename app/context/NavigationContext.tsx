"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavigationContextType {
  scrollToSection: (sectionId: string) => void;
  navigateToSection: (path: string, sectionId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Obtener la altura del navbar (64px = h-16)
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navigateToSection = (path: string, sectionId: string) => {
    if (pathname === path) {
      // Si estamos en la misma página, agregamos un pequeño delay para permitir que se cierre el menú
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300); // Aumentamos el delay para dar tiempo a la animación del menú
    } else {
      // Si estamos en una página diferente, navegamos y luego hacemos scroll
      router.push(path);
      // Esperamos a que la navegación se complete y el menú se cierre
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 500); // Aumentamos el delay para la navegación entre páginas
    }
  };

  // Manejar el scroll cuando se navega con hash en la URL
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ scrollToSection, navigateToSection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
