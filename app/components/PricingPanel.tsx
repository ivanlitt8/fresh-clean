import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
  onConfirm: () => void;
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
  const progress = (currentStep / totalSteps) * 100;

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
          onClick={onConfirm}
        >
          Confirmar Reserva
        </Button>
        <Button variant="outline" className="w-full" onClick={onBack}>
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
