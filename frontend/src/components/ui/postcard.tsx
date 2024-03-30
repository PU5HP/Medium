
import { Avatar,AvatarImage,AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";

interface PostCardProps {
    authorName: string;
    title : string;
    content: string;
    publishedDate: string;
    id:string;
}


export const PostCard = ({
    authorName,
    title,
    content,
    publishedDate,
    id,
}: PostCardProps) => {
    return <Link to={`/blog/${id}`}>
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-lg cursor-pointer">
      <article className=" pb-4 mx-auto p-8">
      <header className="flex items-center space-x-4 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage alt="Author's avatar" src="/frontend/src/components/ui/images.jpg"/>
          <AvatarFallback>{authorName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div>
            <p className="text-sm text-gray-500 inline-block pr-2">published on {publishedDate}</p>
            <p className="text-xs text-gray-500 inline-block mx-auto">&#9679;</p>
            <p className="text-sm font-semibold text-green-900 inline-block ml-2">{authorName}</p>
          </div>
        </div>
      </header>
      <section>
      {content.slice(0,200)+'...'}
      </section>
      <div className="text-sm text-gray-500 inline-block mx-auto">
            { `${Math.ceil(content.length /100)} minutes read` }
          </div>
    </article>
    </div>
    </Link>
}