"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";

// Định nghĩa schema validation
const formSchema = z.object({
  action: z
    .string()
    .min(6, { message: "Action must be at least 6 characters." }),
  permissionCategoryId: z.string().nonempty({
    message: "Please select a permission category.",
  }),
  permissionName: z
    .string()
    .min(6, { message: "Permission name must be at least 6 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(160, { message: "Description must not exceed 160 characters." }),
  permissionId: z.number(),
});

// Định nghĩa interface cho danh mục quyền
interface PermissionCategories {
  id: string;
  name: string;
  status: string;
}

interface Permission {
  permissionId: number;
  action: string;
  permissionName: string;
  description: string;
  status: boolean;
  permissionCategory: {
    permissionCategoryId: number;
    permissionCategoryName: string;
    status: boolean;
  };
}
const token = localStorage.getItem("jwtToken");

// Hàm lấy dữ liệu từ API
async function getData(): Promise<PermissionCategories[]> {
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }
  const res = await fetch(
    `${BASE_URL}${API_ENDPOINTS.getAllPermissionCategories}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

// Hàm lấy dữ liệu từ API
async function getPermissionDetail(permissionId: number): Promise<Permission> {
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }
  const res = await fetch(
    `${BASE_URL}${API_ENDPOINTS.getPermissionDetail}${permissionId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

export function PermissionForm({ permissionId, onSuccess }: { permissionId: number; onSuccess: () => void; }) {
  const [data, setData] = useState<PermissionCategories[]>([]);
  const showToast = useToastNotification();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissionId: permissionId,
      action: "",
      permissionCategoryId: "",
      permissionName: "",
      description: "",
    },
  });

  // Xử lý submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`${BASE_URL}${API_ENDPOINTS.updatePermission}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status === 409)
        showToast({
          title: "Update Failed",
          description: "Action or permission name already exists",
          variant: "destructive",
        });
      else if (response.ok) {
        showToast({
          title: "Update Successfully",
          description: "Permission has been updated successfully",
          variant: "default",
        });
        onSuccess();
        navigate("/permissions", { state: { reload: true } });
      } else {
        showToast({
          title: "Updated Failed",
          description: "Failed to update permission",
          variant: "destructive",
        });
      }
      return response.json();
    });
  }

  useEffect(() => {
    Promise.all([getData(), getPermissionDetail(permissionId)])
      .then(([fetchedData, permissionDetails]) => {
        setData(fetchedData);
  
        form.setValue(
          "permissionCategoryId",
          permissionDetails.permissionCategory.permissionCategoryId.toString()
        );
        form.setValue("action", permissionDetails.action);
        form.setValue("permissionName", permissionDetails.permissionName);
        form.setValue("description", permissionDetails.description);
      })
      .catch(() => {
        showToast({
          title: "Something went wrong",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }, [form, showToast, permissionId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="permissionCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {data.find((item) => item.id == field.value)?.name ||
                        "Select a permission category"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className="cursor-pointer"
                    >
                      {item.name}
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
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <Input placeholder="EXP_ACTION" {...field} />
              </FormControl>
              <FormDescription>
                Unique identifier for this permission.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="permissionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permission Name</FormLabel>
              <FormControl>
                <Input placeholder="Example Permission" {...field} />
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
                  placeholder="Describe the permission..."
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
