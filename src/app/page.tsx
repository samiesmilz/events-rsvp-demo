import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-6 items-center flex-col sm:flex-row">
          {/* Just a welcome screen before the signup demo */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-orange-500">
            WELCOME
          </h1>

          <Link href="/events">
            <button className="group relative overflow-hidden bg-black text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              {/* The Orange background sweep */}
              <span className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>

              {/* Button text */}
              <span className="relative z-10">Proceed to demo</span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
