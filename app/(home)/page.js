import Programs from "@/components/home/Programs";
import Unlock from "@/components/home/Unlock";
import Gallery from "@/components/home/Gallery";
import Partner from "@/components/home/Partner";

import News from "@/components/home/News";

import Image from "next/image";
import AlumniSection from "@/components/home/Alumni";

export default function Home() {
  return (
   <>
    <Unlock />
    <Programs />
    <Gallery />
    <News />
    <AlumniSection />
    <Partner />
   </>
  );
}
