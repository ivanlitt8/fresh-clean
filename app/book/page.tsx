"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  calculatePrice,
  calculateTotalTime,
  calculateTotalRooms,
  FREQUENCY_DISCOUNTS,
  SERVICES_CONFIG,
} from "@/app/lib/pricing-config";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import BookingForm from "@/app/components/BookingForm";
import { BubblesBackground } from "@/app/components/BubblesBackground";
import { PricingPanel } from "@/app/components/PricingPanel";
import { BookingService } from "@/app/lib/firebase";
import { toast } from "sonner";
import { EmailService } from "@/app/lib/email/emailService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Booking } from "@/app/types/booking";

export interface FormData {
  // Paso 1 - Selección de Servicio
  service: string;
  frequency: string;

  // Paso 2 - Detalles de Ambientes
  bedrooms: string;
  bathrooms: string;
  kitchens: string;
  livingRooms: string;
  otherSpaces: string;
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
  postalCode: string;
  acceptTerms: boolean;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPricing, setShowPricing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    service: "",
    frequency: "",
    bedrooms: "0",
    bathrooms: "0",
    kitchens: "0",
    livingRooms: "0",
    otherSpaces: "0",
    images: [],
    date: null,
    time: "",
    additionalNotes: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    acceptTerms: false,
  });

  const steps = [
    { id: 1, title: "Service Selection" },
    { id: 2, title: "Property Details" },
    { id: 3, title: "Date and Time" },
    { id: 4, title: "Personal Information" },
    { id: 5, title: "Summary and Confirmation" },
  ];

  const [pricing, setPricing] = useState<{
    totalTime: number;
    basePrice: number;
    discount: number;
    finalPrice: number;
    firstTimeDiscount?: number;
    totalDiscountRate: number;
  }>({
    totalTime: 0,
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    // firstTimeDiscount solo se asigna si corresponde
    totalDiscountRate: 0,
  });
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [extras, setExtras] = useState<string[]>([]);

  // Efecto para verificar si el email es primera vez y calcular precios
  useEffect(() => {
    const checkFirstTimeAndCalculate = async () => {
      if (
        formData.service &&
        formData.frequency &&
        formData.email &&
        (parseInt(formData.bedrooms) > 0 ||
          parseInt(formData.bathrooms) > 0 ||
          parseInt(formData.kitchens) > 0 ||
          parseInt(formData.livingRooms) > 0 ||
          parseInt(formData.otherSpaces) > 0)
      ) {
        try {
          const bookingService = new BookingService();
          // Verificar si el email ya tiene booking
          const emailExists = await bookingService.emailHasBooking?.(
            formData.email
          );
          setIsFirstTime(emailExists === false);
          const FIRST_TIME_DISCOUNT = 0.1;
          const frequencyDiscount =
            FREQUENCY_DISCOUNTS[
              formData.frequency as keyof typeof FREQUENCY_DISCOUNTS
            ] || 0;
          const firstTimeDiscountRate =
            emailExists === false ? FIRST_TIME_DISCOUNT : 0;
          const totalDiscountRate = frequencyDiscount + firstTimeDiscountRate;
          // Calcula el precio base
          const calculatedPricing = calculatePrice(
            formData.service as any,
            formData.bedrooms,
            formData.bathrooms,
            formData.kitchens,
            formData.livingRooms,
            formData.otherSpaces,
            formData.frequency as any,
            0 // No aplicar descuento aquí, lo calculamos abajo
          );
          // Calcula los descuentos por separado
          const discount = calculatedPricing.basePrice * frequencyDiscount;
          const firstTimeDiscount =
            calculatedPricing.basePrice * firstTimeDiscountRate;
          const finalPrice =
            calculatedPricing.basePrice - discount - firstTimeDiscount;
          setPricing({
            ...calculatedPricing,
            discount,
            firstTimeDiscount:
              firstTimeDiscount > 0 ? firstTimeDiscount : undefined,
            finalPrice,
            totalDiscountRate,
          });
        } catch (error) {
          console.error("Error calculating price:", error);
        }
      }
    };
    checkFirstTimeAndCalculate();
  }, [
    formData.service,
    formData.bedrooms,
    formData.bathrooms,
    formData.kitchens,
    formData.livingRooms,
    formData.otherSpaces,
    formData.frequency,
    formData.email,
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
      bedrooms: formData.bedrooms || "No seleccionado",
      bathrooms: formData.bathrooms || "No seleccionado",
      kitchens: formData.kitchens || "No seleccionado",
      livingRooms: formData.livingRooms || "No seleccionado",
      otherSpaces: formData.otherSpaces || "No seleccionado",
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
      postalCode: formData.postalCode || "Vacío",
      acceptTerms: formData.acceptTerms ? "Aceptado" : "No aceptado",
    });

    // Log de cálculos de tiempo y precio si hay suficientes datos
    if (
      formData.service &&
      formData.frequency &&
      (parseInt(formData.bedrooms) > 0 ||
        parseInt(formData.bathrooms) > 0 ||
        parseInt(formData.kitchens) > 0 ||
        parseInt(formData.livingRooms) > 0 ||
        parseInt(formData.otherSpaces) > 0)
    ) {
      const totalRooms = calculateTotalRooms(
        formData.bedrooms,
        formData.bathrooms,
        formData.kitchens,
        formData.livingRooms,
        formData.otherSpaces
      );

      const duration = calculateTotalTime(
        formData.service as any,
        formData.bedrooms,
        formData.bathrooms,
        formData.kitchens,
        formData.livingRooms,
        formData.otherSpaces
      );

      console.log("=== SERVICE TIME CALCULATION ===");
      console.log("Desglose de ambientes:", {
        servicio: formData.service,
        dormitorios: `${formData.bedrooms}`,
        baños: `${formData.bathrooms}`,
        cocinas: `${formData.kitchens}`,
        salas: `${formData.livingRooms}`,
        otros: `${formData.otherSpaces}`,
        totalAmbientes: `${totalRooms} ambientes`,
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

  const handleConfirmBooking = async () => {
    const bookingService = new BookingService();
    const emailService = new EmailService();

    // Log de la estructura final antes de enviar
    console.log("=== BOOKING DATA TO SEND ===");

    // Crear el objeto de reserva
    const bookingData = {
      clientInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
      },
      serviceDetails: {
        serviceType: formData.service,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        kitchens: formData.kitchens,
        livingRooms: formData.livingRooms,
        otherSpaces: formData.otherSpaces,
        frequency: formData.frequency,
        additionalNotes: formData.additionalNotes,
        firstTimeDiscountApplied: isFirstTime === true,
      },
      timing: {
        date: formData.date?.toISOString().split("T")[0] || "",
        startTime: formData.time,
        endTime: "", // Se calculará en el servicio
        duration: calculateTotalTime(
          formData.service as any,
          formData.bedrooms,
          formData.bathrooms,
          formData.kitchens,
          formData.livingRooms,
          formData.otherSpaces
        ),
      },
      pricing: {
        basePrice: pricing.basePrice,
        discount: pricing.discount,
        finalPrice: pricing.finalPrice,
        firstTimeDiscount:
          typeof pricing.firstTimeDiscount === "number"
            ? pricing.firstTimeDiscount
            : 0,
        totalDiscountRate: pricing.totalDiscountRate,
      },
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Final Booking Structure:", bookingData);

    try {
      // Crear la(s) reserva(s)
      const bookingIds = await bookingService.createBooking(bookingData);
      console.log("=== BOOKING(S) CREATED ===");
      console.log("Booking IDs:", bookingIds);

      // Obtener las reservas creadas para enviar el email
      const bookings = await Promise.all(
        bookingIds.map(async (id) => {
          const bookingRef = doc(db, "bookings", id);
          const bookingDoc = await getDoc(bookingRef);
          return { id, ...bookingDoc.data() } as Booking;
        })
      );

      // Enviar email de confirmación
      try {
        if (bookings.length > 1) {
          await emailService.sendRecurringBookingConfirmation(bookings);
        } else {
          await emailService.sendBookingConfirmation(bookings[0]);
        }
      } catch (emailError) {
        console.error("Error al enviar el email:", emailError);
        // No lanzamos el error aquí para no afectar la experiencia del usuario
      }

      // Mensaje de éxito específico según el tipo de reserva
      const isRecurring = formData.frequency !== "One time";
      const successMessage = isRecurring
        ? `${bookingIds.length} bookings created successfully!`
        : "Booking created successfully!";

      toast.success(successMessage);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error creating booking. Please try again.");
      throw error;
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* WhatsApp button */}
      <a
        href="https://wa.me/61426459726"
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
                  Step {currentStep}: {steps[currentStep - 1]?.title}
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
                  firstTimeDiscount={pricing.firstTimeDiscount}
                  totalDiscountRate={pricing.totalDiscountRate}
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
