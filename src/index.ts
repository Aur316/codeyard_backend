import { ServiceBroker } from "moleculer";
import ApiGateway from "moleculer-web";
import mongoose from "mongoose";
import UsersService from "./services/users.service";
import AddressesService from "./services/addresses.service";

const broker = new ServiceBroker({
  nodeID: "node-1",
  transporter: "nats://nats:4222",
});

broker.createService(UsersService);
broker.createService(AddressesService);

broker.createService({
  name: "api",
  mixins: [ApiGateway],
  settings: {
    port: 3000,
    routes: [
      {
        path: "/api",
        aliases: {
          "REST users": "users",
          "REST addresses": "addresses",
          "GET /addresses/user/:userId": "addresses.listByUser",
        },
      },
    ],
  },
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined");
}

broker
  .start()
  .then(() => {
    return mongoose.connect(mongoUri);
  })
  .catch((error) => {
    console.error("Error starting broker: ", error);
  });
