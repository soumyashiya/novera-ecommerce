import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Services";
import Subscribe from "@/components/Subscribe";
import StatementBanner from "@/components/StatementBanner";
import Categories from "@/components/Categories";
import Process from "@/components/Process";
import Quiz from "@/components/Quiz";
import NewArrivals from "@/components/NewArrivals";
import FeaturedReview from "@/components/FeaturedReview";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";

// Section rhythm: hero → products → statement banner → about → categories →
// quiz → process → reviews → FAQ.
export default function Home() {
  return (
    <main>
      <Hero />
      <Products />
      <Subscribe />

      <StatementBanner
        variant="split"
        lines={["More claims", "isn't better.", "Verified is."]}
        cta={{ label: "Shop the verified range", href: "/shop" }}
        image="/images/gen/subscribe-bg.png"
        imageAlt="Sealed research pens and amber vials in an open case on a warm surface"
        flipImage
        specs={[
          { label: "Independently assayed.", value: "99%+ purity" },
          { label: "Batch-numbered.", value: "Every pen traceable" },
          { label: "Sealed & cold-stored.", value: "2–8 °C" },
        ]}
        specNote="Every batch, documented."
      />

      <About />
      <Categories />
      <Quiz />
      <Process />
      <NewArrivals />
      <FeaturedReview />
      <ReviewsCarousel />
      <Testimonials />
      <Faq />
    </main>
  );
}
