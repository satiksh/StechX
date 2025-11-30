import Image from "next/image";

const values = [
  { title: "Future-ready Designs", desc: "Apple-level UI & UX" },
  { title: "Fast Delivery", desc: "Startup speed" },
  { title: "Cost-effective Pricing", desc: "Discuss on call" },
  { title: "Top Talent Network", desc: "Developers, editors, engineers" },
];

const services = [
  {
    name: "Web Development",
    desc: "Websites, landing pages, dashboards, SaaS, e-commerce",
    link: "/services"
  },
  {
    name: "App Development",
    desc: "iOS, Android, Flutter, React Native",
    link: "/services"
  },
  {
    name: "Video Editing",
    desc: "Reels, ads, cinematic edits, YouTube editing",
    link: "/services"
  },
  {
    name: "AI Automation",
    desc: "Chatbots, workflow automation, custom AI tools, API integrations",
    link: "/services"
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-slate-900 text-white flex flex-col items-center px-6 py-12 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Hero */}
        <section className="max-w-3xl w-full text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500/30 rounded-full blur-xl"></div>
              <Image
                src="/stxlogo.png"
                alt="StechX logo"
                width={64}
                height={64}
                className="drop-shadow-2xl rounded-full relative z-10"
              />
            </div>
            <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              StechX
            </span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400 mb-4 font-light">
            Startup for Startups
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent leading-tight">
            Building digital products for the next generation of innovators.
          </h1>
          <p className="text-neutral-400 mb-10 text-lg max-w-2xl mx-auto">
            Web, App, Video, and AI Automation — a futuristic studio designed for founders, creators, and top talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/60 transition-all hover:scale-105">
              Get Your Project
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-neutral-700 text-neutral-200 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-neutral-600 transition-all">
              Join as Talent
            </button>
          </div>
        </section>

        {/* Why StechX */}
        <section className="w-full max-w-5xl mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Why StechX?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 border border-neutral-800/50 backdrop-blur-sm p-6 text-center hover:scale-105 hover:border-sky-500/50 transition-all hover:shadow-lg hover:shadow-sky-500/20"
              >
                <h3 className="font-semibold text-lg mb-2">{val.title}</h3>
                <p className="text-sm text-neutral-400">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Services */}
        <section className="w-full max-w-5xl mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((svc, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 backdrop-blur-sm p-8 hover:border-sky-500/60 transition-all hover:shadow-xl hover:shadow-sky-500/10"
              >
                <h3 className="text-2xl font-bold mb-3">{svc.name}</h3>
                <p className="text-sm text-neutral-400 mb-5">{svc.desc}</p>
                <a
                  href={svc.link}
                  className="inline-block px-6 py-3 rounded-full border border-sky-500 text-sky-400 text-sm font-medium hover:bg-sky-500 hover:text-black transition-all"
                >
                  Explore {svc.name}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Two-Way Model */}
        <section className="w-full max-w-5xl mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            A Platform for Clients & Talent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 backdrop-blur-sm p-10 text-center hover:border-sky-500/60 transition-all hover:shadow-xl hover:shadow-sky-500/10">
              <h3 className="text-2xl font-bold mb-4">For Clients</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Hire developers, editors, AI experts — managed by StechX
              </p>
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/60 transition-all">
                Book a Free Call
              </button>
            </div>
            <div className="rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 backdrop-blur-sm p-10 text-center hover:border-sky-500/60 transition-all hover:shadow-xl hover:shadow-sky-500/10">
              <h3 className="text-2xl font-bold mb-4">For Talent</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Apply for job or project-based work — remote, flexible opportunities
              </p>
              <button className="px-8 py-3 rounded-full border-2 border-sky-500 text-sky-400 font-semibold hover:bg-sky-500 hover:text-black transition-all">
                Apply Now
              </button>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="w-full max-w-3xl mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Meet the Founder
          </h2>
          <div className="rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 backdrop-blur-sm p-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500/30 rounded-full blur-xl"></div>
                <Image
                  src="/satiksh.jpeg"
                  alt="Satiksh Patel"
                  width={140}
                  height={140}
                  className="rounded-full border-4 border-sky-500/60 shadow-2xl shadow-sky-500/30 relative z-10"
                />
              </div>
            </div>
            <p className="text-2xl font-bold mb-2">Satiksh Patel</p>
            <p className="text-sm text-sky-400 mb-5 font-medium">Founder & CEO</p>
            <p className="text-sm text-neutral-300 leading-relaxed mb-5">
              BS in Data Science, IIT Madras — building StechX to empower startups and creators with modern tech and AI-driven solutions.
            </p>
            <div className="flex flex-col items-center gap-3 text-sm">
              <a 
                href="mailto:satikshpatel8@gmail.com"
                className="text-sky-400 hover:text-sky-300 transition font-medium"
              >
                satikshpatel8@gmail.com
              </a>
              <a 
                href="https://www.linkedin.com/in/satikshpatel/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 transition font-medium"
              >
                linkedin.com/in/satikshpatel
              </a>
            </div>
            <p className="mt-8 text-2xl italic text-neutral-500 font-light">— Satiksh</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-4xl mb-20">
          <div className="rounded-3xl border-2 border-sky-500/50 bg-gradient-to-br from-sky-950/40 via-neutral-950/60 to-blue-950/40 backdrop-blur-sm p-12 text-center shadow-2xl shadow-sky-500/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-white via-sky-100 to-blue-200 bg-clip-text text-transparent">
              Let's build something extraordinary.
            </h2>
            <p className="text-neutral-300 mb-8 text-lg">
              Whether you need a product built or want to join the team, StechX is ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-xl shadow-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/60 transition-all hover:scale-105">
                Get Started
              </button>
              <button className="px-10 py-4 rounded-full border-2 border-sky-500 text-sky-400 font-bold text-lg hover:bg-sky-500 hover:text-black transition-all hover:scale-105">
                Book a Call
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
