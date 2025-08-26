"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import localFont from "next/font/local"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createClient } from '@supabase/supabase-js'

// Load rdrf.ttf from app/fonts/rdrf.ttf
const rdrf = localFont({
  src: "./fonts/rdrf.ttf",
  display: "swap",
})

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RecruitmentPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAudioPrompt, setShowAudioPrompt] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    daysChanged: false,
    hoursChanged: false,
    minutesChanged: false,
    secondsChanged: false
  })
  
  const [formData, setFormData] = useState({
    name: "",
    registration_number: "",
    srm_email: "",
    personal_email: "",
    contact_number: "",
    year: "",
    department: "",
    section: "",
    faculty_advisor_name: "",
    faculty_advisor_contact: "",
    interested_domain: "",
  })

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isMobileDevice || isSmallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Enhanced timer countdown with mobile optimization
  useEffect(() => {
    const targetDate = new Date('2025-09-04T23:59:59')
    
    const updateTimer = () => {
      try {
        const now = new Date().getTime()
        const distance = targetDate.getTime() - now
        
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)
          
          setTimeLeft(prev => ({
            days,
            hours,
            minutes,
            seconds,
            // Trigger flip animation when values change
            daysChanged: prev.days !== days && prev.days !== 0, // Don't animate on initial load
            hoursChanged: prev.hours !== hours && prev.days !== 0,
            minutesChanged: prev.minutes !== minutes && prev.days !== 0,
            secondsChanged: prev.seconds !== seconds && prev.days !== 0,
          }))
        } else {
          setTimeLeft({ 
            days: 0, 
            hours: 0, 
            minutes: 0, 
            seconds: 0,
            daysChanged: false,
            hoursChanged: false,
            minutesChanged: false,
            secondsChanged: false
          })
        }
      } catch (error) {
        console.error('Timer update error:', error)
      }
    }

    // Initial update
    updateTimer()
    
    // Set up interval with error handling
    timerRef.current = setInterval(updateTimer, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Animation sequence for RECRUITMENTS and 2025
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    
    // Phase 1: RECRUITMENTS and 2025
    timeouts.push(setTimeout(() => setAnimationPhase(1), 500))
    // Phase 2: Timer and button
    timeouts.push(setTimeout(() => setAnimationPhase(2), 2500))
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout))
  }, [])

  // Auto-enable audio for all devices
  useEffect(() => {
    try {
      const audio = new Audio('/sound1.mp3')
      audioRef.current = audio
      audio.loop = true
      audio.volume = 0.3
      audio.preload = 'auto'
      
      const enableAudio = () => {
        audio.muted = false
        audio.play().catch(error => {
          console.log('Audio playback failed:', error)
        })
        // Remove listeners after first interaction
        window.removeEventListener('click', enableAudio)
        window.removeEventListener('touchstart', enableAudio)
        window.removeEventListener('scroll', enableAudio)
      }

      // Try to play immediately
      audio.play().catch(() => {
        // If auto-play fails, enable on first user interaction
        window.addEventListener('click', enableAudio, { passive: true })
        window.addEventListener('touchstart', enableAudio, { passive: true })
        window.addEventListener('scroll', enableAudio, { passive: true })
      })

      return () => {
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
        window.removeEventListener('click', enableAudio)
        window.removeEventListener('touchstart', enableAudio)
        window.removeEventListener('scroll', enableAudio)
      }
    } catch (error) {
      console.error('Audio setup error:', error)
    }
  }, [])

  // Smooth scroll with mobile optimization
  useEffect(() => {
    // Use CSS scroll-behavior for better performance on mobile
    document.documentElement.style.scrollBehavior = 'smooth'
    
    const handleScroll = () => {
      // Throttle scroll events for better performance
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50)
      })
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowError(false)

    try {
      const { data, error } = await supabase
        .from('reg25')
        .insert([
          {
            name: formData.name,
            registration_number: formData.registration_number,
            srm_email: formData.srm_email,
            personal_email: formData.personal_email,
            contact_number: formData.contact_number,
            year: formData.year,
            department: formData.department,
            section: formData.section,
            faculty_advisor_name: formData.faculty_advisor_name,
            faculty_advisor_contact: formData.faculty_advisor_contact,
            interested_domain: formData.interested_domain,
          }
        ])

      if (error) {
        console.error('Error inserting data:', error)
        setShowError(true)
      } else {
        setShowConfirmation(true)
        setFormData({
          name: "",
          registration_number: "",
          srm_email: "",
          personal_email: "",
          contact_number: "",
          year: "",
          department: "",
          section: "",
          faculty_advisor_name: "",
          faculty_advisor_contact: "",
          interested_domain: "",
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      const element = document.getElementById("apply-section")
      if (element) {
        element.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        })
      }
    }, 100)
  }

  const resetForm = () => {
    setShowConfirmation(false)
    setShowError(false)
    setShowForm(false)
  }

  const handleAudioEnable = () => {
    setShowAudioPrompt(false)
    try {
      if (audioRef.current) {
        audioRef.current.muted = false
        audioRef.current.play().catch(error => console.error('Manual audio playback failed:', error))
      } else {
        const audio = new Audio('/sound1.mp3')
        audioRef.current = audio
        audio.loop = true
        audio.volume = 0.3
        audio.play().catch(error => console.error('Manual audio playback failed:', error))
      }
    } catch (error) {
      console.error('Audio enable error:', error)
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes letterDrop {
          from {
            transform: translateY(-100px) rotateX(90deg);
            opacity: 0;
          }
          to {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
        }

        @keyframes flipCard {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-background {
          background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/red-dead-redemption-7680x4320.jpg');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          min-height: 100vh;
          min-height: 100svh;
          background-attachment: fixed;
        }

        /* Mobile-specific background fixes */
        @media screen and (max-width: 768px) {
          .hero-background {
            background-attachment: scroll !important;
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            min-height: -webkit-fill-available;
          }
        }

        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .hero-background {
            background-attachment: scroll !important;
            background-size: cover;
            background-position: center;
            min-height: -webkit-fill-available;
          }
        }

        /* High DPI displays */
        @media screen and (-webkit-min-device-pixel-ratio: 2) {
          .hero-background {
            background-attachment: scroll;
            background-size: cover;
            background-position: center;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }

        .letter-animate {
          animation: letterDrop 0.8s ease-out forwards;
          opacity: 0;
        }

        .flip-timer {
          perspective: 1000px;
        }

        .flip-card {
          position: relative;
          width: 90px;
          height: 90px;
          margin: 0 10px;
          transform-style: preserve-3d;
          background: linear-gradient(145deg, #8B4513, #A0522D);
          border: 4px solid #DAA520;
          border-radius: 12px;
          box-shadow: 
            0 6px 12px rgba(0,0,0,0.4),
            inset 0 3px 6px rgba(255,255,255,0.3);
        }

        /* Mobile responsive timer */
        @media screen and (max-width: 640px) {
          .flip-card {
            width: 70px;
            height: 70px;
            margin: 0 5px;
            border: 3px solid #DAA520;
          }
          
          .flip-timer {
            padding: 1rem;
          }
        }

        @media screen and (max-width: 480px) {
          .flip-card {
            width: 60px;
            height: 60px;
            margin: 0 3px;
            border: 2px solid #DAA520;
          }
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
        }

        .flip-card.animate .flip-card-inner {
          animation: flipCard 0.6s ease-in-out;
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: #FFD700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          background: linear-gradient(145deg, #8B4513, #A0522D);
          border-radius: 8px;
        }

        /* Mobile responsive text sizes */
        @media screen and (max-width: 640px) {
          .flip-card-front, .flip-card-back {
            font-size: 2rem;
          }
        }

        @media screen and (max-width: 480px) {
          .flip-card-front, .flip-card-back {
            font-size: 1.5rem;
          }
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }

        .timer-label {
          color: #DAA520;
          font-size: 1rem;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          margin-top: 10px;
        }

        @media screen and (max-width: 640px) {
          .timer-label {
            font-size: 0.875rem;
            margin-top: 8px;
          }
        }

        .text-shadow-western {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .western-border {
          border: 3px solid #eab308;
          border-radius: 12px;
          position: relative;
          transition: all 0.3s ease;
        }

        .western-border:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(234, 179, 8, 0.3);
        }

        /* Disable hover effects on touch devices */
        @media (hover: none) {
          .western-border:hover {
            transform: none;
            box-shadow: none;
          }
        }

        .western-border::before {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          background: linear-gradient(45deg, #eab308, transparent, #eab308);
          border-radius: 16px;
          z-index: -1;
          opacity: 0.4;
        }

        /* Improved touch targets for mobile */
        @media screen and (max-width: 768px) {
          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }
          
          button, .clickable {
            min-height: 44px;
          }
        }

        /* Prevent zoom on iOS inputs */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          select, textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"] {
            font-size: 16px;
          }
        }

        /* Smooth scrolling enhancement for mobile */
        html {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Better text rendering on mobile */
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
      `}</style>

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? "bg-stone-900/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-2 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            <a href="#home" className="text-lg sm:text-2xl md:text-3xl font-bold text-primary font-space-grotesk">ACM SIGKDD</a>
            
            {/* Navigation visible on all screen sizes */}
            <div className="flex space-x-3 sm:space-x-6 items-center">
              <a href="#home" className="text-white hover:text-primary transition-colors font-dm-sans text-sm sm:text-base">Home</a>
              <a href="#domains" className="text-white hover:text-primary transition-colors font-dm-sans text-sm sm:text-base">Domains</a>
              <a href="#apply-section" onClick={scrollToForm} className="text-white hover:text-primary transition-colors font-dm-sans cursor-pointer text-sm sm:text-base">Apply</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          id="home"
          className="hero-background relative flex items-center justify-center"
        >
          <div className="text-center text-white py-20 px-4">
            
            {/* RECRUITMENTS and 2025 animation */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="flex justify-center text-3xl sm:text-5xl md:text-7xl font-bold text-primary font-space-grotesk text-shadow-western flex-wrap">
                {"RECRUITMENTS 2025".split("").map((char, i) => (
                  <span 
                    key={i} 
                    className={`letter-animate ${animationPhase >= 1 ? 'letter-glow' : ''}`}
                    style={{ 
                      animationDelay: `${i * 0.08}s`,
                      opacity: animationPhase >= 1 ? 1 : 0
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            </div>

            {/* Enhanced Flip Timer */}
            <div className={`flex justify-center items-center mb-8 sm:mb-12 transition-all duration-1000 ${
              animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <div className="flip-timer flex items-center space-x-4 sm:space-x-8 p-4 sm:p-8 bg-gradient-to-br from-amber-900/40 to-yellow-900/40 backdrop-blur-md rounded-2xl border-3 border-yellow-500/40 shadow-xl">
                {[
                  { value: timeLeft.days, label: 'DAYS', changed: timeLeft.daysChanged },
                  { value: timeLeft.hours, label: 'HRS', changed: timeLeft.hoursChanged },
                  { value: timeLeft.minutes, label: 'MIN', changed: timeLeft.minutesChanged },
                  { value: timeLeft.seconds, label: 'SEC', changed: timeLeft.secondsChanged },
                ].map(({ value, label, changed }, index) => (
                  <div key={label} className="text-center">
                    <div className={`flip-card ${changed ? 'animate' : ''}`}>
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          {String(value).padStart(2, '0')}
                        </div>
                        <div className="flip-card-back">
                          {String(value).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                    <div className="timer-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className={`text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 font-dm-sans text-shadow-western transition-all duration-1000 px-4 ${
              animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              Saddle Up for Innovation
            </p>

            <div className={`transition-all duration-800 ${
              animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <Button
                onClick={scrollToForm}
                className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 animate-glow hover:scale-110 transition-transform font-space-grotesk rounded-lg touch-target"
                size="lg"
              >
                Join the Posse
              </Button>
            </div>
          </div>
        </section>

        {/* Domains Section */}
        <section id="domains" className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-20 font-space-grotesk text-primary">Choose Your Trail</h2>

            <div className="grid sm:grid-cols-2 gap-8 sm:gap-16">
              {[
                {
                  title: "Web App Development",
                  img: "/cowboy-at-saloon-table-with-cards-representing-web.png",
                  desc: "Craft robust, cutting-edge web applications that make a real impact.",
                  badge: "Frontend & Backend"
                },
                {
                  title: "Research & Development",
                  img: "/explorer-cowboy-with-map-representing-research-and.png",
                  desc: "Venture into new frontiers of AI, ML, and data science innovation.",
                  badge: "AI & ML"
                },
                {
                  title: "Corporate",
                  img: "/sheriff-badge-representing-corporate-leadership-an.png",
                  desc: "Lead strategic partnerships and drive organizational growth.",
                  badge: "Leadership"
                },
                {
                  title: "Creatives",
                  img: "/artist-with-brush-representing-creativity-and-desi.png",
                  desc: "Shape compelling narratives through design and media.",
                  badge: "Design & Media"
                },
              ].map((domain, index) => (
                <Card key={index} className="western-border hover:shadow-2xl transition-all duration-300 animate-slide-in-left bg-card/95 backdrop-blur-md">
                  <CardHeader>
                    <div className="w-full h-48 sm:h-56 mb-6 rounded-xl overflow-hidden">
                      <img
                        src={domain.img}
                        alt={domain.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-space-grotesk text-primary">{domain.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base sm:text-lg font-dm-sans">{domain.desc}</CardDescription>
                    <Badge className="mt-4 sm:mt-6 text-sm" variant="secondary">{domain.badge}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Apply Section */}
        {showForm && (
          <section id="apply-section" className="py-16 sm:py-24 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <Card className="western-border bg-card/95 backdrop-blur-md animate-fade-in-up">
                {showConfirmation ? (
                  <CardHeader className="text-center py-8 sm:py-12">
                    <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk text-primary mb-4 sm:mb-6">
                      🎉 Application Received!
                    </CardTitle>
                    <CardDescription className="text-lg sm:text-xl font-dm-sans mb-6 sm:mb-8">
                      Your application is in. We'll be in touch soon, partner!
                    </CardDescription>
                  </CardHeader>
                ) : showError ? (
                  <CardHeader className="text-center py-8 sm:py-12">
                    <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk text-red-600 mb-4 sm:mb-6">
                      ⚠️ Something Went Wrong
                    </CardTitle>
                    <CardDescription className="text-lg sm:text-xl font-dm-sans mb-6 sm:mb-8">
                      There was an error submitting your application. Please try again.
                    </CardDescription>
                    <Button
                      onClick={() => setShowError(false)}
                      className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 font-space-grotesk rounded-lg touch-target"
                    >
                      Try Again
                    </Button>
                  </CardHeader>
                ) : (
                  <>
                    <CardHeader className="text-center py-8 sm:py-12">
                      <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-space-grotesk text-primary mb-4 sm:mb-6">
                        Join the ACM SIGKDD Posse
                      </CardTitle>
                      <CardDescription className="text-lg sm:text-xl font-dm-sans">
                        Ready to ride with us? Fill out the form below to apply.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                        {[
                          { id: "name", label: "Full Name", type: "text" },
                          { id: "registration_number", label: "Registration Number", type: "text" },
                          { id: "srm_email", label: "SRM Email ID", type: "email" },
                          { id: "personal_email", label: "Personal Email ID", type: "email" },
                          { id: "contact_number", label: "Contact Number", type: "tel" },
                          { id: "section", label: "Section", type: "text" },
                          { id: "faculty_advisor_name", label: "Faculty Advisor Name", type: "text" },
                          { id: "faculty_advisor_contact", label: "Faculty Advisor Contact", type: "tel" },
                        ].map(field => (
                          <div key={field.id}>
                            <Label htmlFor={field.id} className="font-dm-sans text-base sm:text-lg">{field.label}</Label>
                            <Input
                              id={field.id}
                              type={field.type}
                              value={formData[field.id as keyof typeof formData]}
                              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                              required
                              disabled={isSubmitting}
                              className="mt-2 rounded-lg border-yellow-500/30 focus:border-yellow-500 text-base touch-target"
                            />
                          </div>
                        ))}
                        <div>
                          <Label htmlFor="year" className="font-dm-sans text-base sm:text-lg">Year</Label>
                          <Select 
                            onValueChange={(value) => setFormData({ ...formData, year: value })}
                            value={formData.year}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="mt-2 rounded-lg border-yellow-500/30 text-base touch-target">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="I">I</SelectItem>
                              <SelectItem value="II">II</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department" className="font-dm-sans text-base sm:text-lg">Department</Label>
                          <Select 
                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                            value={formData.department}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="mt-2 rounded-lg border-yellow-500/30 text-base touch-target">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DSBS">DSBS</SelectItem>
                              <SelectItem value="NWC">NWC</SelectItem>
                              <SelectItem value="CINTEL">CINTEL</SelectItem>
                              <SelectItem value="CTech">CTech</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="interested_domain" className="font-dm-sans text-base sm:text-lg">Interested Domain</Label>
                          <Select 
                            onValueChange={(value) => setFormData({ ...formData, interested_domain: value })}
                            value={formData.interested_domain}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="mt-2 rounded-lg border-yellow-500/30 text-base touch-target">
                              <SelectValue placeholder="Choose your path" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Corporate">Corporate</SelectItem>
                              <SelectItem value="Research and Development">Research and Development</SelectItem>
                              <SelectItem value="Web/App Dev">Web/App Dev</SelectItem>
                              <SelectItem value="Creatives">Creatives</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full text-base sm:text-lg py-4 sm:py-6 font-space-grotesk animate-glow rounded-lg hover:scale-105 transition-transform touch-target"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      </form>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-stone-900 text-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 text-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 font-space-grotesk text-primary">ACM SIGKDD</h3>
                <p className="font-dm-sans text-stone-300">Pioneering the future of knowledge and data</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-4 font-space-grotesk text-primary">Contact Us</h4>
                <p className="font-dm-sans text-stone-300">Saakshi: 9735844700</p>
                <p className="font-dm-sans text-stone-300">Aditya: 9140804752</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-4 font-space-grotesk text-primary">Follow Us</h4>
                <div className="flex justify-center space-x-6">
                  <a href="https://www.linkedin.com/company/srmsigkdd/" className="hover:text-primary transition-colors font-dm-sans touch-target">LinkedIn</a>
                  <a href="https://www.instagram.com/srm_acm_sigkdd?igsh=dmtiOWQ4M216dHcwhttps://www.instagram.com/srm_acm_sigkdd?igsh=dmtiOWQ4M216dHcw" className="hover:text-primary transition-colors font-dm-sans touch-target">Instagram</a>
                </div>
              </div>
            </div>
            <div className="border-t border-stone-700 pt-6 sm:pt-8 mt-8 sm:mt-12">
              <p className="font-dm-sans text-stone-400 text-center text-sm sm:text-base">© 2025 ACM SIGKDD. All rights reserved. Ride responsibly.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}