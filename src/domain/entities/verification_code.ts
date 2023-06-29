

export type VerificationCode = {
    credential: string;
    credentialType: "email" | "phone";
    code: string;
}

