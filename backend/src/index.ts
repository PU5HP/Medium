import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { use } from 'hono/jsx';
import { decode, sign, verify } from 'hono/jwt'
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
//middle ware to authorize the user for blogs
app.use('/api/v1/blog/*', async (c, next) => {
  //get the header
  //verify the header
  //if the header is correct,we can proceed
  //if not return the user a 403 status code
  //authorization{Bearer token}

  const header = c.req.header("authorization") || ""; //header cannot be undefined so it can be a empty string
  const token = header.split(' ')[1];
  const response = await verify(token,c.env.JWT_SECRET);
  console.log(response);
  if(response.id){
    c.set('userId',response.id)
    await next()
  }
  c.status(403);
  return c.json({Error:'Not authorized'})
})

//sign-up route
app.post('/api/v1/user/signup',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const body = await c.req.json();
const BeforeHash = new TextEncoder().encode(body.password);//in certain format before hashing
const hashedPassword = await crypto.subtle.digest(
  {
    name: 'SHA-256',
  },
  BeforeHash // The data you want to hash as an ArrayBuffer
);

var pass = new TextDecoder().decode(hashedPassword);

//returns object
const user = await prisma.user.create({
  data:{
    email: body.email,
    password: pass,
  }
})

const token = await sign({id:user.id},c.env.JWT_SECRET);
  return c.json({ jwt:token});
})



//signin route
app.post('/api/v1/user/signin',async (c)=>{

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const body = await c.req.json();

const BeforeHash = new TextEncoder().encode(body.password);//in certain format before hashing
const hashedPassword = await crypto.subtle.digest(
  {
    name: 'SHA-256',
  },
  BeforeHash // The data you want to hash as an ArrayBuffer
);

var pass = new TextDecoder().decode(hashedPassword);
//check if the password is same as in user db
var user = await prisma.user.findUnique({
  where: {
    email: body.email,
    password:pass
  }
});

if(user===null){
  c.status(403);
  return c.json('User not found')
}
const jwt = await sign({id: user.id},c.env.JWT_SECRET);
  return c.json({jwt});
})
//create blog
app.post('/api/v1/blog',(c)=>{
  const user = c.get('userId');
  return c.json({'create blog':user});
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
