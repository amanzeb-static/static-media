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
    const elements = ref.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
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
          <span className="text-white">A</span>
          <span className="text-gold italic">manzeb</span>
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
          <span className="text-white">A</span>
          <span className="text-gold italic">manzeb</span>
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

/* =======================================================
   HERO — Bold, centered, front and center
   ======================================================= */
function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-6 pt-24 pb-16 max-w-3xl mx-auto">
      {/* Availability badge */}
      <div className="animate-on-scroll inline-flex items-center gap-2.5 bg-[#111111] border border-white/[0.06] rounded-full px-4 py-2 mb-8 w-fit">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-[13px] font-sans text-white/60">Available for Inquiries</span>
      </div>

      {/* Headline */}
      <h1 className="animate-on-scroll font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1] tracking-tight mb-8">
        <span className="text-white/40">Cinematic</span>
        <br />
        <span className="text-white font-semibold">storytelling</span>
      </h1>

      {/* Brand tag */}
      <p className="animate-on-scroll delay-1 text-xs tracking-[0.25em] uppercase text-gold font-sans mb-6">
        VIDEOGRAPHY & PHOTOGRAPHY ✦ EDITORIAL ✦ ORGANIC MARKETING
      </p>

      {/* Intro text */}
      <div className="animate-on-scroll delay-2 space-y-4 mb-10 max-w-lg">
        <p className="text-[15px] md:text-base font-sans text-white/50 leading-relaxed">
          hello, I'm <span className="text-white font-medium">Amanzeb</span> — a cinematic content creator
          based out of <span className="text-white font-medium">Virginia / Toronto</span>.
        </p>
        <p className="text-[15px] md:text-base font-sans text-white/50 leading-relaxed">
          I create editorial photography & cinematic video content
          for luxury brands, musicians, and visionaries who refuse to blend in.
        </p>
      </div>

      {/* CTA */}
      <div className="animate-on-scroll delay-3">
        <a
          href="#contact"
          className="inline-flex items-center gap-3 bg-[#111111] border border-white/[0.06] rounded-full pl-3 pr-6 py-2.5 hover:bg-gold group transition-all duration-300"
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
    </section>
  )
}

/* =======================================================
   SOCIAL PROOF — "Trusted by" logos
   ======================================================= */
