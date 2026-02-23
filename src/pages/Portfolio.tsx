import React, { useMemo, useRef, useState } from 'react';
import {
  BadgeCheck,
  Briefcase,
  Camera,
  Clapperboard,
  Film,
  Globe,
  GraduationCap,
  ImagePlus,
  Layers,
  Mic2,
  PlayCircle,
  Sparkles,
  Upload,
  Video,
  WandSparkles,
} from 'lucide-react';

type Company = {
  id: string;
  period: string;
  name: string;
  role: string;
  description: string;
  logo?: string;
};

type PortfolioTrack = 'Graphic Design' | 'Video Editing' | 'Reels' | 'Long Form Videos';

const initialCompanies: Company[] = [
  {
    id: 'mx-wedding',
    period: '2019 — 2022',
    name: 'MX Wedding',
    role: 'Multimedia Specialist — Photographer & Videographer',
    description:
      'Delivered wedding storytelling through cinematic photography and videography as a multimedia specialist focused on emotional visual narratives.',
  },
  {
    id: 'panda-marketing',
    period: '2019 — 2022',
    name: 'Panda Marketing',
    role: 'Multimedia Specialist — Advertising Production',
    description:
      'Produced campaign media assets across photography, videography, and editing with a multimedia-first commercial mindset.',
  },
  {
    id: 'arab-entrepreneurs-union',
    period: '2022',
    name: 'Arab Entrepreneurs Union Ceremony',
    role: 'Graphic Designer & Event Creative Director',
    description:
      'Directed event visuals and brand storytelling as a multimedia specialist balancing design strategy with production execution.',
  },
  {
    id: 'h2o',
    period: 'June 2024 — September 2024',
    name: 'H2O Agency Marketing',
    role: 'Graphic Designer',
    description:
      'Crafted social and campaign visuals with a multimedia specialist approach optimized for retention, clarity, and conversion.',
  },
  {
    id: 'go-media',
    period: 'September 2024 — September 2025',
    name: 'GO Media',
    role: 'Graphic Designer • Video Editor • Voice Over Artist',
    description:
      'Combined visual design, narrative editing, and voice performance to deliver full-spectrum multimedia communication.',
  },
  {
    id: 'idarti',
    period: 'September 2025 — Present',
    name: 'Idarti Studio',
    role: 'Graphic Designer • Video Editor • Brand Presenter',
    description:
      'Representing the brand on-camera while executing high-end design and post-production as a public-facing multimedia specialist.',
  },
  {
    id: 'techflix',
    period: 'September 2025 — Present',
    name: 'TechFlix Digital Marketing',
    role: 'Graphic Designer • Video Editor',
    description:
      'Designed and edited digital campaigns with a multimedia specialist perspective tailored to performance marketing.',
  },
  {
    id: 'maad',
    period: 'September 2025 — Present',
    name: 'Maad Al Raqia Marketing',
    role: 'Graphic Designer',
    description:
      'Produced premium visual identity and social media design aligned with multimedia storytelling standards.',
  },
  {
    id: 'adrixa',
    period: 'Founded June 2024 — Present',
    name: 'Adrixa For Media Service',
    role: 'Founder',
    description:
      'Founded and leads a full-service social media agency built around integrated multimedia strategy and production.',
  },
];

const roleSkills = [
  'Graphic Designer',
  'Video Editor',
  'Voice Over Artist',
  'Photographer',
  'Videographer',
  'Reels Maker',
  'Content Creator',
  'Short Film Director',
];

const iconClass = 'h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5';

const socialIcons = [
  { label: 'Behance', icon: <Layers className={iconClass} />, href: '#portfolio' },
  { label: 'Dribbble', icon: <Sparkles className={iconClass} />, href: '#portfolio' },
  { label: 'YouTube', icon: <PlayCircle className={iconClass} />, href: '#portfolio' },
  { label: 'Instagram', icon: <Camera className={iconClass} />, href: '#portfolio' },
];

const portfolioShowcases: Record<PortfolioTrack, string[]> = {
  'Graphic Design': [
    'Brand identity systems for social-first campaigns.',
    'Premium ad creatives for Egyptian, Saudi, and UAE audiences.',
    'High-conversion carousel and key visual development.',
  ],
  'Video Editing': [
    'Cinematic commercial edits with strong narrative pacing.',
    'Cross-platform video optimization for paid and organic channels.',
    'Professional color treatment and audio balancing.',
  ],
  Reels: [
    'Fast-hook reel concepts for entertainment and marketing.',
    'Trend-aware cuts with premium typography and motion rhythm.',
    'Vertical format storytelling for rapid audience growth.',
  ],
  'Long Form Videos': [
    'Story-led long-form production for brand documentaries and profile films.',
    'Interview, BTS, and explanatory edits with polished pacing.',
    'Audience-retention optimized structure and post-production flow.',
  ],
};

