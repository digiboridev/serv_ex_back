import { connect } from "mongoose";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { companyRoutes } from "./routes/company.routes";
import { usersRoutes } from "./routes/users.routes";
import { catalogRoutes } from "./routes/catalog.routes";
import { fillRsCat } from "./datamock";
import { Issue, IssueModel } from "./models/issue";
import { Category, CategoryModel } from "./models/category";
import { OrderModel } from "./models/order/order";
import { CustomerType } from "./models/order/customer_info";

const fastify = Fastify({ logger: true });

fastify.register(cors, {});
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(userRoutes, { prefix: "/user" });
fastify.register(usersRoutes, { prefix: "/users" });
fastify.register(companyRoutes, { prefix: "/company" });
fastify.register(catalogRoutes, { prefix: "/catalog" });

fastify.get("/healthcheck", (_, reply) => reply.send({ status: "ok" }));

(async function start() {
    try {
        await connect("mongodb+srv://test123123:p123123@cluster0.qu7uxdd.mongodb.net/?retryWrites=true&w=majority");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    try {
        await fastify.listen({ port: 3000 });
        console.log(`server listening on port 3000`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    // const od =  new OrderModel({
    //     customer_info: {
            
    //     }
    // });
    // const e = od.toEntity;

    // console.log(od);

    // await fillRsCat();

    // IssueModel.findOne({ title: "Not working/Global" });
    // const c = await CategoryModel.findOne({ name: "Cat 22" }).populate({ path: "parent", populate: { path: "issues" } });
    
    // const o: Category | undefined = c?.toObject();

    // console.log(o);
})();
