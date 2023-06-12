export function errorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}

export class AppError extends Error {
    constructor(message: string, public code: number) {
        super(message)
    }
}