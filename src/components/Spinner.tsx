import Image from "next/image";

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-background bg-opacity-20">
      <div className="relative flex flex-col items-center justify-center w-full gap-4">
        <div className="border-8 border-[#F3424Eff] rounded-full w-28 h-28 animate-spin border-t-muted"></div>
        <Image
          className="absolute w-auto h-12"
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          priority
        />
      </div>
    </div>
  );
}
