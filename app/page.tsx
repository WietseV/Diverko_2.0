import ActionButton from '@/components/actionButton/page';
import Tile from '@/components/tile/page';
import Swimlane from '@/components/swimlane/page';
import Footer from '@/components/footer/page';
import NavBar from '@/components/navBar/page';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { Image as SanityImageSource } from 'sanity';
import { sanityClient } from '@/lib/sanity.client';
import { homePageQuery } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.image';
import { getLanguage, type Language } from '@/lib/language';
import SectionHeading from '@/components/sectionHeading/page';
import PartnerStrip from '@/components/partnerStrip/page';
import TestimonialSlider from '@/components/testimonialSlider/page';
import ContactCta from '@/components/contactCta/page';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Diverko partners with sales teams for consultancy, training, and motorsport-inspired coaching.',
};

type HomePagePayload = {
  hero?: {
    title?: string;
    highlight?: string;
    tagline?: string;
    backgroundImage?: SanityImageSource;
    primaryCta?: { label?: string; href?: string };
    secondaryCta?: { label?: string; href?: string };
  };
  missionsHeading?: string;
  missions?: {
    _id: string;
    title?: string;
    summary?: string;
    href?: string;
    image?: SanityImageSource;
  }[];
  contactTitle?: string;
  contactBody?: string;
  partnerLogos?: { _key: string; name?: string; logo?: SanityImageSource }[];
  testimonials?: {
    _id: string;
    name?: string;
    role?: string;
    quote?: string;
    avatar?: SanityImageSource;
  }[];
};

async function getHomePage(lang: Language) {
  try {
    return await sanityClient.fetch<HomePagePayload>(homePageQuery, { slug: "home", lang });
  } catch (error) {
    console.warn("Failed to fetch home page content from Sanity", error);
    return null;
  }
}

/* const FALLBACK_COPY: Record<Language, { heroTitle: string; heroTagline: string; missionsHeading: string; contactTitle: string; contactBody: string; missions: { title: string; summary: string; href: string }[] }> = {
 *  ...local fallback copy commented out temporarily to verify Sanity content
 * };
 */

export default async function App() {
  const lang = await getLanguage();
  const data = await getHomePage(lang);
  const hero = data?.hero;
  const heroTitle = hero?.title ?? "";
  const heroTagline = hero?.tagline ?? "";
  const primaryCta = hero?.primaryCta;
  const secondaryCta = hero?.secondaryCta;
  const heroImage = hero?.backgroundImage ? urlFor(hero.backgroundImage).width(1600).url() : '/banner.jpg';
  const missionsHeading = data?.missionsHeading ?? "";
  const missions =
    data?.missions && data.missions.length > 0
      ? data.missions
      : [];
  const contactBody = data?.contactBody ?? "";

  return (
    <div className='text-primary_light'>
      <NavBar/>
      {/* Hero element */}
      <div className="w-svw h-screen">
        <div className='bg-primary_dark bg-opacity-60 h-[calc(100%-74px)] lg:h-[calc(100%-56px)]'>
          <Image
            src={heroImage}
            alt="banner image"
            fill={true}
            className='w-svw h-svw absolute -z-10 object-cover'
          />

          <div className='px-6 h-full flex flex-col justify-end pb-8 md:pb-16 lg:pb-32 md:max-w-3xl lg:max-w-2xl lg:ml-[calc(1/9*100%)]'>
            <h1 className='font-bold text-4xl md:text-5xl leading-tight'>{heroTitle}</h1>
            <p className='text-lg md:text-xl pt-6 font-medium'>{heroTagline}</p>
            <div className='flex flex-wrap justify-start gap-4 pt-8'>
              <ActionButton title={primaryCta?.label ?? 'Ready, Set, Go'} href={primaryCta?.href ?? ''}/>
              <ActionButton title={secondaryCta?.label ?? 'Let\'s race'} href={secondaryCta?.href ?? ''}/>
            </div>
          </div>
        </div>
      </div>
      {/* Missions Overview */}
      <div className="w-svw text-primary_dark bg-primary_light">
        <div className='max-w-4xl mx-auto flex justify-center px-6 pt-20 pb-10 text-center'>
          <SectionHeading title={missionsHeading || "Our missions"} subtitle={contactBody} />
        </div>
        <div className='flex justify-center px-0 pb-24'>
          <Swimlane className="max-w-6xl">
            {missions.map((mission) => (
              <Tile
                key={mission._id}
                src={mission.image}
                title={mission.title ?? ""}
                content={mission.summary ?? ""}
                href={mission.href ?? "/missions"}
              />
            ))}
          </Swimlane>
        </div>
      </div>
      <TestimonialSlider testimonials={data?.testimonials ?? []} />
      <PartnerStrip partners={data?.partnerLogos ?? []} />
      <ContactCta
        title="Ready to plan your next mission?"
        subtitle="Contact"
        ctaLabel="Schedule a call"
        ctaHref="/contact"
      />
      <Footer/>
    </div>
  );
}
