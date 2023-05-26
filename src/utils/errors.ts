export function errorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}

export class ApiError extends Error {
    constructor(message: string, public code: number) {
        super(message)
    }
}