import { Appbar } from "@/components/ui/appbar"
import { PostCard } from "../components/ui/postcard"
import {useBlogs} from "../hooks/index.ts"
export const Posts = () => {
    const {loading, blogs} = useBlogs();

    if(loading){
        return <div>
    <div role="status" className="max-w-sm animate-pulse">
    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
    <span className="sr-only">Loading...</span>
      </div>
      </div>
    }
    return <div>
        <Appbar authorName="user"></Appbar>
        <div className="flex justify-center">
        <div className="max-w-xl">
        <PostCard 
        authorName={'finn singh'}
        title={'55+ Most Popular Blog Examples You Need to Check Out for Inspiration'}
        content={"A blog is a website or page that is a part of a larger website. Typically, it features articles written in a conversational style with accompanying pictures or videos.Blogging has gained immense popularity due to its enjoyable and adaptable nature, allowing for self-expression and social connections. In addition, it serves as a platform for enhancing writing skills and promoting businessesFurthermore, a professional blogger can even make money from blogging in various ways, such as Google ads and Amazon affiliate links. Successful blogs can cover any topic. No matter what subject you can think of, there’s likely already a profitable blog dedicated to it."}
        publishedDate={"2nd Feb 2024"}
        ></PostCard>
          <PostCard 
        authorName={'finn'}
        title={'55+ Most Popular Blog Examples You Need to Check Out for Inspiration'}
        content={"A blog is a website or page that is a part of a larger website. Typically, it features articles written in a conversational style with accompanying pictures or videos.Blogging has gained immense popularity due to its enjoyable and adaptable nature, allowing for self-expression and social connections. In addition, it serves as a platform for enhancing writing skills and promoting businessesFurthermore, a professional blogger can even make money from blogging in various ways, such as Google ads and Amazon affiliate links. Successful blogs can cover any topic. No matter what subject you can think of, there’s likely already a profitable blog dedicated to it."}
        publishedDate={"2nd Feb 2024"}
        ></PostCard>
          <PostCard 
        authorName={'finn'}
        title={'55+ Most Popular Blog Examples You Need to Check Out for Inspiration'}
        content={"A blog is a website or page that is a part of a larger website. Typically, it features articles written in a conversational style with accompanying pictures or videos.Blogging has gained immense popularity due to its enjoyable and adaptable nature, allowing for self-expression and social connections. In addition, it serves as a platform for enhancing writing skills and promoting businessesFurthermore, a professional blogger can even make money from blogging in various ways, such as Google ads and Amazon affiliate links. Successful blogs can cover any topic. No matter what subject you can think of, there’s likely already a profitable blog dedicated to it."}
        publishedDate={"2nd Feb 2024"}
        ></PostCard>
          <PostCard 
        authorName={'finn'}
        title={'55+ Most Popular Blog Examples You Need to Check Out for Inspiration'}
        content={"A blog is a website or page that is a part of a larger website. Typically, it features articles written in a conversational style with accompanying pictures or videos.Blogging has gained immense popularity due to its enjoyable and adaptable nature, allowing for self-expression and social connections. In addition, it serves as a platform for enhancing writing skills and promoting businessesFurthermore, a professional blogger can even make money from blogging in various ways, such as Google ads and Amazon affiliate links. Successful blogs can cover any topic. No matter what subject you can think of, there’s likely already a profitable blog dedicated to it."}
        publishedDate={"2nd Feb 2024"}
        ></PostCard>
        </div>
        </div>
    </div>
}