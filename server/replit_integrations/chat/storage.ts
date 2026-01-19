import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { sql, eq, desc } from "drizzle-orm";
import { conversations, messages } from "@shared/schema";

export interface IChatStorage {
  getConversation(id: number): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof conversations.$inferSelect)[]>;
  createConversation(title: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<(typeof messages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof messages.$inferSelect>;
}

// In-memory storage for the prototype to avoid DB dependency issues
const memConversations: (typeof conversations.$inferSelect)[] = [];
const memMessages: (typeof messages.$inferSelect)[] = [];

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    return memConversations.find(c => c.id === id);
  },

  async getAllConversations() {
    return [...memConversations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async createConversation(title: string) {
    const conversation: typeof conversations.$inferSelect = {
      id: memConversations.length + 1,
      title,
      createdAt: new Date()
    };
    memConversations.push(conversation);
    return conversation;
  },

  async deleteConversation(id: number) {
    const index = memConversations.findIndex(c => c.id === id);
    if (index !== -1) {
      memConversations.splice(index, 1);
      const mIndices = memMessages.filter(m => m.conversationId === id).map((_, i) => i);
      for (const i of mIndices.reverse()) {
        memMessages.splice(i, 1);
      }
    }
  },

  async getMessagesByConversation(conversationId: number) {
    return memMessages.filter(m => m.conversationId === conversationId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async createMessage(conversationId: number, role: string, content: string) {
    const message: typeof messages.$inferSelect = {
      id: memMessages.length + 1,
      conversationId,
      role,
      content,
      createdAt: new Date()
    };
    memMessages.push(message);
    return message;
  },
};