function SocialProof() {
  const sectionRef = useScrollAnimation()
  const brands = ['NAV', 'CHRIS GREY', 'FRIDAYY', 'LIL TECCA', 'VOGUE INDIA', 'GRANDEUR', 'YOKO GOLD']

  return (
    <section ref={sectionRef} className="py-12 px-6 mb-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-on-scroll">
          <p className="text-center text-[13px] font-sans text-white/30 mb-8">
            Trusted by <span className="text-white/50 font-medium">many</span>
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {brands.map((brand, i) => (
              <span
                key={i}
                className="text-lg md:text-xl font-serif text-white/20 hover:text-gold/60 transition-colors duration-500 cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =======================================================
   SELECTED WORK — 2-column project grid
   ======================================================= */
function SelectedWork() {
  const sectionRef = useScrollAnimation()

  const projects = [
    {
      title: 'NAV × Grandeur',
      type: 'Music Video',
      gradient: 'from-purple-900/60 via-purple-950/40 to-[#0A0A0A]',
    },
    {
      title: 'Mirage — Yoko Gold',
      type: 'Music Video',
      gradient: 'from-blue-900/60 via-blue-950/40 to-[#0A0A0A]',
    },
    {
      title: 'Valentines Day — Vera',
      type: 'Brand Film',
      gradient: 'from-rose-900/50 via-rose-950/30 to-[#0A0A0A]',
    },
    {
      title: 'Salon Daniel',
      type: 'Brand Campaign',
      gradient: 'from-amber-900/50 via-amber-950/30 to-[#0A0A0A]',
    },
    {
      title: 'Fridayy — Behind the Scenes',
      type: 'Photo / Video',
      gradient: 'from-emerald-900/50 via-emerald-950/30 to-[#0A0A0A]',
    },
    {
      title: 'Chris Grey Sessions',
      type: 'Photography',
      gradient: 'from-indigo-900/50 via-indigo-950/30 to-[#0A0A0A]',
    },
  ]

  return (
    <section id="work" ref={sectionRef} className="px-6 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="animate-on-scroll mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-gold font-sans mb-3">Portfolio</p>
          <h2 className="font-serif text-3xl md:text-4xl">
            Selected <span className="italic text-white/40">works</span>
          </h2>
        </div>

        {/* 2-column grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <div
              key={i}
              className={`animate-on-scroll delay-${(i % 4) + 1} group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-[1.02]`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${project.gradient}`} />

              {/* Type badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[11px] font-sans font-medium text-white bg-[#111111]/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                  {project.type}
                </span>
              </div>

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
    { icon: '📸', title: 'Editorial Photography', desc: 'Magazine-quality stills with a moody, high-fashion aesthetic' },
    { icon: '📱', title: 'Social Content', desc: 'Vertical-first reels engineered for organic growth' },
    { icon: '🎥', title: 'Brand Films', desc: 'Narrative-driven stories for luxury brands' },
    { icon: '✨', title: 'Creative Direction', desc: 'End-to-end vision from concept to color grade' },
    { icon: '📈', title: 'Organic Marketing', desc: 'Content strategy that drives sustainable growth' },
  ]

  const tools = ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop', 'Lightroom', 'Cinema Cameras']

  return (
    <section id="services" ref={sectionRef} className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left side */}
          <div className="animate-on-scroll">
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
                className={`animate-on-scroll delay-${(i % 5) + 1} group flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all duration-300 cursor-default`}
              >
                <span className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">
                  {service.icon}
                </span>
                <div>
                  <h3 className="font-sans text-[15px] text-white font-medium mb-1 group-hover:text-gold transition-colors">
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
          <div className="animate-on-scroll">
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-b from-secondary via-secondary/60 to-[#0A0A0A] border border-white/[0.04] overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <span className="font-serif text-2xl text-gold">A</span>
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase text-white/20 font-sans">Amanzeb</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="animate-on-scroll delay-2 space-y-6">
            <p className="text-xs tracking-[0.25em] uppercase text-gold font-sans">About</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">
              How I got <span className="italic text-white/40">here</span>
            </h2>
            <div className="space-y-4">
              <p className="text-[15px] font-sans text-white/45 leading-relaxed">
                I've been making content for brands since <span className="text-white/70 font-medium">2022</span>.
                It started with a passion for video production — through a love for our craft,
                we've been lucky enough to work with some amazing brands and artists.
              </p>
              <p className="text-[15px] font-sans text-white/45 leading-relaxed">
                With a background in <span className="text-white/70 font-medium">editorial photography</span> —
                shooting for <span className="text-gold/70 font-medium">Vogue India</span> and behind the scenes
                with <span className="text-white/70 font-medium">Lil Tecca</span> — I bring a cinematic,
                fashion-forward eye to every project.
              </p>
              <p className="text-[15px] font-sans text-white/45 leading-relaxed">
                My aesthetic blends the moody, cinematic style of Toronto music videos
                with the editorial precision of luxury fashion houses. Every frame is crafted
                to feel like it belongs in a magazine.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { num: '50+', label: 'Brands' },
                { num: '2M+', label: 'Views' },
                { num: '2022', label: 'Est.' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="font-serif text-xl text-white">{stat.num}</p>
                  <p className="text-[11px] text-white/30 font-sans tracking-wider uppercase mt-0.5">{stat.label}</p>
                </div>
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

        <div className="animate-on-scroll delay-1">
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
            <span className="text-white">Aman</span>
            <span className="text-gold italic">zeb</span>
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
