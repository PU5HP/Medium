import { Appbar } from "@/components/ui/appbar";
import { Fullblog } from "@/components/ui/Fullblog";
import { useBlog } from "@/hooks"
import { useParams } from "react-router-dom";


export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog({
        id: String(id || "")
    });

    if (loading || !blog) {
        const authorName = blog ? blog.author.name : '';
        return (
            <div>
                <Appbar authorName={authorName}></Appbar>
                <div className="flex justify-center items-center h-screen">
                    <div className="rounded-full h-40 w-40 bg-green-600 animate-ping"></div>
                </div>
            </div>
        );
    }

    // Extract authorName from the blog data
    

    return (
        <div>
            <Fullblog blog={blog} />
        </div>
    );
};
