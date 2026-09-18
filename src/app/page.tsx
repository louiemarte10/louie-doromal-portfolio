import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { RecentWork } from "@/components/RecentWork";
import { Background } from "@/components/Background";
import { Contact, Footer } from "@/components/Contact";
import { profile, experience } from "@/data/resume";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: "https://louie-d-portfolio.vercel.app",
  sameAs: [profile.github, profile.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Iloilo City",
    addressCountry: "PH",
  },
  worksFor: {
    "@type": "Organization",
    name: experience[0].company,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <RecentWork />
        <Background />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
