import { Session, SessionModel } from "../models/session";

export class SessionService {
    static async createSession(userId: string): Promise<Session> {
        return await SessionModel.create({ user: userId });
    }

    static async getSessionById(id: string): Promise<Session | null> {
        return await SessionModel.findById(id);
    }

    static async deleteSessionById(id: string) {
        await SessionModel.findByIdAndDelete(id);
    }
}
