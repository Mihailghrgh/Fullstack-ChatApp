import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("Users", {
  id: text("id").primaryKey(),
  image: text("image").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const messages = pgTable(
  "Message",
  {
    id: uuid("id").defaultRandom().notNull(),
    sender_id: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    receiver_id: text("receiver_id").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    read: boolean("read").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.sender_id] }),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  sentMessages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
  }),
}));