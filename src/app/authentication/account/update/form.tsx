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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { checkPermission } from "@/hooks/use-auth";
interface Role {
  roleId: string;
  roleName: string;
  status: boolean;
}

interface Campus {
  organizationId: string;
  name: string;
  type: string;
  status: boolean;
}

interface Position {
  positionId: string;
  name: string;
  status: boolean;
}

interface Account {
  accountId: number;
  name: string;
  email: string;
  role: string;
  position: string;
  campus: string;
  employeeCode: string;
  avatar: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
  roleId: string;
  campusId: string;
  positionId: string;
}

// Định nghĩa schema validation
const formSchema = z.object({
  accountId: z.number(),
  name: z.string(),
  email: z.string(),
  roleId: z.string().nonempty({
    message: "Please select a role.",
  }),
  roleName: z.string(),
  position: z.string(),
  campusId: z.string().nonempty({
    message: "Please select a campus.",
  }),
  campusName: z.string(),
  positionId: z.string().nonempty({
    message: "Please select a position.",
  }),
  positionName: z.string(),
});

const token = localStorage.getItem("jwtToken");

async function getRole(): Promise<Role[]> {
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllRolesByRole}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

async function getCampus(): Promise<Campus[]> {
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllOrganizationsByRole}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

async function getPosition(): Promise<Position[]> {
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllPositionByRole}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

async function getAccount(id: number): Promise<Account> {
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAccountProfile}${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

export function AccountForm({ id, onSuccess }: {id: number; onSuccess: () => void; }) {
  const showToast = useToastNotification();
  const navigate = useNavigate();
  const [role, setRole] = React.useState<Role[]>([]);
  const [campus, setCampus] = React.useState<Campus[]>([]);
  const [position, setPosition] = React.useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRole().then((data) => setRole(data));
    getCampus().then((data) => setCampus(data));
    getPosition().then((data) => setPosition(data));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: id,
      name: "",
      email: "",
      roleId: "0",
      roleName: "",
      position: "",
      campusId: "0",
      campusName: "",
      positionId: "0",
      positionName: "",
    },
  });

  // Xử lý submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch(`${BASE_URL}${API_ENDPOINTS.updateAccount}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status === 400)
        showToast({
          title: "Updated Failed",
          description: `Failed to update! Please try again!`,
          variant: "destructive",
        });
      else if (response.status === 409) {
        showToast({
          title: "Updated Failed",
          description: `Email already exists`,
          variant: "destructive",
        });
      }
      else if (response.ok) {
        showToast({
          title: "Updated Successfully",
          description: `Account has been updated successfully`,
          variant: "default",
        });
        onSuccess();
        navigate("/accounts", { state: { reload: true } });
      } else {
        showToast({
          title: "Updated Failed",
          description: `Something went wrong! Please try again!`,
          variant: "destructive",
        });
      }
      return response.json();
    });
  }

    useEffect(() => {
      Promise.all([getAccount(id)])
        .then(([fetchedData]) => {
          form.setValue("name", fetchedData.name);
          form.setValue("email", fetchedData.email);
          form.setValue("roleId", fetchedData.roleId.toString());
          form.setValue("roleName", fetchedData.role);
          form.setValue("position", fetchedData.position);
          form.setValue("campusId", fetchedData.campusId.toString());
          form.setValue("campusName", fetchedData.campus);
          form.setValue("positionId", fetchedData.positionId.toString());
          form.setValue("positionName", fetchedData.position);
        })
        .catch(() => {
          showToast({
            title: "Something went wrong",
            description: "Failed to fetch data",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoading(false));
    }, [form, showToast, id]);
  
    if (isLoading) {
      return <p>Loading...</p>;
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Full name..." {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email..." {...field} />
              </FormControl>
              <FormDescription>
                The email of employee must be unique.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="positionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                disabled={!checkPermission({ permission: "CONVERT_POSITION" })}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {position.find((item) => item.positionId == field.value)
                        ?.name || "Select a position"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {position.map((item) => (
                    <SelectItem
                      key={item.positionId}
                      value={item.positionId}
                      className="cursor-pointer"
                      disabled={!item.status}
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
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                disabled={!checkPermission({ permission: "CONVERT_ROLE" })}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {role.find((item) => item.roleId == field.value)
                        ?.roleName || "Select a role"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {role.map((item) => (
                    <SelectItem
                      key={item.roleId}
                      value={item.roleId}
                      className="cursor-pointer"
                      disabled={!item.status}
                    >
                      {item.roleName}
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
          name="campusId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campus</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                disabled={!checkPermission({ permission: "CONVERT_CAMPUS" })}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>
                      {campus.find((item) => item.organizationId == field.value)
                        ?.name || "Select a campus"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {campus.map(
                    (item) =>
                      item.type !== "MAJOR" &&
                      item.type !== "DEPARTMENT" && (
                        <SelectItem
                          key={item.organizationId}
                          value={item.organizationId}
                          className="cursor-pointer"
                          disabled={!item.status}
                        >
                          {item.name}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>
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