export const Portfolio: React.FC = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [activeTrack, setActiveTrack] = useState<PortfolioTrack>('Graphic Design');

  const companyInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const certInputRef = useRef<HTMLInputElement | null>(null);

  const achievements = useMemo(
    () => [
      'First Place Graduation Project Award — Short Film Production with Excellent Grade.',
      'Professional multimedia production track record across Egyptian, Saudi, and UAE markets.',
      'Working professionally since 2019 across freelance, agency, and founder environments.',
    ],
    [],
  );

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'companies', label: 'Companies' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  const InteractiveIcon: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <button type="button" className="interactive-icon-btn" aria-label={label} title={label}>
      {children}
    </button>
  );

  const onCompanyLogoUpload = (companyId: string, file?: File) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCompanies((prev) => prev.map((company) => (company.id === companyId ? { ...company, logo: preview } : company)));
  };

  const onCertificatesUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const uploaded = Array.from(files).map((file) => URL.createObjectURL(file));
    setCertificates((prev) => [...uploaded, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="glass-orb glass-orb-one" />
        <div className="glass-orb glass-orb-two" />
        <div className="glass-orb glass-orb-three" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.07),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(56,189,248,0.07),transparent_35%)]" />
      </div>

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/35 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Mohamed Ali</p>
            <h1 className="text-xl font-semibold">Multimedia Specialist Portfolio</h1>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="nav-pill">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {socialIcons.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 hover:border-cyan-300/35 transition-all duration-300"
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:py-16 space-y-12">
        <section id="about" className="premium-panel p-8 md:p-12 reveal">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-200/80">Cinematic Multimedia Identity</p>
              <h2 className="text-4xl md:text-6xl leading-tight font-semibold">
                Mohamed Ali — <span className="text-cyan-300">Multimedia Specialist</span> in Radio & Television Production
              </h2>
              <p className="text-zinc-300 text-lg max-w-3xl leading-relaxed">
                Creative multidisciplinary multimedia specialist with strong execution across graphic design, video production,
                advertising, and content creation. I build premium visual systems and story-driven media that help brands win
                attention and trust across Egypt, Saudi Arabia, and the UAE.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {roleSkills.map((skill) => (
                  <button key={skill} className="chip" type="button">
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="premium-panel p-6 space-y-4 reveal">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <InteractiveIcon label="Multimedia profile icon">
                  <BadgeCheck className="h-5 w-5 text-emerald-300" />
                </InteractiveIcon>
                Multimedia Profile Snapshot
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li><strong>Name:</strong> Mohamed Ali</li>
                <li><strong>Date of Birth:</strong> September 11, 1999</li>
                <li><strong>Birthplace:</strong> Minya, Egypt</li>
                <li><strong>Professional Since:</strong> 2019</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="premium-panel p-7 reveal">
            <h3 className="section-title"><InteractiveIcon label="Education icon"><GraduationCap className="h-5 w-5" /></InteractiveIcon> Education</h3>
            <p className="text-lg text-zinc-100 font-medium">Bachelor Degree in Media Studies — Radio & Television Department</p>
            <p className="text-zinc-400 mt-2">University of Minya • 2019 — 2022</p>
            <p className="text-zinc-300 mt-4">Core specialization highlighted to emphasize advanced multimedia production capability.</p>
          </div>

          <div className="premium-panel p-7 reveal">
            <h3 className="section-title"><InteractiveIcon label="Achievement icon"><WandSparkles className="h-5 w-5" /></InteractiveIcon> Graduation Achievement</h3>
            <p className="text-zinc-300 leading-relaxed">First Place Graduation Project Award — Short Film Production with Excellent Grade.</p>
            <div className="mt-4 grid gap-2 text-zinc-300">
              {achievements.map((item) => (
                <div key={item} className="flex items-start gap-2"><InteractiveIcon label="Highlight icon"><Sparkles className="h-4 w-4 mt-1 text-cyan-300" /></InteractiveIcon>{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="premium-panel p-7 reveal">
          <h3 className="section-title"><InteractiveIcon label="Experience icon"><Briefcase className="h-5 w-5" /></InteractiveIcon> Work Experience Timeline</h3>
          <div className="mt-6 space-y-4">
            <article className="timeline-card">
              <p className="timeline-period">2022 — 2023</p>
              <h4 className="timeline-title">Independent Graduation Projects Producer</h4>
              <p className="timeline-body">Full multimedia production ownership across script writing, directing, filming, editing, and production supervision. Songwriting/composition of 5 songs and directing 3 official music video clips.</p>
            </article>
            <article className="timeline-card">
              <p className="timeline-period">May 2023 — June 2024</p>
              <h4 className="timeline-title">Military Service — Media Production Soldier</h4>
              <p className="timeline-body">Handled photography, video production, and military media documentation with precision, speed, and structured multimedia discipline.</p>
            </article>
            <article className="timeline-card">
              <p className="timeline-period">Post Military Career</p>
              <h4 className="timeline-title">Freelance Multimedia Specialist</h4>
              <p className="timeline-body">Delivered integrated creative output across social visuals, edits, brand assets, and cinematic content production.</p>
            </article>
          </div>
        </section>

        <section id="companies" className="premium-panel p-7 reveal">
          <h3 className="section-title"><InteractiveIcon label="Company experience icon"><Globe className="h-5 w-5" /></InteractiveIcon> Company Experience (Editable Logos & Descriptions)</h3>
          <p className="text-zinc-300 mt-2">Each company card supports logo upload anytime, with editable descriptions tailored to multimedia specialist positioning.</p>
          <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {companies.map((company) => (
              <article key={company.id} className="company-card">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">{company.period}</p>
                <div className="mt-3 flex items-center gap-3">
                  {company.logo ? (
                    <img src={company.logo} alt={`${company.name} logo`} className="h-12 w-12 rounded-lg object-cover border border-white/20" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => companyInputRefs.current[company.id]?.click()}
                      className="h-12 w-12 rounded-lg bg-white/10 border border-dashed border-white/25 flex items-center justify-center hover:border-cyan-300/50 hover:bg-cyan-300/10 transition"
                      aria-label={`Upload ${company.name} logo`}
                      title={`Upload ${company.name} logo`}
                    >
                      <ImagePlus className="h-5 w-5 text-zinc-300" />
                    </button>
                  )}
                  <div>
                    <h4 className="font-semibold leading-tight">{company.name}</h4>
                    <p className="text-sm text-zinc-300">{company.role}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{company.description}</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    companyInputRefs.current[company.id] = el;
                  }}
                  onChange={(event) => onCompanyLogoUpload(company.id, event.target.files?.[0])}
                />
                <button
                  onClick={() => companyInputRefs.current[company.id]?.click()}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm hover:bg-cyan-400/20 transition"
                  type="button"
                >
                  <Upload className="h-4 w-4" /> Upload / Change Logo
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div id="certifications" className="premium-panel p-7 reveal">
            <h3 className="section-title"><InteractiveIcon label="Certifications icon"><BadgeCheck className="h-5 w-5" /></InteractiveIcon> Certifications</h3>
            <p className="text-zinc-300 mt-2">Upload certification images and preview them instantly in an interactive multimedia credentials gallery.</p>
            <input
              ref={certInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => onCertificatesUpload(event.target.files)}
            />
            <button
              onClick={() => certInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm hover:bg-emerald-400/20 transition"
              type="button"
            >
              <Upload className="h-4 w-4" /> Upload Certificates
            </button>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {certificates.length ? (
                certificates.map((src, idx) => (
                  <img key={`${src}-${idx}`} src={src} alt={`Certificate ${idx + 1}`} className="h-28 w-full object-cover rounded-lg border border-white/15 card-pop" />
                ))
              ) : (
                <p className="text-zinc-500 text-sm col-span-full">No certificates uploaded yet.</p>
              )}
            </div>
          </div>

          <div id="portfolio" className="premium-panel p-7 reveal">
            <h3 className="section-title"><InteractiveIcon label="Portfolio tracks icon"><Film className="h-5 w-5" /></InteractiveIcon> Portfolio Tracks</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(portfolioShowcases) as PortfolioTrack[]).map((track) => (
                <button
                  key={track}
                  onClick={() => setActiveTrack(track)}
                  className={`track-tab ${activeTrack === track ? 'track-tab-active' : ''}`}
                  type="button"
                >
                  {track}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {portfolioShowcases[activeTrack].map((item) => (
                <div key={item} className="portfolio-item">
                  {activeTrack === 'Graphic Design' ? <InteractiveIcon label="Graphic design icon"><Clapperboard className="h-4 w-4" /></InteractiveIcon> : null}
                  {activeTrack === 'Video Editing' ? <InteractiveIcon label="Video editing icon"><Video className="h-4 w-4" /></InteractiveIcon> : null}
                  {activeTrack === 'Reels' ? <InteractiveIcon label="Reels icon"><PlayCircle className="h-4 w-4" /></InteractiveIcon> : null}
                  {activeTrack === 'Long Form Videos' ? <InteractiveIcon label="Long form videos icon"><Mic2 className="h-4 w-4" /></InteractiveIcon> : null}
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-5 text-zinc-300 text-sm leading-relaxed">
              Every track is positioned to reflect one unified value proposition: a premium multimedia specialist who can move from concept to final delivery with cinematic consistency.
            </p>
          </div>
        </section>

        <footer className="py-8 text-center text-zinc-400 text-sm">
          Premium Personal CV & Portfolio — Mohamed Ali, Multimedia Specialist • Markets: Egypt • Saudi Arabia • UAE
        </footer>
      </main>
    </div>
  );
};
