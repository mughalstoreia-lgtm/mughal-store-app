import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black border-b border-neutral-800">
      {/* Clicking the banner will take the user to the shop page */}
      <Link href="/shop" className="block relative w-full cursor-pointer group">
        
        {/* Desktop Hero Image Area */}
        <div className="relative w-full h-[85vh] hidden md:block">
          <Image
            src="/desktophero.jpeg"
            alt="Mughal's Store Desktop Hero"
            fill
            priority
            sizes="100vw"
            className="object-fill object-center transition-transform duration-500"
          />
        </div>

        {/* Mobile Hero Image Area */}
        <div className="relative w-[100vw] h-[80vh] block md:hidden">
          <Image
            src="/mobilehero.jpeg"
            alt="Mughal's Store Mobile Hero"
            fill
            priority
            sizes="100vw"
            className="object-fill object-center"
          />
        </div>

      </Link>
    </section>
  );
}