"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  calculatePrice,
  calculateTotalTime,
  TIME_FACTORS,
  FREQUENCY_DISCOUNTS,
} from "@/app/lib/pricing-config";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import BookingForm from "../components/BookingForm";
import { BubblesBackground } from "../components/BubblesBackground";
import { PricingPanel } from "../components/PricingPanel";
import { BookingService } from "../lib/firebase/bookingService";
import { toast } from "sonner";

export interface FormData {
  // Paso 1 - Selección de Servicio
  service: string;
  frequency: string;

  // Paso 2 - Detalles de la Propiedad
  levels: string;
  bedrooms: string;
  bathrooms: string;
  images: File[];

  // Paso 3 - Fecha y Hora
  date: Date | null;
  time: string;
  additionalNotes: string;

  // Paso 4 - Información Personal
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  acceptTerms: boolean;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPricing, setShowPricing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    service: "",
    frequency: "",
    levels: "",
    bedrooms: "",
    bathrooms: "",
    images: [],
    date: null,
    time: "",
    additionalNotes: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    acceptTerms: false,
  });

  const steps = [
    { id: 1, title: "Selección de Servicio" },
    { id: 2, title: "Detalles de la Propiedad" },
    { id: 3, title: "Fecha y Hora" },
    { id: 4, title: "Información Personal" },
    { id: 5, title: "Resumen y Confirmación" },
  ];

  const [pricing, setPricing] = useState({
    totalTime: 0,
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
  });
  const [extras, setExtras] = useState<string[]>([]);

  // Efecto para calcular precios cuando cambian los datos relevantes
  useEffect(() => {
    if (
      formData.service &&
      formData.levels &&
      formData.bedrooms &&
      formData.bathrooms &&
      formData.frequency
    ) {
      try {
        const calculatedPricing = calculatePrice(
          formData.service as any, // Temporal fix para el tipo
          formData.levels as any,
          formData.bedrooms as any,
          formData.bathrooms as any,
          formData.frequency as any
        );
        setPricing(calculatedPricing);
      } catch (error) {
        console.error("Error calculating price:", error);
      }
    }
  }, [
    formData.service,
    formData.levels,
    formData.bedrooms,
    formData.bathrooms,
    formData.frequency,
  ]);

  // Log para seguimiento de datos del formulario
  useEffect(() => {
    console.log("=== FORM DATA UPDATE ===");
    console.log("Current Step:", currentStep);
    console.log("Form Data:", {
      // Paso 1
      service: formData.service || "No seleccionado",
      frequency: formData.frequency || "No seleccionado",

      // Paso 2
      levels: formData.levels || "No seleccionado",
      bedrooms: formData.bedrooms || "No seleccionado",
      bathrooms: formData.bathrooms || "No seleccionado",
      images: formData.images?.length || 0,

      // Paso 3
      date: formData.date ? formData.date.toISOString() : "No seleccionado",
      time: formData.time || "No seleccionado",
      additionalNotes: formData.additionalNotes ? "Tiene notas" : "Sin notas",

      // Paso 4
      firstName: formData.firstName || "Vacío",
      lastName: formData.lastName || "Vacío",
      email: formData.email || "Vacío",
      phone: formData.phone || "Vacío",
      address: formData.address || "Vacío",
      acceptTerms: formData.acceptTerms ? "Aceptado" : "No aceptado",
    });

    // Log de cálculos de tiempo y precio si hay suficientes datos
    if (
      formData.service &&
      formData.levels &&
      formData.bedrooms &&
      formData.bathrooms &&
      formData.frequency
    ) {
      const duration = calculateTotalTime(
        formData.service as any,
        formData.levels as any,
        formData.bedrooms as any,
        formData.bathrooms as any
      );

      console.log("=== SERVICE TIME CALCULATION ===");
      console.log("Desglose de tiempo:", {
        servicio: formData.service,
        niveles: `${formData.levels} (${
          TIME_FACTORS.levels[
            formData.levels as keyof typeof TIME_FACTORS.levels
          ]
        } horas)`,
        dormitorios: `${formData.bedrooms} (${
          TIME_FACTORS.bedrooms[
            formData.bedrooms as keyof typeof TIME_FACTORS.bedrooms
          ]
        } horas)`,
        baños: `${formData.bathrooms} (${
          TIME_FACTORS.bathrooms[
            formData.bathrooms as keyof typeof TIME_FACTORS.bathrooms
          ]
        } horas)`,
        tiempoTotal: `${duration} horas`,
      });

      console.log("=== PRICE CALCULATIONS ===");
      console.log("Pricing:", {
        basePrice: `$${pricing.basePrice}`,
        discount: `$${pricing.discount} (${
          FREQUENCY_DISCOUNTS[
            formData.frequency as keyof typeof FREQUENCY_DISCOUNTS
          ] * 100
        }%)`,
        finalPrice: `$${pricing.finalPrice}`,
        totalTime: `${pricing.totalTime} horas`,
      });
    }
  }, [formData, currentStep, pricing]);

  const services = [
    {
      title: "Airbnb Cleaning",
      description:
        "Airbnb cleaning services are professional services specifically designed to clean Airbnb properties.",
      image:
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3",
    },
    {
      title: "After Construction Cleaning",
      description:
        "Do you need professional and reliable after-construction cleaning services in Sydney? Look no further",
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3",
    },
    {
      title: "End of Lease Cleaning",
      description:
        "No Sweat Cleaning is a professional cleaning company that specialises in end-of-lease cleaning.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Residential Cleaning",
      description:
        "Do you ever feel like you're constantly cleaning your house, but it never seems clean enough?",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Deep Cleaning",
      description:
        "Are you looking for a professional cleaning service that specialises in deep cleaning?",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Carpet Cleaning",
      description:
        "Let us delve into the world of carpet cleaning and discover how No Sweat Cleaning can transform your space.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Commercial Cleaning",
      description:
        "When it comes to maintaining a clean and sanitary work environment, businesses in Sydney's Northern Beaches turn to No Sweat Cleaning.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Office Cleaning",
      description:
        "A clean office creates a positive impression on visitors and employees alike. It shows that the company is organised, professional, and cares about its employees.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
    {
      title: "Strata Cleaning",
      description:
        "In properties with strata titles, such as apartment buildings, condominiums, or business complexes, common areas are cleaned and maintained as part of the strata cleaning service.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3",
    },
  ];

  const handleConfirmBooking = async () => {
    const bookingService = new BookingService();

    try {
      // Crear el objeto de reserva
      const bookingData = {
        clientInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        serviceDetails: {
          serviceType: formData.service,
          levels: formData.levels,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          frequency: formData.frequency,
          additionalNotes: formData.additionalNotes,
        },
        timing: {
          date: formData.date?.toISOString().split("T")[0] || "",
          startTime: formData.time,
          endTime: "", // Se calculará en el servicio
          duration: calculateTotalTime(
            formData.service as any,
            formData.levels as any,
            formData.bedrooms as any,
            formData.bathrooms as any
          ),
        },
        pricing: {
          basePrice: pricing.basePrice,
          discount: pricing.discount,
          finalPrice: pricing.finalPrice,
        },
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Log de la estructura final antes de enviar
      console.log("=== BOOKING DATA TO SEND ===");
      console.log("Final Booking Structure:", bookingData);

      // Crear la reserva
      const bookingId = await bookingService.createBooking(bookingData);

      // Log del resultado
      console.log("=== BOOKING CREATED ===");
      console.log("Booking ID:", bookingId);

      toast.success("¡Reserva creada con éxito!");

      // Aquí podrías redirigir a una página de confirmación
      // router.push(`/booking/confirmation/${bookingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error al crear la reserva. Por favor, intenta nuevamente.");
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* WhatsApp button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#ffffff" />
      </a>

      {/* Fondo de burbujas */}
      <div className="absolute inset-0">
        <BubblesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-blue-600/20 backdrop-blur-[2px]" />
      </div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-24">
          <div className="bg-transparent rounded-lg p-8">
            {/* Header con pasos */}
            <div className="relative pb-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Book your Service
                </h1>
                <p className="text-lg text-gray-600">
                  Complete the form to schedule your cleaning service
                </p>
              </div>

              {/* Indicador de pasos */}
              <div className="flex justify-center items-center">
                <div className="grid grid-cols-5 gap-2 md:gap-4 w-full max-w-2xl px-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-center"
                    >
                      <div className="flex-1 flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            currentStep >= step.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step.id}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`h-1 w-full mx-1 md:mx-2 ${
                              currentStep > step.id
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Títulos de los pasos en móvil */}
              <div className="mt-2 md:hidden">
                <p className="text-sm text-center text-gray-600">
                  Paso {currentStep}: {steps[currentStep - 1]?.title}
                </p>
              </div>
            </div>

            {/* Container para Formulario o Panel de Precios */}
            <div className="max-w-2xl mx-auto">
              {!showPricing ? (
                <BookingForm
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  formData={formData}
                  setFormData={setFormData}
                  steps={steps}
                  onConfirm={() => setShowPricing(true)}
                />
              ) : (
                <PricingPanel
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  selectedService={formData.service}
                  extras={extras}
                  frequency={formData.frequency}
                  subtotal={pricing.basePrice}
                  discount={pricing.discount}
                  total={pricing.finalPrice}
                  totalTime={pricing.totalTime}
                  onBack={() => setShowPricing(false)}
                  onConfirm={handleConfirmBooking}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
