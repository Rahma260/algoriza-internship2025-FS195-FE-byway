import { Check } from "lucide-react";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";

export default function SuccessDialog() {
  return (
    <>

      <div className="m-24">
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center rounded-full w-52 h-52 bg-green-600">
            <Check size={120} strokeWidth={8} className="text-white" />
          </div>
        </div>
        <div className="flex justify-center items-center m-2 flex-col mb-10">
          <h1 className="text-4xl font-bold mb-4">Purchase Complete</h1>
          <p className="text-gray-600 text-lg font-semibold">You Will Receive a confirmation email soon! </p>
          <button
            className=" mt-4 px-14 py-2 rounded-lg font-semibold border-2 border-black bg-black text-white transition-all hover:text-black hover:bg-white transition fade-in-out duration-500"
          >
            Back to home
          </button>
        </div>
      </div>

    </>
  );
}
