import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { activities } from "@/lib/activities";

const Initiatives = () => {
  const Card = ({ image, title, href }) => {
    const isExternalImage = typeof image === "string";

    return (
      <Link
        href={href}
        className="group flex flex-col bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          {isExternalImage ? (
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Image
              src={image}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-indigo-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 flex flex-grow items-center justify-between gap-3 text-left">
          <h3 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-indigo-900 transition-colors leading-tight">
            {title}
          </h3>
          <div className="p-1 rounded-lg border border-slate-100 bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-700" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section
      id="activities"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28"
    >
      <div className="text-center space-y-3 mb-12">
        <span className="text-indigo-800 text-xs font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Explore Gallery</span>
        <h2 className="font-extrabold text-3xl md:text-4xl text-slate-900">Latest Activities & Events</h2>
        <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto font-medium">
          Participating in state and national initiatives to foster collaboration, awareness, and fit lifestyles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card
            key={activity.href}
            image={activity.image}
            title={activity.title}
            href={activity.href}
          />
        ))}
      </div>
    </section>
  );
};

export default Initiatives;
