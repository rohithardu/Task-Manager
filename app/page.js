import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (<>
    <div className="flex flex-col relative">
      <div className="flex items-center justify-between py-4 px-2 sm:px-8 bg-slate-300">
        <h1 className="text-sm sm:text-lg md:text-2xl font-semibold">Task Manager</h1>
        <div>
          <ul className="flex text-xs sm:text-md md:text-lg gap-2 md:gap-6 text-black justify-center items-center">
            <li className="cursor-pointer">Contact us</li>
            <li className="cursor-pointer">About</li>
            <li className="cursor-pointer"><Link href={"/login"}><button className="px-2 sm:px-4 py-1 bg-green-400 rounded-full cursor-pointer font-semibold">Login</button></Link></li>
          </ul>
        </div>
        {/* <p className="text-2xl">Here you can manage all your tasks very easily and efficiently.</p> */}
      </div>
      <div>
        <div className="flex flex-col gap-8 justify-center items-center relative z-10 min-h-[80vh]">
          <h2 className="text-lg sm:text-3xl lg:text-5xl font-bold ">Welcome to Task Manager</h2>
          <p className="text-sm sm:text-xl lg:text-3xl text-center max-w-[60vw]">Welcome to the best task manager available on internet. It is completely free and very easy to use.</p>
          <Link href={"/signup"}><button className="px-4 sm:px-6 py-1 sm:py-2 bg-green-400 rounded-full cursor-pointer font-bold text-sm sm:text-lg">Login</button></Link>
        </div>
        <img src="https://c8.alamy.com/comp/2WM08HP/prioritizing-tasks-concept-confident-woman-with-checklist-marking-top-priorities-efficient-workflow-organization-task-management-and-optimization-flat-vector-illustration-2WM08HP.jpg" alt="image" className="absolute top-0 z-0 opacity-20 w-full mx-auto h-screen" />
      </div>
    </div>

  </>
  );
}
