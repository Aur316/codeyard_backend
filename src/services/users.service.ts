import { ServiceSchema, Context } from "moleculer";
import mongoose, { Schema, Document } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

interface UserCreateParams {
  name: string;
  email: string;
  password: string;
}

interface UserIdParams {
  id: string;
}

interface UserUpdateParams {
  name?: string;
  email?: string;
  password?: string;
}

const UserService: ServiceSchema = {
  name: "users",
  actions: {
    list: {
      rest: "GET /",
      async handler(ctx: Context): Promise<Document[]> {
        return User.find({});
      },
    },
    create: {
      rest: "POST /",
      params: {
        name: { type: "string" },
        email: { type: "email" },
        password: { type: "string", min: 6 },
      },
      async handler(ctx: Context<UserCreateParams>): Promise<Document> {
        try {
          const user = new User(ctx.params);
          const savedUser = await user.save();
          return savedUser.toObject();
        } catch (err) {
          throw err;
        }
      },
    },
    get: {
      rest: "GET /:id",
      params: {
        id: "string",
      },
      async handler(ctx: Context<UserIdParams>): Promise<Document | null> {
        const user = await User.findById(ctx.params.id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      },
    },
    update: {
      rest: "PUT /:id",
      params: {
        id: "string",
        name: "string|optional",
        email: "email|optional",
        password: "string|min:6|optional",
      },
      async handler(
        ctx: Context<UserIdParams & UserUpdateParams>
      ): Promise<Document | null> {
        const updates = ctx.params;
        const user = await User.findByIdAndUpdate(ctx.params.id, updates, {
          new: true,
        });
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      },
    },
    remove: {
      rest: "DELETE /:id",
      params: {
        id: "string",
      },
      async handler(ctx: Context<UserIdParams>): Promise<Document | null> {
        const user = await User.findByIdAndDelete(ctx.params.id);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      },
    },
  },
};

export = UserService;
