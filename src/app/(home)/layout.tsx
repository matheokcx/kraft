import SideBar from "@/components/Layout/SideBar/SideBar";



const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <main style={{width:'100%', height:'100%', display: "flex", gap: "24px", padding: "32px"}}>
            <SideBar />
            {children}
        </main>
    );
};

export default HomeLayout;
