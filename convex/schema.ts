import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    googleToken: v.optional(v.string()),
    githubToken: v.optional(v.string()),
    lastLoginAt: v.number(),
  }),
  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});