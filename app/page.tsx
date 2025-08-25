"use client"

import type React from "react"
import { useState, useEffect } from "react"
import localFont from "next/font/local"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Load rdrf.ttf from app/fonts/rdrf.ttf (path is relative to this file)
const rdrf = localFont({
  src: "./fonts/rdrf.ttf",
  display: "swap",
})

export default function RecruitmentPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    domain: "",
    reason: "",
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
    setShowForm(false)
  }

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-stone-900/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        
          
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center parallax-bg"
        style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://www.chromethemer.com/download/hd-wallpapers/red-dead-redemption-7680x4320.jpg')`,

        }}
      >
        <div className="text-center text-white animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-space-grotesk text-shadow-western"></h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary font-space-grotesk text-shadow-western">
            RECRUITMENTS 2025
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-dm-sans text-shadow-western">
            Ride into the Future With Us
          </p>
          <Button
            onClick={scrollToForm}
            className="text-lg px-8 py-4 animate-glow hover:scale-105 transition-transform font-space-grotesk"
            size="lg"
          >
            Apply Now
          </Button>
        </div>
      </section>

      {/* Domains Section */}
      <section id="domains" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 font-space-grotesk text-primary">Choose Your Path</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Web App Development */}
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

            {/* Research & Development */}
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

            {/* Corporate */}
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

            {/* Creatives */}
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
                    <Label htmlFor="name" className="font-dm-sans">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-dm-sans">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="font-dm-sans">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="domain" className="font-dm-sans">
                      Domain Preference
                    </Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, domain: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose your path" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-dev">Web App Development</SelectItem>
                        <SelectItem value="research">Research & Development</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="creatives">Creatives</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reason" className="font-dm-sans">
                      Why do you want to join ACM SIGKDD?
                    </Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      required
                      className="mt-2 min-h-[100px]"
                      placeholder="Tell us about your journey and aspirations..."
                    />
                  </div>

                  <Button type="submit" className="w-full text-lg py-6 font-space-grotesk animate-glow">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Confirmation Section */}
      {showConfirmation && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-fade-in-up">
              <h2 className="text-5xl font-bold mb-6 font-space-grotesk text-primary">Your Journey Begins Here!</h2>
              <p className="text-xl mb-8 font-dm-sans max-w-2xl mx-auto">
                Thank you for applying to ACM SIGKDD Recruitments 2025. We'll get back to you soon, partner 🤠
              </p>
              <div className="w-64 h-64 mx-auto mb-8">
                <img
                  src="/cowboy-riding-into-sunset-representing-new-journey.png"
                  alt="Journey Begins"
                  className="w-full h-full object-cover rounded-full animate-dust"
                />
              </div>
              <Button
                onClick={() => {
                  setShowConfirmation(false)
                  setShowForm(false)
                }}
                variant="outline"
                className="font-space-grotesk"
              >
                Back to Home
              </Button>
            </div>
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
            <a href="#" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Instagram
            </a>
          </div>

          <div className="border-t border-stone-700 pt-8">
            <p className="font-dm-sans text-stone-400">© 2025 ACM SIGKDD. All rights reserved. Ride responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
