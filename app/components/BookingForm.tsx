"use client";

import { Dispatch, SetStateAction } from "react";
import { FormData } from "../book/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function BookingForm({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  steps,
  onConfirm,
}: BookingFormProps) {
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
        <Label>Tipo de Servicio</Label>
        <Select
          value={formData.service}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, service: value }))
          }
        >
          <SelectTrigger>
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
        <Label>Frecuencia</Label>
        <Select
          value={formData.frequency}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, frequency: value }))
          }
        >
          <SelectTrigger>
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
          <Label>Niveles</Label>
          <Select
            value={formData.levels}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, levels: value }))
            }
          >
            <SelectTrigger>
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
          <Label>Dormitorios</Label>
          <Select
            value={formData.bedrooms}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bedrooms: value }))
            }
          >
            <SelectTrigger>
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
          <Label>Baños</Label>
          <Select
            value={formData.bathrooms}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bathrooms: value }))
            }
          >
            <SelectTrigger>
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Fecha</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date
                ? format(formData.date, "PPP", { locale: es })
                : "Selecciona una fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.date || undefined}
              onSelect={(date) =>
                setFormData((prev) => ({ ...prev, date: date || null }))
              }
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Hora</Label>
        <Select
          value={formData.time}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, time: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona hora" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Notas Adicionales</Label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              additionalNotes: e.target.value,
            }))
          }
          placeholder="Instrucciones especiales, acceso, etc..."
        />
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            placeholder="Tu nombre"
          />
        </div>
        <div className="space-y-2">
          <Label>Apellido</Label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Tu apellido"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="tu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="+1 234 567 8900"
        />
      </div>

      <div className="space-y-2">
        <Label>Dirección del Servicio</Label>
        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          placeholder="Ingresa la dirección completa donde se realizará el servicio"
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
        />
        <label
          htmlFor="terms"
          className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Acepto los términos y condiciones
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
          <Button onClick={onConfirm}>Confirmar Reserva</Button>
        ) : (
          <Button onClick={handleNext}>Siguiente</Button>
        )}
      </div>
    </div>
  );
}
