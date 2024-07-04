import { Context, ServiceSchema } from "moleculer";
import DbMixin from "moleculer-db";
import mongoose from "mongoose";
import MongoAdapter from "moleculer-db-adapter-mongo";

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
});

interface Address {
  userId: mongoose.Schema.Types.ObjectId;
  street: string;
  city: string;
  zip: string;
}

interface AddressCreateParams {
  userId: string;
  street: string;
  city: string;
  zip: string;
}

interface AddressUpdateParams {
  street?: string;
  city?: string;
  zip?: string;
}

interface AddressIdParams {
  id: string;
}

interface AddressListByUserParams {
  userId: string;
}

const AddressesService: ServiceSchema = {
  name: "addresses",
  mixins: [DbMixin],
  adapter: new MongoAdapter(process.env.MONGO_URI as string),
  model: mongoose.model("Address", AddressSchema),
  collection: "addresses",
  actions: {
    list: {
      rest: "GET /",
      async handler(ctx: Context): Promise<Address[]> {
        return this.adapter.find({});
      },
    },
    create: {
      rest: "POST /",
      params: {
        userId: "string",
        street: "string",
        city: "string",
        zip: "string",
      },
      async handler(ctx: Context<AddressCreateParams>): Promise<Address> {
        const { userId, street, city, zip } = ctx.params;
        const address = new this.adapter.model({ userId, street, city, zip });
        return address.save();
      },
    },
    get: {
      rest: "GET /:id",
      params: {
        id: "string",
      },
      async handler(ctx: Context<AddressIdParams>): Promise<Address | null> {
        const address = await this.adapter.findById(ctx.params.id);
        if (!address) {
          throw new Error("Address not found");
        }
        return address;
      },
    },
    update: {
      rest: "PUT /:id",
      params: {
        id: "string",
        street: "string|optional",
        city: "string|optional",
        zip: "string|optional",
      },
      async handler(
        ctx: Context<AddressIdParams & AddressUpdateParams>
      ): Promise<Address | null> {
        const updates = {
          street: ctx.params.street,
          city: ctx.params.city,
          zip: ctx.params.zip,
        };

        const address = await this.adapter.findById(ctx.params.id);
        if (!address) {
          throw new Error("Address not found");
        }

        await this.adapter.updateById(ctx.params.id, { $set: updates });
        return this.adapter.findById(ctx.params.id);
      },
    },
    remove: {
      rest: "DELETE /:id",
      params: {
        id: "string",
      },
      async handler(ctx: Context<AddressIdParams>): Promise<Address | null> {
        const address = await this.adapter.findById(ctx.params.id);
        if (!address) {
          throw new Error("Address not found");
        }
        await this.adapter.removeById(ctx.params.id);
        return address;
      },
    },
    listByUser: {
      rest: "GET /user/:userId",
      params: {
        userId: "string",
      },
      async handler(ctx: Context<AddressListByUserParams>): Promise<Address[]> {
        const userId = new mongoose.Types.ObjectId(ctx.params.userId);
        console.log(`Fetching addresses for userId: ${userId}`);
        const addresses = await this.adapter.find({ query: { userId } });
        console.log(`Found addresses: ${JSON.stringify(addresses)}`);
        return addresses;
      },
    },
  },
};

export default AddressesService;
