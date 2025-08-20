import { Outlet } from "react-router-dom";
import "./App.css";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Topbar } from "./components/topbar/Topbar";
import Container from "./layout/Container";

function App() {
  return (
    <div className="flex">
      <div className="bg-[#060505] max-w-[250px] h-screen w-full">

        <p className="text-white text-2xl font-medium mx-auto py-5 w-fit">
          Enjin X
        </p>

        <Sidebar />
      </div>
      <div className="flex flex-col w-full">
        <Topbar />

        <Container className="w-full h-full">
          <Outlet />
        </Container>

      </div>
    </div>
  );
}

export default App;
