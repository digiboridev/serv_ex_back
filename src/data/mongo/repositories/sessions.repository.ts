import { Entity } from "../../../domain/entities/auth_data";
import { Session } from "../../../domain/entities/session";
import { SessionsRepository } from "../../../domain/repositories/sessions.repository";
import { SessionModel } from "../models/session";

export class SessionsRepositoryMongoImpl implements SessionsRepository {
    async createSession(entity: Entity): Promise<Session> {
      return await SessionModel.create({ entityId: entity.id, scope: entity.scope });
    }
  
    async getSessionById(id: string): Promise<Session | null> {
      return await SessionModel.findById(id);
    }
  
    async deleteSessionById(id: string) {
      await SessionModel.findByIdAndDelete(id);
    }
  }