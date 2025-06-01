"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, Menu, X } from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export const Navbar = () => {
  const [showLocations, setShowLocations] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigateToSection } = useNavigation();

  const locations = [
    "Downtown",
    "North Side",
    "South Side",
    "East Side",
    "West Side",
  ];

  const servicesList = [
    "House Cleaning",
    "Office Cleaning",
    "Deep Cleaning",
    "Move-in/Move-out Cleaning",
    "Post-construction Cleaning",
  ];

  // Cerrar menú móvil al redimensionar ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
    }),
  };

  const handleNavigation = (sectionId: string) => {
    // Cerrar menús
    setIsMenuOpen(false);
    setShowServices(false);
    setShowLocations(false);
    // Navegar a la sección
    navigateToSection("/", sectionId);
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">Fresh & Clean</span>
          </div>

          {/* Botón de menú móvil */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>

          {/* Menú de escritorio */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <motion.button
              onClick={() => handleNavigation("about")}
              className="text-gray-600 hover:text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              About
            </motion.button>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowServices(true)}
              onMouseLeave={() => setShowServices(false)}
            >
              <motion.button
                className="text-gray-600 hover:text-primary flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </motion.button>
              <AnimatePresence>
                {showServices && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                  >
                    {servicesList.map((service, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleNavigation("services")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        whileHover={{ x: 5 }}
                        custom={index}
                        variants={menuItemVariants}
                        initial="closed"
                        animate="open"
                      >
                        {service}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Locations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowLocations(true)}
              onMouseLeave={() => setShowLocations(false)}
            >
              <motion.button
                className="text-gray-600 hover:text-primary flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Locations <ChevronDown className="ml-1 h-4 w-4" />
              </motion.button>
              <AnimatePresence>
                {showLocations && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                  >
                    {locations.map((location, index) => (
                      <motion.button
                        key={index}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        whileHover={{ x: 5 }}
                        custom={index}
                        variants={menuItemVariants}
                        initial="closed"
                        animate="open"
                      >
                        {location}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => handleNavigation("contact")}
              className="text-gray-600 hover:text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => handleNavigation("contact")}>
                Book Now
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 py-4">
                <motion.button
                  variants={menuItemVariants}
                  custom={0}
                  onClick={() => handleNavigation("about")}
                  className="text-left text-gray-600 hover:text-primary px-4 py-2"
                >
                  About
                </motion.button>

                {/* Services en móvil */}
                <div className="px-4">
                  <motion.button
                    variants={menuItemVariants}
                    custom={1}
                    onClick={() => setShowServices(!showServices)}
                    className="text-left text-gray-600 hover:text-primary flex items-center"
                  >
                    Services <ChevronDown className="ml-1 h-4 w-4" />
                  </motion.button>
                  <AnimatePresence>
                    {showServices && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2 pl-4"
                      >
                        {servicesList.map((service, index) => (
                          <motion.button
                            key={index}
                            variants={menuItemVariants}
                            custom={index + 2}
                            onClick={() => handleNavigation("services")}
                            className="block w-full text-left py-2 text-sm text-gray-700 hover:text-primary"
                          >
                            {service}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Locations en móvil */}
                <div className="px-4">
                  <motion.button
                    variants={menuItemVariants}
                    custom={2}
                    onClick={() => setShowLocations(!showLocations)}
                    className="text-left text-gray-600 hover:text-primary flex items-center"
                  >
                    Locations <ChevronDown className="ml-1 h-4 w-4" />
                  </motion.button>
                  <AnimatePresence>
                    {showLocations && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2 pl-4"
                      >
                        {locations.map((location, index) => (
                          <motion.button
                            key={index}
                            variants={menuItemVariants}
                            custom={index + 3}
                            onClick={() => setShowLocations(false)}
                            className="block w-full text-left py-2 text-sm text-gray-700 hover:text-primary"
                          >
                            {location}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  variants={menuItemVariants}
                  custom={3}
                  onClick={() => handleNavigation("contact")}
                  className="text-left text-gray-600 hover:text-primary px-4 py-2"
                >
                  Contact
                </motion.button>

                <motion.div
                  variants={menuItemVariants}
                  custom={4}
                  className="px-4"
                >
                  <Button
                    onClick={() => handleNavigation("contact")}
                    className="w-full"
                  >
                    Book Now
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
