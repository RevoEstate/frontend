"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { realestateSchema, realestateUpdateSchema } from "@/lib/validators"
import { Realestate } from "@/types"
import { useRouter } from "next/navigation"
import { realestateDefaultValues } from "@/lib/constants/index.ts"
import { toast } from "sonner"
import { useState } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { MapPinIcon } from "lucide-react"
import { LatLngExpression, LatLngTuple } from 'leaflet';
import dynamic from "next/dynamic"


// Mock data for regions and cities
const REGIONS = [
  { value: "california", label: "California" },
  { value: "new_york", label: "New York" },
  { value: "texas", label: "Texas" },
  { value: "florida", label: "Florida" },
]

const CITIES_BY_REGION = {
  california: [
    { value: "san_francisco", label: "San Francisco" },
    { value: "los_angeles", label: "Los Angeles" },
    { value: "san_diego", label: "San Diego" },
  ],
  new_york: [
    { value: "new_york_city", label: "New York City" },
    { value: "buffalo", label: "Buffalo" },
    { value: "rochester", label: "Rochester" },
  ],
  texas: [
    { value: "houston", label: "Houston" },
    { value: "austin", label: "Austin" },
    { value: "dallas", label: "Dallas" },
  ],
  florida: [
    { value: "miami", label: "Miami" },
    { value: "orlando", label: "Orlando" },
    { value: "tampa", label: "Tampa" },
  ],
}

// Dynamic import for the map component with SSR disabled
const MapWithNoSSR = dynamic(
  () => import('@/components/realestate/MapComponent'), // Create this component separately
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-gray-100 rounded-md flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    )
  }
);

export function RealestateForm({
    type,
    realestate,
    realestateId
}: {
    type: 'Create' | 'Update',
    realestate?: Realestate,
    realestateId?: string
}) {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [mapCenter] = useState<LatLngTuple>([9.1450, 40.4897]);

    const form = useForm<z.infer<typeof realestateSchema>>({
      resolver:
        type === 'Update'
          ? zodResolver(realestateUpdateSchema)
          : zodResolver(realestateSchema),
      defaultValues:
        realestate && type === 'Update' ? realestate : realestateDefaultValues,
    });


    const onSubmit = async (values: z.infer<typeof realestateSchema>) => {
      try {
        const formData = new FormData();
    
        // Append all simple fields
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'address' || key === 'socialMedia') {
            // Handle nested objects
            formData.append(key, JSON.stringify(value));
          } else if (key === 'imageUrl' && value instanceof File) {
            // Handle logo file
            formData.append('logo', value);
          } else if (key === 'documentUrl' && value instanceof File) {
            // Handle single PDF file
            formData.append('document', value);
          } else if (value !== undefined && value !== null) {
            // Handle all other fields
            formData.append(key, value.toString());
          }
        });
    
        const endpoint = type === 'Create' 
          ? '/api/realestate' 
          : `/api/realestate/${realestateId}`;
        const method = type === 'Create' ? 'POST' : 'PUT';
    
        const response = await fetch(endpoint, {
          method,
          body: formData,
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Submission failed');
        }
    
        const data = await response.json();
        
        toast.success(`Real estate ${type === 'Create' ? 'created' : 'updated'} successfully!`);
        router.push('/realestate/profile');
        
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('Submission failed', {
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();
        const fileReader = new FileReader();
        
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          
          if (!file.type.includes("image")) {
            toast.error("Please upload an image file");
            return;
          }
      
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            setPreview(imageDataUrl);
            fieldChange(imageDataUrl);
          };
      
          fileReader.readAsDataURL(file);
        }
      };
  

  const selectedRegion = form.watch("address.region")

  const getCurrentLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: LatLngTuple = [position.coords.latitude, position.coords.longitude];
          form.setValue('address.coordinates.lat', coords[0]);
          form.setValue('address.coordinates.lng', coords[1]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleLocationSelect = (coords: LatLngTuple) => {
    form.setValue('address.coordinates.lat', coords[0]);
    form.setValue('address.coordinates.lng', coords[1]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-3 my-5">
        {/* Company Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="realEstateName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realestate Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ovid Real Estate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realestate Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+251 91 234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realestate Logo</FormLabel>
                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        // Create preview
                        const reader = new FileReader();
                        reader.onload = () => setPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="address.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region/State</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!selectedRegion}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedRegion && CITIES_BY_REGION[selectedRegion as keyof typeof CITIES_BY_REGION]?.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.specificLocation"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Specific Location</FormLabel>
                  <FormControl>
                    <Input placeholder="kebele 11, 123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your realestate..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social Media */}
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {([
                { platform: "instagram", name: "socialMedia.instagram" },
                { platform: "facebook", name: "socialMedia.facebook" },
                { platform: "linkedin", name: "socialMedia.linkedin" },
                { platform: "tiktok", name: "socialMedia.tiktok" },
                { platform: "whatsapp", name: "socialMedia.whatsapp" },
                ] as const).map(({ platform, name }) => (
                <FormField
                    key={platform}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="capitalize">{platform}</FormLabel>
                        <FormControl>
                        <Input
                            placeholder={
                            platform === "whatsapp"
                                ? "+251 91 234 5678"
                                : `https://${platform}.com/yourusername`
                            }
                            {...field}
                            value={field.value ?? ""}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                ))}
            </div>
        </div>

        <FormField
          control={form.control}
          name="documentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Document (PDF only)</FormLabel>
              {field.value && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected file: {field.value.name}
                </div>
              )}
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          {/* Coordinates Section */}
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Location Coordinates</h4>
                <Button 
                  type="button" 
                  onClick={getCurrentLocation}
                  variant="outline"
                  size="sm"
                >
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  Auto-detect
                </Button>
            </div>

            {/* Map Picker */}
            <div className="h-64 rounded-md overflow-hidden border">
              <MapWithNoSSR 
                center={mapCenter} 
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {/* Manual Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address.coordinates.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={-90}
                        max={90}
                        step="0.000001"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.coordinates.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={-180}
                        max={180}
                        step="0.000001"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

         {/* SUBMIT BUTTON */}
            <Button
                type='submit'
                size='lg'
                disabled={form.formState.isSubmitting}
                className='bg-sky-600 hover:bg-sky-600/80 cursor-pointer w-full'
            >
                {form.formState.isSubmitting ? 'Submitting' : `${type} Realestate Account`}
            </Button>
      </form>
    </Form>
  )
}