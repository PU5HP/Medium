import { Appbar } from "@/components/ui/appbar"
import { PostCard } from "../components/ui/postcard"
import {useBlogs} from "../hooks/index.ts"
export const Posts = () => {
    const {loading, blogs} = useBlogs();

    if(loading){
        return <div>
      <div className="flex justify-center items-center h-screen">
      <div className="rounded-full h-40 w-40 bg-pink-300 animate-ping"></div>
      </div>
      </div>
    }
    return <div>
        
        <Appbar></Appbar>
        <div className="flex justify-center">
        <div>
          {blogs.map(blog => <PostCard 
        id={blog.id}
        authorName={blog.author.name || "Anonymous"}
        title={blog.title}
        content={blog.content}
        publishedDate={"22 feb 2024"}
        ></PostCard>)}
        </div>
        </div>
    </div>
}