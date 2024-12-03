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
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";

// Định nghĩa schema validation
const formSchema = z.object({
  roleCode: z
    .string()
    .min(6, { message: "Role code must be at least 6 characters." }),
  roleName: z
    .string()
    .min(6, { message: "Role name must be at least 6 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(160, { message: "Description must not exceed 160 characters." }),
});

const token = localStorage.getItem("jwtToken");


export function RoleForm() {
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: "",
      roleCode: "",
      description: "",
    },
  });

  // Xử lý submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`${BASE_URL}${API_ENDPOINTS.createRole}`, {
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
            description: "Role name or role code already exists",
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
            description: "New role has been created successfully",
            variant: "default",
          });
          form.reset();
          navigate("/roles", { state: { reload: true } });
        } else {
          showToast({
            title: "Created Failed",
            description: "Failed to create role",
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
          name="roleCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Code</FormLabel>
              <FormControl>
                <Input placeholder="EXP_ROLE" {...field} />
              </FormControl>
              <FormDescription>
                Unique identifier for this role.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="Role Name..." {...field} />
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
                  placeholder="Describe the role..."
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
