import { z } from "zod";

export const checkUserSchema = z.object({
    search_flight_departure: z.string().min(1, "Departure is required"),
    search_flight_arrival: z.string().min(1, "Arrival is required"),
    date: z.string().min(1, "Date is required"),
});

export const softwareSchema = z.object({
    software_name: z.string().min(1, "Software is required"),
});

export type CheckUserFormData = z.infer<typeof checkUserSchema>;
export type SoftwareFormData = z.infer<typeof softwareSchema>;
