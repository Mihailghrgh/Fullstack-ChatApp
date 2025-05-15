import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("Users", {
  id: text("id").primaryKey(),
  image: text("image").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const messages = pgTable("Message", {
  id: uuid("id").defaultRandom().notNull(),
  sender_id: text("sender_id").notNull(),
  sender_image: text("sender_image").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  room_Id: text("room_Id").notNull(),
});

export const conversation = pgTable("Conversation", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  room_id: text("room_id").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  participants: jsonb("participants").notNull(),
});

export const conversationParticipants = pgTable("conversationParticipants", {
  room_id: text("room_id").references(() => conversation.room_id),
  user_Id: text("user_Id")
    .references(() => users.id)
    .primaryKey(),
  id: uuid("id").defaultRandom().primaryKey(),
});

export const conversationRelations = relations(conversation, ({ many }) => ({
  messages: many(messages),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sentMessages: many(messages),
}));

// export const messagesRelations = relations(messages, ({ one }) => ({
//   conversation: one(conversation, {
//     fields: [messages.room_Id],
//     references: [conversation.id],
//   }),
// }));
