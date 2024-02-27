import { z } from "zod";
import { LoginSchema } from "./schemas";

const API_BASE_URL = "";

export const login = async (formData: z.infer<typeof LoginSchema>) => {
  const res = await fetch(`${API_BASE_URL}/api/user/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const getUser = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const body = await res.json();
      return body;
    } else {
      throw new Error("Failed to fetch user profile");
    }
  } catch (error) {
    throw new Error("Failed to fetch user profile");
  }
};

export const logout = async () => {
  const res = await fetch(`${API_BASE_URL}/api/user/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
};

export const submitVehicleInfo = async (vehicleData: FormData) => {
  const res = await fetch(`${API_BASE_URL}/api/vehicle/submit-info`, {
    method: "POST",
    credentials: "include",
    body: vehicleData,
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message);
  }
  return body;
};
