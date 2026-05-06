export type Gender = "MALE" | "FEMALE";

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    phoneNumber: string | null;
    birthdate: Date;
    gender: Gender;
    country: string;
    createdAt: Date;
    updatedAt: Date | null;
    emailVerified: Date | null;
    image?: string | null;
};
