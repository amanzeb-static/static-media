import { useState, useEffect, useRef } from 'react'
import './App.css'

/* =======================================================
   SCROLL ANIMATION HOOK
   ======================================================= */
function useScrollAnimation() {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const selectors = '.animate-on-scroll, .animate-from-left, .animate-from-right, .animate-scale-in'
    const elements = ref.current?.querySelectorAll(selectors)
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

/* =======================================================
   COUNTER HOOK
   ======================================================= */
function useCounter(target, duration = 1400) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)
  const hasRun = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true
          const match = target.match(/^(\d+)(.*)/)
          if (!match) { setDisplay(target); return }
          const num = parseInt(match[1])
          const suffix = match[2]
          const startTime = performance.now()
          const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(2, -10 * progress)
            setDisplay(Math.floor(eased * num) + suffix)
            if (progress < 1) requestAnimationFrame(animate)
            else setDisplay(target)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])
  return [display, ref]
}

/* =======================================================
   SCROLL PROGRESS BAR
   ======================================================= */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />
}

/* =======================================================
   FLOATING NAV PILL (like gakuyen)
   ======================================================= */
function FloatingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${scrolled ? 'top-3' : 'top-5'}`}>
      {/* Desktop pill */}
      <div className="hidden md:flex items-center gap-1 bg-[#111111]/90 backdrop-blur-xl border border-white/[0.06] rounded-full px-2 py-1.5 shadow-2xl shadow-black/50">
        {/* Logo */}
        <a href="#" className="font-serif text-lg px-4 py-1.5 rounded-full hover:bg-white/5 transition-colors">
          <span className="text-white">amanzeb</span>
        </a>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[13px] font-sans text-white/60 hover:text-white hover:bg-white/5 px-4 py-1.5 rounded-full transition-all duration-300"
          >
            {link.label}
          </a>
        ))}

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        <a
          href="#contact"
          className="text-[13px] font-sans text-primary font-medium bg-gold hover:bg-gold-light px-5 py-1.5 rounded-full transition-all duration-300"
        >
          Let's Talk
        </a>
      </div>

      {/* Mobile pill */}
      <div className="md:hidden flex items-center gap-3 bg-[#111111]/90 backdrop-blur-xl border border-white/[0.06] rounded-full px-4 py-2 shadow-2xl shadow-black/50">
        <a href="#" className="font-serif text-lg">
          <span className="text-white">amanzeb</span>
        </a>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-1"
          aria-label="Menu"
        >
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[2px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-[#111111]/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl py-3 px-2 shadow-2xl shadow-black/50">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-[14px] font-sans text-white/70 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-xl transition-all"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block text-[14px] font-sans text-primary font-medium bg-gold hover:bg-gold-light px-4 py-2.5 rounded-xl mt-1 text-center transition-all"
          >
            Let's Talk
          </a>
        </div>
      )}
    </nav>
  )
}

/* =======================================================
   FLOATING CONTACT BUTTON (like gakuyen)
   ======================================================= */
function FloatingContact() {
  return (
    <a
      href="#contact"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-[#111111]/90 backdrop-blur-xl border border-white/[0.06] rounded-full px-5 py-3 shadow-2xl shadow-black/50 hover:bg-gold hover:text-primary group transition-all duration-300"
    >
      <svg className="w-4 h-4 text-gold group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span className="text-[13px] font-sans text-white/80 group-hover:text-primary font-medium transition-colors">Contact</span>
    </a>
  )
}

function HeroStat({ value, label }) {
  const [display, ref] = useCounter(value)
  const match = display.match(/^(\d+)(.*)/)
  const num = match ? match[1] : display
  const suffix = match ? match[2] : ''
  return (
    <div ref={ref}>
      <p className="font-serif text-2xl text-white">
        {num}<span className="text-base">{suffix}</span>
      </p>
      <p className="text-[11px] font-sans text-white/40 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  )
}

/* =======================================================
   HERO — Bold, cinematic, split layout
   ======================================================= */
function Hero() {
  const words = ['Storytelling', 'Photography', 'Direction', 'Editorial']
  const [wordIndex, setWordIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % words.length)
        setFading(false)
      }, 350)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-[95vh] flex flex-col justify-center px-6 pt-24 pb-16">

      {/* ── Split layout ── */}
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">

        {/* Left: text */}
        <div>
          {/* Availability badge */}
          <div className="animate-on-scroll inline-flex items-center gap-2.5 bg-[#111111]/80 border border-white/[0.06] rounded-full px-4 py-2 mb-8 w-fit backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[13px] font-sans text-white/60">Available for Inquiries</span>
          </div>

          {/* Headline with cycling word */}
          <h1 className="animate-on-scroll font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1] tracking-tight mb-8">
            <span className="text-white/40">Cinematic</span>
            <br />
            <span className={`cycle-word ${fading ? 'fade-out' : 'fade-in'} text-white font-semibold`}>
              {words[wordIndex]}
            </span>
          </h1>

          {/* Brand tag */}
          <p className="animate-on-scroll delay-1 text-xs tracking-[0.25em] uppercase text-gold font-sans mb-6">
            VIDEOGRAPHY & PHOTOGRAPHY ✦ EDITORIAL ✦ ORGANIC MARKETING
          </p>

          {/* Intro text */}
          <div className="animate-on-scroll delay-2 space-y-4 mb-8 max-w-lg">
            <p className="text-[15px] md:text-base font-sans text-white/50 leading-relaxed">
              Hello, I'm <span className="text-white font-medium">Amanzeb</span>, a cinematic content creator
              based out of <span className="text-white font-medium">Northern Virginia</span>.
            </p>
            <p className="text-[15px] md:text-base font-sans text-white/50 leading-relaxed">
              I create editorial photography & cinematic video content
              for luxury brands, musicians, and visionaries who refuse to blend in.
            </p>
          </div>

          {/* Stats strip */}
          <div className="animate-on-scroll delay-2 flex items-center gap-8 mb-10">
            <HeroStat value="100+" label="Videos" />
            <div className="w-px h-8 bg-white/10" />
            <HeroStat value="10M+" label="Views" />
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="font-serif text-xl text-white">Est.</p>
              <p className="text-[11px] font-sans text-white/40 uppercase tracking-widest mt-0.5">2022</p>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-on-scroll delay-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-[#111111]/80 border border-white/[0.06] rounded-full pl-3 pr-6 py-2.5 hover:bg-gold group transition-all duration-300 backdrop-blur-sm"
            >
              <span className="w-9 h-9 rounded-full bg-gold group-hover:bg-primary flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-primary group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-[14px] font-sans text-white font-medium group-hover:text-primary transition-colors">
                Send me a message
              </span>
            </a>
          </div>
        </div>

        {/* Right: featured image */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative w-[340px] h-[440px]">
            {/* Glow behind image */}
            <div className="absolute inset-0 rounded-2xl bg-violet-700/20 blur-2xl scale-95 translate-y-4" />
            {/* Image */}
            <img
              src="/about-photo.jpg"
              alt="Amanzeb"
              className="relative w-full h-full object-cover rounded-2xl border border-white/[0.08] shadow-2xl"
            />
            {/* Gold corner accent */}
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/60 rounded-tr-sm" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/60 rounded-bl-sm" />
            {/* Floating label */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-sm border border-white/[0.06] rounded-full px-4 py-2 whitespace-nowrap">
              <span className="text-[12px] font-sans text-white/60">Amanzeb · Northern Virginia</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* =======================================================
   SOCIAL PROOF — "Trusted by" logos
   ======================================================= */
function SocialProof() {
  const sectionRef = useScrollAnimation()
  const brands = ['NAV', 'CHRIS GREY', 'FRIDAYY', 'VOGUE INDIA', 'YALLA APPAREL', 'JORDAN ADETUNJI', 'TV GUCCI', 'THE 97 COLLECTIVE', 'YUNG FAZO', 'TURKO', 'SAVV4X']

  return (
    <section ref={sectionRef} className="py-12 px-6 mb-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-on-scroll">
          <p className="text-center text-[13px] font-sans text-white/30 mb-8">
            Works Include
          </p>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...brands, ...brands].map((brand, i) => (
                <span
                  key={i}
                  className="text-lg md:text-xl font-serif text-white/20 hover:text-gold/60 transition-colors duration-500 cursor-default mx-8"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =======================================================
   YOUTUBE EMBED HELPER
   ======================================================= */
function getYouTubeEmbedUrl(url) {
  if (!url) return null
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/)
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
  return null
}

/* =======================================================
   PROJECT MODAL
   ======================================================= */
function ProjectModal({ project, onClose }) {
  const embedUrl = getYouTubeEmbedUrl(project.link)
  const isShort = project.link?.includes('/shorts/')

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${isShort ? 'max-w-sm' : 'max-w-3xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors font-sans text-sm flex items-center gap-2"
        >
          Close
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video */}
        <div className={`${isShort ? 'aspect-[9/16]' : 'aspect-video'} rounded-2xl overflow-hidden bg-black`}>
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={project.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Project info */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-white">{project.title}</h3>
            <p className="text-sm font-sans text-white/50 mt-0.5">
              {project.type}{project.year ? ` · ${project.year}` : ''}
            </p>
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-sans text-gold hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            Watch on YouTube
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

/* =======================================================
   SELECTED WORK — 2-column project grid
   ======================================================= */
function SelectedWork() {
  const sectionRef = useScrollAnimation()
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      title: 'Trell The Trainer x Thorne',
      type: 'Brand Film',
      year: '2026',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/trell-the-trainer.jpg',
      link: 'https://www.instagram.com/reel/DVjC3nWDk0E/',
    },
    {
      title: 'Capital Corner Group — Sami Intro Video',
      type: 'Commercial',
      year: '2025',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/capital-corner.jpg',
      link: 'https://www.instagram.com/reel/DS0f0otktHC/',
    },
    {
      title: 'NAV — OMW2REXDALE',
      type: 'BTS Photo / Video',
      year: '2025',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/nav-omw2rexdale.jpg',
      link: 'https://www.instagram.com/p/DHymTNkpapt/?img_index=1',
    },
    {
      title: 'Fridayy — Below Zero',
      type: 'Music Video Reels',
      year: '2025',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/fridayy-below-zero.jpg',
      link: 'https://www.instagram.com/reel/DOEYRhtjnlm/',
    },
    {
      title: 'Nige — Right One',
      type: 'Music Video Reels',
      year: '2025',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/nige.jpg',
      link: 'https://www.tiktok.com/@iheartnige/video/7552681520251686157',
    },
    {
      title: '"Was (I)t Worth It" Press Photos — Sofia Camara',
      type: 'Editorial Photography',
      year: '2025',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/sofia-camara.jpg',
      link: 'https://www.instagram.com/p/DHheVJXu5ht/',
    },
    {
      title: 'Make The Angels Cry — Chris Grey',
      type: 'Music Video Production / BTS',
      year: '2024',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: 'https://cdn.prod.website-files.com/66fd656818a085354c8eb2b0/6762474e6622a905ae54f072_DSC04964%20Large.jpeg',
      link: 'https://www.youtube.com/watch?v=m_X2dUkO2ZY',
    },
    {
      title: 'Fridayy — Back to You',
      type: 'Music Video Production / Cover Art / BTS',
      year: '2024',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/fridayy-back-to-you.jpg',
      link: 'https://www.instagram.com/p/DBjsUzMxYvs/?img_index=1',
    },
    {
      title: 'Fridayy — Without You',
      type: 'BTS / Photo / Video',
      year: '2024',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: 'https://cdn.prod.website-files.com/66fd656818a085354c8eb2b0/66fd84f31870ccec87eceb6b_DSC02729-Edit-compressed.jpeg',
      link: 'https://www.instagram.com/p/C4QzkSOODqN/?img_index=1',
    },
    {
      title: 'Raf Saperra × Vogue India',
      type: 'Editorial Photography',
      year: '2024',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: '/vogue-india.jpg',
      link: 'https://www.vogue.in/content/raf-saperra-will-make-you-groove-to-pure-punjabi-folk-no-matter-where-in-the-world-you-are',
    },
    {
      title: 'NAV × Grandeur',
      type: 'Music Video',
      year: '2023',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: 'https://cdn.prod.website-files.com/66fd656818a085354c8eb2b0/67661bff5e6099e24a14920c_nav-granduer.png',
      link: 'https://youtube.com/shorts/aJrb3bTnpK4?feature=share',
    },
    {
      title: 'Mirage — Yoko Gold',
      type: 'Music Video',
      year: '2023',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: 'https://cdn.prod.website-files.com/66fd656818a085354c8eb2b0/67661593da4e11fcd84feba3_mirage-concept-cover%20Large.jpeg',
      link: 'https://youtu.be/YVBOMKRxZrg',
    },
    {
      title: 'Valentines Day — Vera',
      type: 'Brand Film',
      year: '2023',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: 'https://cdn.prod.website-files.com/66fd656818a085354c8eb2b0/676621be9f50819565d0dfde_vera-cover.png',
      link: 'https://youtube.com/shorts/5E8RS27ay30?feature=share',
    },
    {
      title: 'Hair Transformation — Salon Daniel',
      type: 'Brand Campaign',
      year: '2023',
      gradient: 'from-black/20 via-black/40 to-black/80',
      image: 'https://cdn.prod.website-files.com/66fd656818a085354c8eb2b0/67662326a6a05d76a3bbb301_salon-daniel.png',
      link: 'https://youtube.com/shorts/iStnfJ3qBYk',
    },
  ]

  const handleCardClick = (project) => {
    const isYouTube = project.link?.includes('youtube') || project.link?.includes('youtu.be')
    if (isYouTube) {
      setSelectedProject(project)
    } else if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="work" ref={sectionRef} className="px-6 pb-24">
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="animate-on-scroll mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-gold font-sans mb-3">Portfolio</p>
          <h2 className="font-serif text-3xl md:text-4xl">
            Selected <span className="italic text-white/40">Works</span>
          </h2>
        </div>

        {/* 2-column grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(project)}
              className={`animate-on-scroll delay-${(i % 4) + 1} group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-[1.02]`}
            >
              {/* Background image */}
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-b ${project.gradient}`} />

              {/* Type badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[11px] font-sans font-medium text-white bg-[#111111]/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                  {project.type}
                </span>
              </div>

              {/* Year badge */}
              {project.year && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-[11px] font-sans font-medium text-white/50 bg-[#111111]/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                    {project.year}
                  </span>
                </div>
              )}

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex items-end justify-between">
                <h3 className="font-serif text-lg md:text-xl text-white group-hover:text-gold transition-colors duration-500">
                  {project.title}
                </h3>
                <span className="flex items-center gap-1.5 text-[12px] font-sans text-white/50 group-hover:text-gold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 whitespace-nowrap">
                  View Project
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =======================================================
   SERVICES — Split layout
   ======================================================= */
