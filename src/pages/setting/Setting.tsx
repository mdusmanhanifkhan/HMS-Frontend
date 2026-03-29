import { useEffect, useState } from "react";
import Button from "../../components/button/Button";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token") || "";

interface PriceData {
  price: number;
}

type Tab = "cardPrice" | "otherSetting"; // add more tab keys as needed

const Setting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("cardPrice");
  const [cardPrice, setCardPrice] = useState<number>(200);
  const [inputPrice, setInputPrice] = useState<number>(200);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  

  // -------------------
  // Fetch current price
  // -------------------
  const fetchPrice = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/patients/patient-card-price`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch price");

      const data: PriceData = await res.json();
      setCardPrice(data.price);
      setInputPrice(data.price);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch price");
    }
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  // -------------------
  // Update price
  // -------------------
  const handleUpdatePrice = async () => {
    if (inputPrice < 0) {
      setMessage("Price cannot be negative");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients/patient-card-price`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: inputPrice }),
      });
      if (!res.ok) throw new Error("Failed to update price");
      const data = await res.json();
      setCardPrice(data.price);
      setMessage("Price updated successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* ---------------- Tabs ---------------- */}
      <div className="border-b mb-4">
        <ul className="flex space-x-6">
          <li
            className={`pb-2 cursor-pointer ${
              activeTab === "cardPrice"
                ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("cardPrice")}
          >
            Patient Card Price
          </li>
          <li
            className={`pb-2 cursor-pointer ${
              activeTab === "otherSetting"
                ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("otherSetting")}
          >
            Other Setting
          </li>
          {/* Add more tabs here */}
        </ul>
      </div>

      {/* ---------------- Tab Content ---------------- */}
      <div className="mt-4">
        {activeTab === "cardPrice" && (
          <div>
            <p className="mb-2">
              Current Card Price: <span className="font-bold">{cardPrice} Rs</span>
            </p>

            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border p-2 rounded w-32"
                value={inputPrice}
                onChange={(e) => setInputPrice(Number(e.target.value))}
              />
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
                onClick={handleUpdatePrice}
              >
                {loading ? "Updating..." : "Update Price"}
              </Button>
            </div>
            {message && <p className="mt-2 text-green-600">{message}</p>}
          </div>
        )}

        {activeTab === "otherSetting" && (
          <div>
            <p>This is another tab for future settings.</p>
            {/* Add content for other settings */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
