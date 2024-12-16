import React, { useState, useEffect, useRef } from "react";
import { User, fetchUserData, updateUserData } from "./api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Eye, EyeOff, Save } from "lucide-react";
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
import * as z from "zod";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { ProfileSkeleton } from "./skeleton";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const formSchema = z
  .object({
    avatar: z.any().optional(),
    name: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    employeeCode: z.string(),
    position: z.string(),
    campus: z.string(),
    role: z.string(),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function Profile({ id }: { id: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setAvatar, setName, setEmail } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastNotification();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      name: "",
      email: "",
      employeeCode: "",
      position: "",
      campus: "",
      role: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    fetchUserData(id).then((data) => {
      setUser(data);
      form.reset(data);
      setAvatar(data.avatar);
      setName(data.name);
      setIsLoading(false);
    });
  }, [form, id, setAvatar, setName, setEmail]);

  const onSubmit = async (values: FormValues) => {
    setIsUpdating(true);
    try {
      const updatedUser = await updateUserData(values, id, showToast, navigate);
      setUser(updatedUser);
      form.reset(updatedUser);
      setAvatar(updatedUser.avatar);
      setName(updatedUser.name);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("avatar", result); // Lưu Base64 vào form để gửi đi
        setPreviewAvatar(result); // Lưu ảnh tạm vào state
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      form.reset(user || undefined);
    }
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return <div>Failed to load user data</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Part 1: Avatar and Full Name */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col items-center space-y-4">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Avatar className="w-32 h-32">
                              <AvatarImage
                                src={previewAvatar || user?.avatar || ""}
                                alt={form.getValues("name")}
                              />
                              <AvatarFallback>
                                {form
                                  .getValues("name")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-0 right-0 rounded-full bg-primary-foreground"
                              onClick={() => fileInputRef.current?.click()}
                              type="button"
                              disabled={!isEditing}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleAvatarChange}
                              className="hidden"
                              accept="image/*"
                              disabled={!isEditing}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className="text-center font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Part 3: Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showOldPassword ? "text" : "password"}
                            disabled={!isEditing}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            disabled={!isEditing}
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            disabled={!isEditing}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            disabled={!isEditing}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            disabled={!isEditing}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={!isEditing}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Part 2: User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="campus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campus</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={toggleEdit}
            className="w-32 hover:bg-orange-500"
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </>
            )}
          </Button>
          <Button
            type="submit"
            disabled={isUpdating || !isEditing}
            className="w-32 hover:bg-orange-500"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
