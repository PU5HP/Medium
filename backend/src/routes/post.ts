import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { use } from 'hono/jsx';
import { decode, sign, verify } from 'hono/jwt'
//important in serverless environment variables the routes may be independently deployed. 
//bindings here is used for the c.env.DATABASE_URL type definition

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET:string,
  },Variables : {
		userId: string
	}
}>();

//middle ware to authorize the user for blogs
postRouter.use('/*', async (c, next) => {
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
      c.set('userId',response.id)//return user id to the next middleware
      await next()
    }
    c.status(403);
    return c.json({Error:'Not authorized'})
  })




//create blog
postRouter.post('/',async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const userId = c.get('userId');
    //create post in the DB
    const post = await prisma.post.create({
      data:{
        title:body.title,
        content:body.content,
        published:body.published,
        authorId:userId
      }
    })
  
    return c.json({'create blog user':userId,'postId':post.id});
  })
  //updating the blog
postRouter.put('/',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  //pass the post id in the body
  const userId = c.get('userId');
    const body = await c.req.json();
    const postData = await prisma.post.update({
      where:{
        id:body.postId,
        authorId:userId
      },
      data:{
        content:body.content,
        published:body.published,
        title:body.title
      },
    })
    
    return c.json({'updated create blog user':userId,'postId':postData});
    
  })
  //get all the particular posts
postRouter.get('/:uId',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userId = c.get('userId');
    //const postId = c.body.postId;
    const posts = await prisma.post.findMany({
      where:{
        authorId:userId
      }
    })
    console.log(posts);
  
    return c.json({'user_posts_uid':posts});
  });
  //give away all posts
postRouter.get('/bulk/posts',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userId = c.get('userId');
    //const postId = c.body.postId;
    const posts = await prisma.post.findMany();
    console.log(posts);
    
    return c.json({'user_posts_all':posts});
    //return c.json('all blog listed:')
})