import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/user/signup',(c)=>{
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
