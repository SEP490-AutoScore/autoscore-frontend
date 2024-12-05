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
import { useEffect, useState } from "react";

// Định nghĩa schema validation
const formSchema = z.object({
  positionId: z.number(),
  name: z
    .string()
    .min(6, { message: "Role name must be at least 6 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(160, { message: "Description must not exceed 160 characters." }),
});

const token = localStorage.getItem("jwtToken");

interface Position {
  positionId: number;
  name: string;
  description: string;
}

async function getPositionDetail(positionId: number): Promise<Position> {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getPositionDetail}${positionId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

export function PositionForm({ positionId }: { positionId: number }) {
  const [loading, setLoading] = useState(true);
  const showToast = useToastNotification();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      positionId: positionId,
      name: "",
      description: "",
    },
  });

  // Xử lý submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`${BASE_URL}${API_ENDPOINTS.updatePosition}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status === 409)
        showToast({
          title: "Updated Failed",
          description: "Position name already exists",
          variant: "destructive",
        });
      else if (response.status === 400)
        showToast({
          title: "Updated Failed",
          description: "Your input is invalid",
          variant: "destructive",
        });
      else if (response.ok) {
        showToast({
          title: "Updated Successfully",
          description: "New position has been updated successfully",
          variant: "default",
        });
        form.reset(values);
        navigate("/positions", { state: { reload: true } });
      } else {
        showToast({
          title: "Updated Failed",
          description: "Failed to update position",
          variant: "destructive",
        });
      }
      return response.json();
    });
  }

  useEffect(() => {
    setLoading(true);
    getPositionDetail(positionId)
      .then((position) => {
        form.setValue("name", position.name || "");
        form.setValue("description", position.description || "");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch role details:", error);
        setLoading(false);
      });
  }, [positionId, form]);

  if (loading) return <div>Loading...</div>;

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
