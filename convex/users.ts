import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const store = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    googleToken: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      lastLoginAt: Date.now(),
    });
  },
});

export const deleteUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export const upsertUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    picture: v.string(),
    googleToken: v.optional(v.string()),
    githubToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      console.log('Upserting user:', args); // Debug log
      
      const existing = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("email"), args.email))
        .first();

      if (existing) {
        console.log('Updating existing user:', existing._id); // Debug log
        await ctx.db.patch(existing._id, {
          name: args.name,
          picture: args.picture,
          ...(args.googleToken && { googleToken: args.googleToken }),
          ...(args.githubToken && { githubToken: args.githubToken }),
          lastLoginAt: Date.now(),
        });
        return existing._id;
      }

      console.log('Creating new user'); // Debug log
      const id = await ctx.db.insert("users", {
        ...args,
        lastLoginAt: Date.now(),
      });
      return id;
    } catch (error) {
      console.error('Convex mutation error:', error);
      throw error;
    }
  },
});