import Image from "next/image";
import Link from "next/link";
import type { Image as SanityImageSource } from "sanity";
import { urlFor } from "@/lib/sanity.image";

type TileProps = {
  src?: string | SanityImageSource;
  title: string;
  content: string;
  href: string;
  onPressed?: () => void;
};

export default function Tile({ src, title, content, href, onPressed }: TileProps) {
  return (
    <Link
      href={href}
      onClick={onPressed}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary_dark/10 bg-primary_light/95 text-primary_dark shadow-[0_20px_60px_-30px_rgba(6,17,52,0.65)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(6,17,52,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
    >
      <div className="relative h-52 w-full shrink-0">
        {src ? (
          <Image
            src={typeof src === "string" ? src : urlFor(src).width(800).url()}
            alt={title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full bg-primary_dark/5" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 pb-7 pt-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-base text-primary_dark/80">{content}</p>
      </div>
    </Link>
  );
}
