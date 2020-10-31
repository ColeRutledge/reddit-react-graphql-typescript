import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core"
import { COOKIE_NAME, __prod__ } from "./constants"
import microConfig from "./mikro-orm.config"
import express from "express"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import Redis from "ioredis"
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors"
// import { User } from "./entities/User"
// import { sendEmail } from "./utils/sendEmail"

const main = async () => {
  //   will send email
  //   sendEmail("bob@bob.com", "hello there")
  const orm = await MikroORM.init(microConfig)

  //   will wipe data
  //   orm.em.nativeDelete(User, {})
  await orm.getMigrator().up()

  const app = express()

  const RedisStore = connectRedis(session)
  const redis = new Redis()

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      secret: "39wn823kj486356kle237j9895fe",
      resave: false,
      saveUninitialized: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: { origin: "http://localhost:3000" },
  })

  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  })
}

main().catch((err) => console.log(err))
