import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { use } from 'hono/jsx';
import { decode, sign, verify } from 'hono/jwt'
import { postRouter } from './routes/post';
import { userRouter } from './routes/user';
//important in serverless environment variables the routes may be independently deployed. 
//bindings here is used for the c.env.DATABASE_URL type definition

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET:string,
  },Variables : {
		userId: string
	}
}>();

//group routing

app.route('/api/v1/blog',postRouter);
app.route('/api/v1/user',userRouter)
