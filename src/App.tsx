import { Outlet } from "react-router-dom";
import "./App.css";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Topbar } from "./components/topbar/Topbar";
import Container from "./layout/Container";

function App() {
  return (
    <div className="flex">
      <div className="bg-[#060505] max-w-[250px] h-screen w-full">

        <p className="text-white text-xl font-light mx-auto py-5 w-fit">
          HMS Enjin X
        </p>

        <Sidebar />
      </div>
      <div className="flex flex-col w-full">
        <Topbar />

        <Container className="w-full h-[93vh] overflow-y-auto">
          <Outlet />
        </Container>

      </div>
    </div>
  );
}

export default App;
