import { Static, Type } from "@sinclair/typebox"
import fastify, { FastifyInstance } from "fastify"
import fastifySwagger from "fastify-swagger"

const PORT = 9000

const server: FastifyInstance = fastify({ logger: true })

server.register(fastifySwagger, {
  routePrefix: "/",
  swagger: {
    info: {
      title: "Test swagger",
      description: "Testing the Fastify swagger API",
      version: "0.1.0",
    },
  },
  exposeRoute: true,
})

const User = Type.Object({
  name: Type.String(),
  mail: Type.Optional(Type.String({ format: "email" })),
})
type UserType = Static<typeof User>

server.post<{ Body: UserType; Reply: UserType }>(
  "/",
  {
    schema: {
      body: User,
      response: {
        200: User,
      },
    },
  },
  (req, rep) => {
    const { body: user } = req
    rep.status(200).send(user)
  }
)

server.listen(PORT)
