import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  levels: string;
  bedrooms: string;
  bathrooms: string;
  message: string;
  acceptTerms: boolean;
  imageUrls: string[];
  createdAt: Date;
  status: string;
}

export const QuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    service: "",
    levels: "",
    bedrooms: "",
    bathrooms: "",
    message: "",
    acceptTerms: false,
    imageUrls: [],
    createdAt: new Date(),
    status: "pending",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const services = [
    "Deep Cleaning",
    "Regular Cleaning",
    "Move In/Out Cleaning",
    "Post Construction Cleaning",
    "Office Cleaning",
  ];

  const levels = ["1", "2", "3", "4", "5+"];
  const bedrooms = ["1", "2", "3", "4", "5+"];
  const bathrooms = ["1", "2", "3", "4", "5+"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("El tamaño del archivo no debe exceder 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);

      // Create preview URLs
      validFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        setPreviewUrls((prev) => [...prev, url]);
      });

      setError("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");

    try {
      // Upload all images to Supabase
      const uploadPromises = images.map((file) => uploadImageToSupabase(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      // Filter out any failed uploads
      const successfulUrls = uploadedUrls.filter(
        (url): url is string => url !== null
      );

      // Update form data with uploaded image URLs and timestamp
      const updatedFormData = {
        ...formData,
        imageUrls: successfulUrls,
        createdAt: new Date(),
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, "quotes"), updatedFormData);

      // Show success toast
      toast({
        title: "¡Cotización enviada!",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      // Clear form and images after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        service: "",
        levels: "",
        bedrooms: "",
        bathrooms: "",
        message: "",
        acceptTerms: false,
        imageUrls: [],
        createdAt: new Date(),
        status: "pending",
      });
      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error al enviar el formulario. Por favor, inténtelo de nuevo.");
      toast({
        title: "Error",
        description:
          "Hubo un problema al enviar tu cotización. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-3">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative pb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-gray-500">
              Personal Info
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-44 h-6"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-gray-500">
              Property Details
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Service</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "service")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
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
            <Label>Select Levels</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "levels")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Number of levels" />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>No. of Bedrooms</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "bedrooms")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bedrooms" />
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
            <Label>No. of Bathrooms</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, "bathrooms")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bathrooms" />
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

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-gray-500">
              Extra Info
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Upload Images (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-1" />
              <span className="text-gray-600 text-sm">
                Drop your images here or click to upload
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                Maximum file size: 5MB
              </span>
            </label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Additional Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Any specific requirements or details..."
            className="h-24"
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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary"
          disabled={!formData.acceptTerms || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Get Your Quote"
          )}
        </Button>
      </form>
    </div>
  );
};
