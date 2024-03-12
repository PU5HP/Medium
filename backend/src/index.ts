import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
//important in serverless environment variables the routes may be independently deployed. 
//bindings here is used for the c.env.DATABASE_URL type definition
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>();

//sign-up route
app.post('/api/v1/user/signup',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const body = await c.req.json();
const encryptPassword = new TextEncoder().encode(body.password);
await prisma.user.create({
  data:{
    email: body.email,
    password: body.password,
  }
})
  return c.json('signup');
})

app.post('/api/v1/user/signin',(c)=>{
  return c.json('signin');
})

app.post('/api/v1/blog',(c)=>{
  return c.json('create blog');
})

app.put('/api/v1/blog',(c)=>{
  return c.json('modifying the blog')
})

app.get('/api/v1/blog/:id',(c)=>{
  return c.json('Single blog with id: ' + c.req.param('id'));
});

app.get('/api/v1/blog/bulk',(c)=>{
  return c.json('all blog listed:')
})
export default app
