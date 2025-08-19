import "./App.css";
import { Sidebar } from "./components/sidebar/sidebar";
import { Topbar } from "./components/topbar/Topbar";

function App() {
  return (
    <div className="flex">
      <div className="bg-[#060505] max-w-[250px] h-screen w-full">
        <div>
          <p className="text-white text-2xl font-medium mx-auto py-5 w-fit">
            Enjin X
          </p>
        </div>
     <Sidebar />
      </div>
      <div className="flex flex-col w-full">
      <Topbar/>
        <div className="w-full h-full bg-gray-400"></div>
      </div>
    </div>
  );
}

export default App;
