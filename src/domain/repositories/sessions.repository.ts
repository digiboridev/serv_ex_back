import { Entity } from "../entities/auth_data";
import { Session } from "../entities/session";

export interface SessionsRepository {
  createSession(entity: Entity): Promise<Session>;
  getSessionById(id: string): Promise<Session | null>;
  deleteSessionById(id: string): Promise<void>;
}


