import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { use } from 'hono/jsx';
import { decode, sign, verify } from 'hono/jwt'
//important in serverless environment variables the routes may be independently deployed. 
//bindings here is used for the c.env.DATABASE_URL type definition

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET:string,
  },Variables : {
		userId: string
	}
}>();

//sign-up route
userRouter.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
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
        name:body.name
      }
    })
    
    const token = await sign({id:user.id},c.env.JWT_SECRET);
      return c.json({ jwt:token});
  }
  catch(e){
      c.status(411)
      console.log('error:'+e)
      return c.text('Something is wrong')
  }
  })
  
  
  
  //signin route
userRouter.post('/signin',async (c)=>{
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  try{
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
  }
  catch(e){
  c.status(403);
  return c.json({'error':"Incorrect LOgin details"})
  }
  })
  
  