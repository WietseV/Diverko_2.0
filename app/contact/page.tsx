import NavBar from '@/components/navBar/page';
import Footer from '@/components/footer/page';
import PageHero from '@/components/pageHero/page';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import { getGeneralPage } from '@/lib/getGeneralPage';
import { getLanguage } from '@/lib/language';
import { portableComponents } from '@/lib/portableTextComponents';
import Panel from '@/components/panel/page';
import ContactForm from '@/components/contactSection/ContactForm';
import { sanityClient } from '@/lib/sanity.client';
import { siteSettingsQuery } from '@/lib/sanity.queries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Email, WhatsApp, or connect on LinkedIn to kickstart your collaboration with Diverko.',
};

export default async function ContactPage() {
  const lang = await getLanguage();
  const page = await getGeneralPage('contact', lang);
  const settings = await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery, { lang });
  const linkedin = settings?.socialLinks?.find((link) => link.platform?.toLowerCase().includes("linkedin"));
  const whatsapp = settings?.socialLinks?.find((link) => link.platform?.toLowerCase().includes("whatsapp"));

  return (
    <div className='bg-primary_light text-primary_dark'>
      <NavBar/>
      <PageHero
        title={page?.heroTitle ?? 'Nothing beats a conversation'}
        highlight={page?.heroHighlight ?? ''}
        paragraph={page?.heroParagraph ?? ''}
        backgroundImage={page?.heroImage ?? null}
      />
      <section className="max-w-5xl mx-auto px-6 py-16">
        <Panel className="">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-secondary">Contact</p>
                <h2 className="text-3xl font-semibold text-primary_dark">Tell us about your mission</h2>
              </div>
              <PortableText value={page?.body ?? []} components={portableComponents} />
              <div className="space-y-3 text-sm text-primary_dark/80">
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 rounded-2xl border border-primary_dark/10 px-4 py-3 transition hover:border-secondary">
                    <FontAwesomeIcon icon={faEnvelope} className="text-secondary" />
                    {settings.email}
                  </a>
                )}
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-3 rounded-2xl border border-primary_dark/10 px-4 py-3 transition hover:border-secondary">
                    <FontAwesomeIcon icon={faPhone} className="text-secondary" />
                    {settings.phone}
                  </a>
                )}
                {settings?.address ? (
                  <div className="rounded-2xl border border-primary_dark/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.35em] text-primary_dark/50">Office</p>
                    <p>{settings.address}</p>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-3 pt-2">
                  {linkedin ? (
                    <a href={linkedin.url ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary_dark/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary_dark hover:border-secondary">
                      <FontAwesomeIcon icon={faLinkedinIn} />
                      LinkedIn
                    </a>
                  ) : null}
                  {whatsapp ? (
                    <a href={whatsapp.url ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary_dark/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary_dark hover:border-secondary">
                      <FontAwesomeIcon icon={faWhatsapp} />
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </Panel>
      </section>
      <Footer/>
    </div>
  );
}

type SiteSettings = {
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: { platform?: string; url?: string }[];
};
