import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import { BookingService } from "@/app/lib/firebase";
import { TimeSlot } from "@/app/types/booking";
import { calculateTotalTime } from "@/app/lib/pricing-config";
import { FormData } from "@/app/book/page";

interface DateTimeSelectorProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const DateTimeSelector = ({
  formData,
  setFormData,
}: DateTimeSelectorProps) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const bookingService = new BookingService();

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (
        formData.date &&
        formData.service &&
        formData.levels &&
        formData.bedrooms &&
        formData.bathrooms
      ) {
        setIsLoadingSlots(true);
        try {
          const duration = calculateTotalTime(
            formData.service as any,
            formData.levels as any,
            formData.bedrooms as any,
            formData.bathrooms as any
          );

          const slots = await bookingService.checkAvailability(
            formData.date.toISOString().split("T")[0],
            duration
          );
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Error fetching available slots:", error);
        } finally {
          setIsLoadingSlots(false);
        }
      }
    };

    fetchAvailableSlots();
  }, [
    formData.date,
    formData.service,
    formData.levels,
    formData.bedrooms,
    formData.bathrooms,
  ]);

  return (
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
                setFormData({ ...formData, date: date || null })
              }
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Hora</Label>
        {isLoadingSlots ? (
          <div className="text-center py-4">
            <span className="text-sm text-gray-500">
              Cargando horarios disponibles...
            </span>
          </div>
        ) : availableSlots.length > 0 ? (
          <Select
            value={formData.time}
            onValueChange={(value) => setFormData({ ...formData, time: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona hora" />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.map((slot) => (
                <SelectItem key={slot.startTime} value={slot.startTime}>
                  {`${slot.startTime} - ${slot.endTime}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-center py-4">
            <span className="text-sm text-red-500">
              No hay horarios disponibles para esta fecha
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Notas Adicionales</Label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) =>
            setFormData({ ...formData, additionalNotes: e.target.value })
          }
          placeholder="Instrucciones especiales, acceso, etc..."
        />
      </div>
    </div>
  );
};
