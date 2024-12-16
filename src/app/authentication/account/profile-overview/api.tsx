import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
export interface User {
  accountId: number;
  name: string;
  email: string;
  avatar: string;
  employeeCode: string;
  position: string;
  campus: string;
  role: string;
}

export async function fetchUserData(id: number): Promise<User> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }

  const res = await fetch(
    `${BASE_URL}${API_ENDPOINTS.getAccountProfile}${id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  
  const data: User = await res.json();

  // Lưu avatar vào localStorage
  if (data.avatar) {
    localStorage.setItem("avatar", data.avatar);
  }
  return data;
}

export async function updateUserData(
  data: Partial<User>,
  id: number,
  showToast: any,
  navigate: any
): Promise<User> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token doesn't exist. Please log in.");
  }
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "number") {
      formData.append(key, value.toString());
    } else if (
      value &&
      typeof value === "object" &&
      "size" in value &&
      "type" in value
    ) {
      formData.append(key, value as Blob); // Xử lý File hoặc Blob
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  fetch(`${BASE_URL}${API_ENDPOINTS.updateAccountProfile}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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
    } else if (response.ok) {
      showToast({
        title: "Updated Successfully",
        description: `Account has been updated successfully`,
        variant: "default",
      });
      navigate(
        (localStorage.getItem("selectedItem") as string) || "/dashboard"
      );
    } else {
      showToast({
        title: "Updated Failed",
        description: `Something went wrong! Please try again!`,
        variant: "destructive",
      });
    }
    return response.json();
  });
  return {
    ...(await fetchUserData(id)),
    ...data,
  };
}
