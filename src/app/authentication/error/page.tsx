import NoResult from "@/assets/no_result.png";
import Error from "@/assets/error.png";
import NotFound from "@/assets/404.jpg";

export function NoResultPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] w-full items-center justify-center px-4">
            <img src={NoResult} alt="No Result" className="w-1/3 h-fit"/>
        </div>
    )
}

export function ErrorPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] w-full items-center justify-center px-4">
            <img src={Error} alt="No Result" className="w-1/3 h-fit"/>
        </div>
    )
}

export function NotFoundPage() {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center px-4">
            <img src={NotFound} alt="No Result" className="w-1/2 h-fit"/>
        </div>
    )
}