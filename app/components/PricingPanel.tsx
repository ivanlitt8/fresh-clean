import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PricingPanelProps {
  currentStep: number;
  totalSteps: number;
  selectedService: string;
  extras: string[];
  frequency: string;
  subtotal: number;
  discount: number;
  total: number;
  totalTime: number;
  onBack: () => void;
  onConfirm: () => Promise<void>;
}

export function PricingPanel({
  currentStep,
  totalSteps,
  selectedService,
  extras,
  frequency,
  subtotal,
  discount,
  total,
  totalTime,
  onBack,
  onConfirm,
}: PricingPanelProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const progress = (currentStep / totalSteps) * 100;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsConfirmed(true);
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirmed) {
    return (
      <Card className="p-8 space-y-6 text-center bg-white/80 backdrop-blur-sm border-blue-100">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-900">
            ¡Reserva Confirmada!
          </h2>
          <p className="text-gray-600 max-w-md">
            Gracias por confiar en nuestros servicios. Hemos recibido tu reserva
            y te enviaremos un correo electrónico con los detalles.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg w-full mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Servicio:</span>
                <span className="font-medium">{selectedService}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">{totalTime} horas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button className="w-full mt-6" onClick={() => router.push("/")}>
            Volver al Inicio
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24 p-6 space-y-6 bg-white/80 backdrop-blur-sm border-blue-100">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Resumen de Reserva</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Paso {currentStep} de {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Separator />

      {/* Selected Services */}
      <div className="space-y-4">
        <h4 className="font-medium">Servicios Seleccionados</h4>
        {selectedService ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">{selectedService}</span>
              <Badge variant="secondary">Servicio Base</Badge>
            </div>
            <div className="text-sm text-gray-600">
              Tiempo estimado: {totalTime} horas
            </div>
            {extras.map((extra, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{extra}</span>
                <span className="text-sm">+ $XX</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Selecciona un servicio para comenzar
          </p>
        )}
      </div>

      <Separator />

      {/* Frequency */}
      {frequency && (
        <>
          <div className="space-y-2">
            <h4 className="font-medium">Frecuencia</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm">{frequency}</span>
              {frequency !== "Una vez" && (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-200 bg-green-50"
                >
                  Descuento aplicado
                </Badge>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Pricing Summary */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="text-sm">Descuento</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold">Total Estimado</span>
          <span className="text-lg font-bold">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirmando Reserva...
            </>
          ) : (
            "Confirmar Reserva"
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onBack}
          disabled={isLoading}
        >
          Volver al Formulario
        </Button>
      </div>

      {/* Footer Info */}
      <p className="text-xs text-gray-500 text-center">
        Los precios pueden variar según requerimientos específicos
      </p>
    </Card>
  );
}
