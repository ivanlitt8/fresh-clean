"use client";

import { Dispatch, SetStateAction } from "react";
import { FormData } from "@/app/book/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Upload } from "lucide-react";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";

interface BookingFormProps {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  steps: { id: number; title: string }[];
  onConfirm: () => void;
}

const services = [
  "Deep Cleaning",
  "Regular Cleaning",
  "Move In/Out Cleaning",
  "Post Construction Cleaning",
  "Office Cleaning",
];

const frequencies = ["Una vez", "Semanal", "Quincenal", "Mensual"];

const levels = ["1", "2", "3", "4", "5+"];
const bedrooms = ["1", "2", "3", "4", "5+"];
const bathrooms = ["1", "2", "3", "4", "5+"];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Funciones de validación por paso
const validateStep1 = (formData: FormData): boolean => {
  return Boolean(formData.service && formData.frequency);
};

const validateStep2 = (formData: FormData): boolean => {
  return Boolean(formData.levels && formData.bedrooms && formData.bathrooms);
};

const validateStep3 = (formData: FormData): boolean => {
  return Boolean(formData.date && formData.time);
};

const validateStep4 = (formData: FormData): boolean => {
  return Boolean(
    formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.email?.trim() &&
      formData.phone?.trim() &&
      formData.address?.trim() &&
      formData.acceptTerms
  );
};

export default function BookingForm({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  steps,
  onConfirm,
}: BookingFormProps) {
  // Función para validar el paso actual
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1(formData);
      case 2:
        return validateStep2(formData);
      case 3:
        return validateStep3(formData);
      case 4:
        return validateStep4(formData);
      case 5:
        return true; // El paso 5 es solo resumen
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderServiceSelection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          Tipo de Servicio <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.service}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, service: value }))
          }
        >
          <SelectTrigger className={!formData.service ? "border-red-200" : ""}>
            <SelectValue placeholder="Selecciona un servicio" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Frecuencia <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.frequency}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, frequency: value }))
          }
        >
          <SelectTrigger
            className={!formData.frequency ? "border-red-200" : ""}
          >
            <SelectValue placeholder="Selecciona la frecuencia" />
          </SelectTrigger>
          <SelectContent>
            {frequencies.map((frequency) => (
              <SelectItem key={frequency} value={frequency}>
                {frequency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>
            Niveles <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.levels}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, levels: value }))
            }
          >
            <SelectTrigger className={!formData.levels ? "border-red-200" : ""}>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Dormitorios <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.bedrooms}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bedrooms: value }))
            }
          >
            <SelectTrigger
              className={!formData.bedrooms ? "border-red-200" : ""}
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {bedrooms.map((bedroom) => (
                <SelectItem key={bedroom} value={bedroom}>
                  {bedroom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Baños <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.bathrooms}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bathrooms: value }))
            }
          >
            <SelectTrigger
              className={!formData.bathrooms ? "border-red-200" : ""}
            >
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {bathrooms.map((bathroom) => (
                <SelectItem key={bathroom} value={bathroom}>
                  {bathroom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imágenes (Opcional)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setFormData((prev) => ({ ...prev, images: files }));
            }}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-1" />
            <span className="text-gray-600 text-sm">
              Arrastra tus imágenes aquí o haz clic para subir
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              Tamaño máximo: 5MB
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDateAndTime = () => (
    <DateTimeSelector formData={formData} setFormData={setFormData} />
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            placeholder="Tu nombre"
            className={!formData.firstName?.trim() ? "border-red-200" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Apellido <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Tu apellido"
            className={!formData.lastName?.trim() ? "border-red-200" : ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="tu@email.com"
          className={!formData.email?.trim() ? "border-red-200" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Teléfono <span className="text-red-500">*</span>
        </Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="+1 234 567 8900"
          className={!formData.phone?.trim() ? "border-red-200" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Dirección del Servicio <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          placeholder="Ingresa la dirección completa donde se realizará el servicio"
          className={!formData.address?.trim() ? "border-red-200" : ""}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              acceptTerms: checked as boolean,
            }))
          }
          className={!formData.acceptTerms ? "border-red-200" : ""}
        />
        <label
          htmlFor="terms"
          className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            !formData.acceptTerms ? "text-red-500" : "text-gray-600"
          }`}
        >
          Acepto los términos y condiciones{" "}
          <span className="text-red-500">*</span>
        </label>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-lg">Resumen de la Reserva</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Servicio:</span>
            <p className="font-medium">{formData.service}</p>
          </div>
          <div>
            <span className="text-gray-600">Frecuencia:</span>
            <p className="font-medium">{formData.frequency}</p>
          </div>
          <div>
            <span className="text-gray-600">Fecha:</span>
            <p className="font-medium">
              {formData.date && format(formData.date, "PPP", { locale: es })}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Hora:</span>
            <p className="font-medium">{formData.time}</p>
          </div>
          <div>
            <span className="text-gray-600">Nombre:</span>
            <p className="font-medium">{`${formData.firstName} ${formData.lastName}`}</p>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div>
            <span className="text-gray-600">Teléfono:</span>
            <p className="font-medium">{formData.phone}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Dirección:</span>
            <p className="font-medium">{formData.address}</p>
          </div>
        </div>

        {formData.additionalNotes && (
          <div className="col-span-2">
            <span className="text-gray-600">Notas Adicionales:</span>
            <p className="font-medium">{formData.additionalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderServiceSelection();
      case 2:
        return renderPropertyDetails();
      case 3:
        return renderDateAndTime();
      case 4:
        return renderPersonalInfo();
      case 5:
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">{renderStepContent()}</div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Anterior
        </Button>
        {currentStep === steps.length ? (
          <Button onClick={onConfirm} disabled={!isCurrentStepValid()}>
            Confirmar Reserva
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!isCurrentStepValid()}>
            {isCurrentStepValid() ? (
              "Siguiente"
            ) : (
              <span className="text-sm">Siguiente</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
