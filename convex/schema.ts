import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    accessToken: v.string(),
  }),
  chats: defineTable({
    userId: v.string(),
    description: v.string(),
    messages: v.array(
      v.object({
        id: v.string(),
        role: v.string(),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
    urlId: v.optional(v.string()),
    timestamp: v.number(),
  })
});