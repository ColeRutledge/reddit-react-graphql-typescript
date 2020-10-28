import { User } from "src/entities/User"
import { MyContext } from "src/types"
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql"

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}


@Resolver()
export class UserResolver {
    @Mutation(() => String)
    async register(
        @Arg('input', () => UsernamePasswordInput) input: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ) {
        const user = em.create(User, { username: input.username })
        await em.persistAndFlush(user)
        return 'bye'
    }
}
