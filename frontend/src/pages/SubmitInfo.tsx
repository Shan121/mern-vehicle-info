"use client";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleSchema } from "@/lib/schemas";
import { ClipLoader } from "react-spinners";
import { useMutation } from "react-query";
import { submitVehicleInfo } from "@/lib/api-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ImageFile {
  file: File;
  preview: string;
}

const SubmitInfo = () => {
  const form = useForm<z.infer<typeof VehicleSchema>>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: {
      userId: "",
      carModel: "",
      price: 0,
      phoneNumber: "",
      images: [],
    },
  });

  const { user: currentUser } = useAuth();
  const { isSubmitting } = form.formState;

  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    form.setValue("userId", currentUser?._id as string);
  }, [form, currentUser]);

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length + images.length > 10) {
      console.log("error: more than 10 images were selected");
      return toast.error("Cannot upload more than 10 images");
    }

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.name.match(/\.(jpg|jpeg|png)$/i)) {
          return toast.error("Invalid file type");
        }

        if (file.size > 5 * 1024 * 1024) {
          return toast.error("Image size cannot be more than 5 mb");
        }

        const preview = await readFileAsync(file);
        if (preview) {
          setImages((images) => [...images, { file, preview } as ImageFile]);
        }
      }
    }
  };

  const readFileAsync = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          resolve(reader.result);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (image: ImageFile) => {
    try {
      const filterdImages = images.filter((item) => {
        return item !== image;
      });
      setImages(filterdImages);
    } catch (error) {
      console.log(error);
    }
  };

  const { mutate, isLoading } = useMutation(submitVehicleInfo, {
    onSuccess: async () => {
      toast.success("Success", {
        description: "Submitted successfully",
      });
      form.reset();
      setImages([]);
    },
    onError: (error: Error) => {
      console.log(error);
      toast.error("Error", { description: error.message });
    },
  });

  const onSubmit = async (values: z.infer<typeof VehicleSchema>) => {
    if (images.length < 1) {
      return toast.error("Please upload at least one image");
    }
    const formData = new FormData();

    formData.append("userId", values.userId);
    formData.append("carModel", values.carModel);
    formData.append("price", values.price.toString());
    formData.append("phoneNumber", values.phoneNumber);

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    mutate(formData);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-11/12 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold mt-4 mb-8">
          Vehicle Information
        </span>

        <span className="mb-6">{images.length + " image(s) selected"}</span>
        <div className="flex items-center justify-center gap-4 my-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <span
                onClick={() => handleRemoveImage(image)}
                className="absolute -top-1 -right-1 cursor-pointer bg-red-500 text-white rounded-full z-10"
              >
                <X size={20} />
              </span>
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-2">
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                  <FormField
                    control={form.control}
                    name="carModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Car Model</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isLoading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <div>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              disabled={isLoading || isSubmitting}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading || isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Images</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="file"
                          multiple
                          accept="image/png, image/jpg, image/jpeg"
                          onChange={handleImages}
                          disabled={
                            isLoading || isSubmitting || images.length >= 10
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            </div>
            <Button
              type="submit"
              className="w-full mt-5 relative"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-1">
                  <ClipLoader size={20} />
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SubmitInfo;
