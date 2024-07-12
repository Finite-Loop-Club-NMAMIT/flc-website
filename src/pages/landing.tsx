"use client"
import BinarizedTextEffect from "~/components/BinarizedTextEffect/BinarizedTectEffect";
import NewNavBar from "~/components/navbar/NewNavBar";
import FixedSocialBar from "~/components/Footer/FixedSocialBar";
import Hero from "~/components/Hero/Hero";
import Footer from "~/components/Footer/Footer";

export default function Home() {

  return (
    <>
      <main>
        <NewNavBar />
        <Hero />
        {/* <div className="min bg-sky-600 bg-noise-filter w-[500px] skewed-box px-10 grid place-content-center text-center interactable " data-type="content-box">
          <BinarizedTextEffect trigger="appearAndHover" text="Lorem ipsum dolor sit amet" />
        </div> */}

        <section className="w-full h-screen">
          TODO: Diary component
        </section>

        <Footer />
      </main>
    </>
  );
}