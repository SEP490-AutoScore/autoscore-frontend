"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";

// Định nghĩa schema validation
const formSchema = z.object({
  name: z.string(),
  parentId: z.number(),
  type: z.string(),
});

const token = localStorage.getItem("jwtToken");

export function OrganizationForm({
  type,
  parentId,
}: {
  type: string;
  parentId: number;
}) {
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentId: parentId,
      type: type,
    },
  });

  // Xử lý submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`${BASE_URL}${API_ENDPOINTS.createOrganization}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status === 400)
        showToast({
          title: "Created Failed",
          description: `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} name code already exists`,
          variant: "destructive",
        });
      else if (response.ok) {
        showToast({
          title: "Created Successfully",
          description: `New ${type.toLowerCase()} has been created successfully`,
          variant: "default",
        });
        form.reset();
        navigate("/organizations", { state: { reload: true } });
      } else {
        showToast({
          title: "Created Failed",
          description: `Failed to create ${type.toLowerCase()}`,
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
              <FormLabel>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} name</FormLabel>
              <FormControl>
                <Input placeholder="Node name..." {...field} />
              </FormControl>
              <FormDescription>
                The name of the {type.toLowerCase()}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            variant={"outline"}
            className="border-primary text-primary"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
