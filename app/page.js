import Image from "next/image";
import Login from "./login/Login";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Login />
    </div>
  );
}
