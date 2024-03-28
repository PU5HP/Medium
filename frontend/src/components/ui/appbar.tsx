import { Avatar,AvatarFallback,AvatarImage } from "@radix-ui/react-avatar"
interface AppbarProps {
    authorName: string;
}
export const Appbar =({authorName}:AppbarProps) => {
    return (<div className="border-b bg-pink-200 flex justify-between px-10 py-4">
        <div className="text-2xl font-bold text-green-800 ">
            Medium
        </div>

        <div className="text-2xl font-bold">
        <Avatar className="h-12 w-12">
          <AvatarImage alt="Author's avatar" src="./abstract-user-flat-4.png" />
          <AvatarFallback>{authorName[0]}</AvatarFallback>
        </Avatar>
        </div>
    </div>)
}

