
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import localFont from "next/font/local"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createClient } from '@supabase/supabase-js'
import { motion } from "framer-motion"

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

// Animation variants
const letterVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  }),
}

const particleVariant = {
  initial: { opacity: 1, scale: 1, x: 0, y: 0 },
  animate: (i: number) => ({
    opacity: 0,
    scale: 0.5,
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    transition: { duration: 1, delay: i * 0.05, ease: "easeOut" }
  }),
}

export default function RecruitmentPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAudioPrompt, setShowAudioPrompt] = useState(false)
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

  // Audio handling
  useEffect(() => {
    const audio = new Audio('/western-theme.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.muted = true // Start muted to allow auto-play
    const playAttempt = audio.play().catch(error => {
      console.error('Initial audio playback failed:', error)
      setShowAudioPrompt(true) // Show prompt if auto-play fails
    })

    const handleInteraction = () => {
      if (audio.muted) {
        audio.muted = false
        audio.play().catch(error => {
          console.error('Audio playback failed after interaction:', error)
          setShowAudioPrompt(true) // Show prompt if unmute fails
        })
      }
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('mousemove', handleInteraction)
    }

    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    window.addEventListener('scroll', handleInteraction)
    window.addEventListener('mousemove', handleInteraction)

    return () => {
      audio.pause()
      audio.currentTime = 0
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('mousemove', handleInteraction)
    }
  }, [])

  // Smooth scroll
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
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
      document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const resetForm = () => {
    setShowConfirmation(false)
    setShowError(false)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-stone-900/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold text-primary font-space-grotesk">ACM SIGKDD</a>
          <div className="space-x-4">
            <a href="#home" className="text-white hover:text-primary transition-colors">Home</a>
            <a href="#domains" className="text-white hover:text-primary transition-colors">Domains</a>
            <a href="#apply-section" onClick={scrollToForm} className="text-white hover:text-primary transition-colors">Apply</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[100svh] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/red-dead-redemption-7680x4320.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          WebkitBackgroundSize: "cover",
          MozBackgroundSize: "cover",
          OBackgroundSize: "cover",
        }}
      >
        <div className="text-center text-white">
          {showAudioPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-4 right-4 z-50"
            >
              <Button
                onClick={() => {
                  setShowAudioPrompt(false)
                  const audio = new Audio('/sound1.mp3')
                  audio.loop = true
                  audio.volume = 0.3
                  audio.play().catch(error => console.error('Manual audio playback failed:', error))
                }}
                className="text-sm px-4 py-2 bg-primary/80 hover:bg-primary animate-glow"
              >
                Enable Audio
              </Button>
            </motion.div>
          )}
          {/* RECRUITMENTS animation */}
          <motion.div
            className="flex justify-center mb-2 text-4xl md:text-6xl font-bold text-primary font-space-grotesk text-shadow-western"
            initial="hidden"
            animate="visible"
          >
            {"RECRUITMENTS".split("").map((char, i) => (
              <motion.span key={i} variants={letterVariant} custom={i}>
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* 2024 animation with particle disintegration */}
          <motion.div
            className="flex justify-center mb-6 text-4xl md:text-6xl font-bold text-primary font-space-grotesk text-shadow-western"
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            {"2024".split("").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { y: 50, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { delay: i * 0.1 + 1.2, duration: 0.5 } },
                  animate: particleVariant.animate(i),
                }}
                initial="hidden"
                animate="animate"
                transition={{ duration: 1, delay: 2.5 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* 2025 animation */}
          <motion.div
            className="flex justify-center mb-6 text-4xl md:text-6xl font-bold text-primary font-space-grotesk text-shadow-western"
            initial="hidden"
            animate="visible"
            transition={{ delay: 3.5 }}
          >
            {"2025".split("").map((char, i) => (
              <motion.span key={i} variants={letterVariant} custom={i + 12}>
                {char}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 1 }}
            className="text-xl md:text-2xl mb-8 font-dm-sans text-shadow-western"
          >
            Ride into the Future With Us
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4.5, duration: 0.8 }}
          >
            <Button
              onClick={scrollToForm}
              className="text-lg px-8 py-4 animate-glow hover:scale-105 transition-transform font-space-grotesk"
              size="lg"
            >
              Apply Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Domains Section */}
      <section id="domains" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 font-space-grotesk text-primary">Choose Your Path</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="western-border hover:shadow-2xl transition-all duration-300 animate-slide-in-left bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/cowboy-at-saloon-table-with-cards-representing-web.png"
                    alt="Web Development"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-2xl font-space-grotesk text-primary">Web App Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-dm-sans">
                  Build scalable, modern applications for real-world impact. Master the frontier of web technologies.
                </CardDescription>
                <Badge className="mt-4" variant="secondary">
                  Frontend & Backend
                </Badge>
              </CardContent>
            </Card>

            <Card className="western-border hover:shadow-2xl transition-all duration-300 animate-slide-in-left bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/explorer-cowboy-with-map-representing-research-and.png"
                    alt="Research & Development"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-2xl font-space-grotesk text-primary">Research & Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-dm-sans">
                  Explore new territories in AI, ML, and data science. Pioneer the unknown frontiers of technology.
                </CardDescription>
                <Badge className="mt-4" variant="secondary">
                  AI & ML
                </Badge>
              </CardContent>
            </Card>

            <Card className="western-border hover:shadow-2xl transition-all duration-300 animate-slide-in-left bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/sheriff-badge-representing-corporate-leadership-an.png"
                    alt="Corporate"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-2xl font-space-grotesk text-primary">Corporate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-dm-sans">
                  Lead partnerships, growth, and organizational impact. Become the sheriff of business strategy.
                </CardDescription>
                <Badge className="mt-4" variant="secondary">
                  Leadership
                </Badge>
              </CardContent>
            </Card>

            <Card className="western-border hover:shadow-2xl transition-all duration-300 animate-slide-in-left bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/artist-with-brush-representing-creativity-and-desi.png"
                    alt="Creatives"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-2xl font-space-grotesk text-primary">Creatives</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-dm-sans">
                  Bring stories to life with design and media. Paint the narrative of our digital frontier.
                </CardDescription>
                <Badge className="mt-4" variant="secondary">
                  Design & Media
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Apply Section */}
      {showForm && (
        <section id="apply-section" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="western-border bg-card/95 backdrop-blur-sm animate-fade-in-up">
              {showConfirmation ? (
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-space-grotesk text-primary mb-4">
                    🎉 Thank You for Applying!
                  </CardTitle>
                  <CardDescription className="text-lg font-dm-sans mb-6">
                    We've received your application. Our team will review it and get back to you soon.
                  </CardDescription>
                  <Button
                    onClick={resetForm}
                    className="text-lg px-8 py-4 font-space-grotesk"
                  >
                    Submit Another Application
                  </Button>
                </CardHeader>
              ) : showError ? (
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-space-grotesk text-red-600 mb-4">
                    ⚠️ Error Occurred
                  </CardTitle>
                  <CardDescription className="text-lg font-dm-sans mb-6">
                    Error occurred. Please try again later.
                  </CardDescription>
                  <Button
                    onClick={() => setShowError(false)}
                    className="text-lg px-8 py-4 font-space-grotesk"
                  >
                    Try Again
                  </Button>
                </CardHeader>
              ) : (
                <>
                  <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-space-grotesk text-primary mb-4">
                      Join the Ride – Apply Now
                    </CardTitle>
                    <CardDescription className="text-lg font-dm-sans">
                      Ready to embark on your journey with ACM SIGKDD? Fill out the form below, partner.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="name" className="font-dm-sans">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="registration_number" className="font-dm-sans">Registration Number</Label>
                        <Input
                          id="registration_number"
                          value={formData.registration_number}
                          onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="srm_email" className="font-dm-sans">SRM Email ID</Label>
                        <Input
                          id="srm_email"
                          type="email"
                          value={formData.srm_email}
                          onChange={(e) => setFormData({ ...formData, srm_email: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="personal_email" className="font-dm-sans">Personal Email ID</Label>
                        <Input
                          id="personal_email"
                          type="email"
                          value={formData.personal_email}
                          onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_number" className="font-dm-sans">Contact Number</Label>
                        <Input
                          id="contact_number"
                          value={formData.contact_number}
                          onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year" className="font-dm-sans">Year</Label>
                        <Select 
                          onValueChange={(value) => setFormData({ ...formData, year: value })}
                          value={formData.year}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="I">I</SelectItem>
                            <SelectItem value="II">II</SelectItem>
                            <SelectItem value="III">III</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department" className="font-dm-sans">Department</Label>
                        <Select 
                          onValueChange={(value) => setFormData({ ...formData, department: value })}
                          value={formData.department}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="mt-2">
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
                        <Label htmlFor="section" className="font-dm-sans">Section</Label>
                        <Input
                          id="section"
                          value={formData.section}
                          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faculty_advisor_name" className="font-dm-sans">Faculty Advisor Name</Label>
                        <Input
                          id="faculty_advisor_name"
                          value={formData.faculty_advisor_name}
                          onChange={(e) => setFormData({ ...formData, faculty_advisor_name: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faculty_advisor_contact" className="font-dm-sans">Faculty Advisor Contact</Label>
                        <Input
                          id="faculty_advisor_contact"
                          value={formData.faculty_advisor_contact}
                          onChange={(e) => setFormData({ ...formData, faculty_advisor_contact: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="interested_domain" className="font-dm-sans">Interested Domain</Label>
                        <Select 
                          onValueChange={(value) => setFormData({ ...formData, interested_domain: value })}
                          value={formData.interested_domain}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="mt-2">
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
                        className="w-full text-lg py-6 font-space-grotesk animate-glow"
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
      <footer className="bg-stone-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4 font-space-grotesk text-primary">ACM SIGKDD</h3>
            <p className="font-dm-sans text-stone-300">Exploring the frontiers of knowledge and data</p>
          </div>
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          </div>
          <div className="border-t border-stone-700 pt-8">
            <p className="font-dm-sans text-stone-400">© 2025 ACM SIGKDD. All rights reserved. Ride responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