function Services() {
  const sectionRef = useScrollAnimation()

  const servicesList = [
    { icon: '🎬', title: 'Music Videos', desc: 'Cinematic music videos that amplify your visual identity' },
    { icon: '📸', title: 'Editorial Photography', desc: 'Magazine quality stills with a moody, high fashion aesthetic' },
    { icon: '📱', title: 'Social Content', desc: 'Vertical first reels engineered for organic growth' },
    { icon: '🎥', title: 'Brand Films', desc: 'Narrative driven stories for luxury brands' },
    { icon: '✨', title: 'Creative Direction', desc: 'End to end vision from concept to color grade' },
    { icon: '📈', title: 'Organic Marketing', desc: 'Content strategy that drives sustainable growth' },
  ]

  const tools = ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop', 'Lightroom', 'Cinema Cameras']

  return (
    <section id="services" ref={sectionRef} className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left side */}
          <div className="animate-from-left">
            <p className="text-xs tracking-[0.25em] uppercase text-gold font-sans mb-3">What I Do</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Services that shape<br />
              <span className="italic text-white/40">your story</span>
            </h2>
            <p className="text-[15px] font-sans text-white/40 leading-relaxed mb-10">
              End to end creative services centered around high-quality cinematic content for impactful video production.
            </p>

            {/* Creative toolbox */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-white/30 font-sans mb-4">Creative Toolbox</p>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[12px] font-sans text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-full px-3.5 py-1.5"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right side — services list */}
          <div className="space-y-1">
            {servicesList.map((service, i) => (
              <div
                key={i}
                className={`animate-from-right delay-${i + 1} group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-gold/15 hover:bg-white/[0.03] transition-all duration-400 cursor-default`}
              >
                <span className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] group-hover:border-gold/30 group-hover:bg-gold/5 flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300">
                  {service.icon}
                </span>
                <div>
                  <h3 className="font-sans text-[15px] text-white font-medium mb-1 group-hover:text-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="font-sans text-[13px] text-white/35 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutStat({ num, label }) {
  const [display, ref] = useCounter(num)
  const match = display.match(/^(\d+)(.*)/)
  const n = match ? match[1] : display
  const suffix = match ? match[2] : ''
  return (
    <div ref={ref} className="animate-scale-in text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-gold/20 transition-colors duration-300">
      <p className="font-serif text-xl text-white">{n}<span className="text-sm">{suffix}</span></p>
      <p className="text-[11px] text-white/30 font-sans tracking-wider uppercase mt-0.5">{label}</p>
    </div>
  )
}

/* =======================================================
   ABOUT / BIO
   ======================================================= */
function About() {
  const sectionRef = useScrollAnimation()

  return (
    <section id="about" ref={sectionRef} className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Photo placeholder */}
          <div className="animate-from-left">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.06]">
              <img
                src="/about-photo.jpg"
                alt="Amanzeb"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bio text */}
          <div className="animate-from-right delay-2 space-y-6">
            <p className="text-xs tracking-[0.25em] uppercase text-gold font-sans">About</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              How I got <span className="italic text-white/40">here</span>
            </h2>
            <div className="space-y-4">
              <p className="text-[15px] font-sans text-white/45 leading-relaxed">
                I've been making content since <span className="text-white/70 font-medium">2022</span>, starting as a BTS photographer before growing into full video production and creative direction.
              </p>
              <p className="text-[15px] font-sans text-white/45 leading-relaxed">
                From shooting editorial for <span className="text-gold/70 font-medium">Vogue India</span> to directing music videos and brand films, I've evolved into a <span className="text-white/70 font-medium">multi-hyphenate creative</span> who brings a cinematic, fashion forward eye to every project.
              </p>
              <p className="text-[15px] font-sans text-white/45 leading-relaxed">
                Photographer. Director. Creative. Every frame is crafted to feel intentional, editorial, and impossible to scroll past.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { num: '100+', label: 'Videos' },
                { num: '10M+', label: 'Views' },
                { num: '2022', label: 'Est.' },
              ].map((stat) => (
                <AboutStat key={stat.label} num={stat.num} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =======================================================
   CONTACT SECTION
   ======================================================= */
function Contact() {
  const sectionRef = useScrollAnimation()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="contact" ref={sectionRef} className="px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <div className="animate-on-scroll text-center mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-gold font-sans mb-3">Get In Touch</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Let's create something <span className="italic text-white/40">extraordinary</span>
          </h2>
          <p className="text-[15px] font-sans text-white/40">
            Ready to elevate your brand's visual presence? Send me a message.
          </p>
        </div>

        <div className="animate-scale-in delay-1">
          {submitted ? (
            <div className="rounded-2xl border border-gold/20 bg-white/[0.02] p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <span className="text-gold text-xl">✓</span>
              </div>
              <h3 className="font-serif text-xl mb-2">Message Sent</h3>
              <p className="text-[13px] font-sans text-white/40">I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-white/25 font-sans mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white font-sans text-[14px] focus:border-gold/40 focus:outline-none focus:bg-white/[0.05] transition-all placeholder:text-white/15"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-white/25 font-sans mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white font-sans text-[14px] focus:border-gold/40 focus:outline-none focus:bg-white/[0.05] transition-all placeholder:text-white/15"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.2em] uppercase text-white/25 font-sans mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white font-sans text-[14px] focus:border-gold/40 focus:outline-none focus:bg-white/[0.05] transition-all resize-none placeholder:text-white/15"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-light text-primary font-sans font-semibold text-[14px] py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* =======================================================
   FOOTER — Clean minimal
   ======================================================= */
function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
          {/* Logo */}
          <a href="#" className="font-serif text-2xl">
            <span className="text-white">amanzeb</span>
          </a>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {['Work', 'Services', 'About', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[13px] font-sans text-white/30 hover:text-gold transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            {[
              { label: 'IG', handle: '@amanzeb' },
              { label: 'YT', handle: 'YouTube' },
              { label: 'TT', handle: 'TikTok' },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[11px] font-sans text-white/30 hover:text-gold hover:border-gold/30 transition-all"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] font-sans text-white/15">
          <p>© 2026 Amanzeb. All rights reserved.</p>
          <p className="italic font-serif text-white/10">Your dreams are just dreams until you start.</p>
          <p>clickme@startstatic.info</p>
        </div>
      </div>
    </footer>
  )
}

/* =======================================================
   MAIN APP — gakuyen-style structure
   ======================================================= */
function App() {
  const appRef = useScrollAnimation()

  return (
    <div ref={appRef} className="relative">
      <ScrollProgress />
      {/* Global animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="blob-1 absolute -top-64 -left-64 w-[800px] h-[800px] rounded-full bg-violet-600/20 blur-[160px]" />
        <div className="blob-2 animation-delay-2 absolute -top-32 right-0 w-[650px] h-[650px] rounded-full bg-amber-500/10 blur-[150px]" />
        <div className="blob-3 animation-delay-4 absolute top-[45%] -left-32 w-[650px] h-[550px] rounded-full bg-cyan-600/12 blur-[160px]" />
        <div className="blob-4 animation-delay-6 absolute top-[35%] right-0 w-[550px] h-[550px] rounded-full bg-fuchsia-700/12 blur-[150px]" />
        <div className="blob-5 animation-delay-2 absolute bottom-0 left-1/3 w-[650px] h-[650px] rounded-full bg-violet-700/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <FloatingNav />
      <Hero />
      <SocialProof />
      <SelectedWork />
      <Services />
      <About />
      <Contact />
      <Footer />
      <FloatingContact />
    </div>
  )
}

export default App
