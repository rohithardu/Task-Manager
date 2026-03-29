import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (<>
    <div className="flex items-center justify-between py-4 px-8 bg-slate-400">
      <h1 className="text-2xl font-semibold">Mehta's Maggi</h1>
      <div>
        <ul className="flex gap-6 justify-center items-center">
          <li className="cursor-pointer">Contact us</li>
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer"><Link href={"/login"}><button className="px-4 py-1 bg-green-400 rounded-full cursor-pointer font-semibold">Login</button></Link></li>
        </ul>
      </div>
      {/* <p className="text-2xl">Here you can manage all your tasks very easily and efficiently.</p> */}
    </div>
    <div className="flex flex-col gap-8 justify-center items-center py-15 mx-auto min-h-[90vh] bg-black/40 p-8 bg-cover" style={{
    backgroundImage: "url('https://tse4.mm.bing.net/th/id/OIP.VpTD9SMH2HNAJL6DxlYxTwHaEK?pid=Api&P=0&h=220')"
  }}>
      <h2 className="text-5xl font-bold">Welcome to Mehta's Maggi</h2>
      <p className="text-3xl text-center max-w-[60vw]">Here you will find only millets and ragi and not aata which is unhealthy. Login and make your first order free.</p>
      <Link href={"/login"}><button className="px-6 py-2 bg-green-400 rounded-full cursor-pointer font-bold text-lg">Login</button></Link>
    </div>
  </>
  );
}
