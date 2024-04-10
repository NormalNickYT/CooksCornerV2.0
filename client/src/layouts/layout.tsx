import Navbar from "@/components/Navbar";

type Props = {
    children: React.ReactNode;
}

export const Layout = ({ children}: Props) => {
    return (
        <div> 
        <div className="min-h-screen">
            <Navbar />
            <div className="w-full">{children}</div>
            </div>
        </div>

    );
}