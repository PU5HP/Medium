import { Link } from "react-router-dom"


export const Appbar =() => {
    return (<div className="border-b bg-pink-200 flex justify-between px-10 py-4">
        <Link to={'/blog/bulk/posts'} className="text-3xl font-bold text-green-800 ">
            Medium
            </Link >
        <div>
        <Link to={'/publish'}>
        <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">New Blog</button>
        </Link>
        <Link to={'/signin'} className="text-2xl font-bold">
        <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Logout</button>
        </Link>
        </div>
        </div>)
   
}

