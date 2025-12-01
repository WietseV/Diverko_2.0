import NavBar from '@/components/navBar/page';
import Footer from '@/components/footer/page';
import PageHero from '@/components/pageHero/page';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import { getGeneralPage } from '@/lib/getGeneralPage';
import { getLanguage } from '@/lib/language';
import { portableComponents } from '@/lib/portableTextComponents';
import { getMissions } from '@/lib/getMissions';
import ContactCta from '@/components/contactCta/page';
import Panel from '@/components/panel/page';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';

export const metadata: Metadata = {
  title: 'Consultancy',
  description: 'Hands-on support, team management, and strategic guidance for your sales division.',
};

export default async function ConsultancyPage() {
  const lang = await getLanguage();
  const page = await getGeneralPage('consultancy', lang);
  const missions = await getMissions(lang);
  const consultancyMissions = missions.filter((mission) => mission.categories?.includes('consultancy'));

  return (
    <div className='bg-primary_light text-primary_dark'>
      <NavBar/>
      <PageHero
        title={page?.heroTitle ?? 'Consultancy'}
        highlight={page?.heroHighlight ?? ''}
        paragraph={page?.heroParagraph ?? ''}
        backgroundImage={page?.heroImage ?? null}
      />
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <Panel>
          <PortableText value={page?.body ?? []} components={portableComponents} />
        </Panel>
        {consultancyMissions.length > 0 && (
          <div className="space-y-6">
            {consultancyMissions.map((mission) => (
              <Panel key={mission._id} className="grid gap-6 md:grid-cols-[minmax(220px,280px)_1fr] items-start">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-primary_dark/5">
                  {mission.image ? (
                    <Image
                      src={urlFor(mission.image).width(600).height(400).url()}
                      alt={mission.title ?? 'Consultancy highlight'}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-secondary">Consultancy</p>
                  <h3 className="text-2xl font-semibold text-primary_dark">{mission.title}</h3>
                  <p className="text-primary_dark/80">{mission.summary}</p>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </section>
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
