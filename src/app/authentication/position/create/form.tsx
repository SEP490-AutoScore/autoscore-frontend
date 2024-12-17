"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";

// Định nghĩa schema validation
const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: "Position name must be at least 6 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(160, { message: "Description must not exceed 160 characters." }),
});

const token = localStorage.getItem("jwtToken");


export function PositionForm() {
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Xử lý submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`${BASE_URL}${API_ENDPOINTS.createPosition}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.status === 409)
          showToast({
            title: "Created Failed",
            description: "Position name or role code already exists",
            variant: "destructive",
          });
        if (response.status === 400)
          showToast({
            title: "Created Failed",
            description: "Your input is invalid",
            variant: "destructive",
          });
        else if (response.ok) {
          showToast({
            title: "Created Successfully",
            description: "New position has been created successfully",
            variant: "default",
          });
          form.reset();
          navigate("/positions", { state: { reload: true } });
        } else {
          showToast({
            title: "Created Failed",
            description: "Failed to create position",
            variant: "destructive",
          });
        }
        return response.json();
      });
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the position..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button variant={"outline"} className="border-primary text-primary" type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
