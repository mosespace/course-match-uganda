'use client';

import TeamSection from '@/components/team-section';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/constants/site';
import { Clock, DollarSign, GitGraph } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const people = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Software Engineer',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
  },
  {
    id: 2,
    name: 'Robert Johnson',
    designation: 'Product Manager',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 3,
    name: 'Jane Smith',
    designation: 'Data Scientist',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'UX Designer',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 5,
    name: 'Tyler Durden',
    designation: 'Soap Developer',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
  },
  {
    id: 6,
    name: 'Dora',
    designation: 'The Explorer',
    image:
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80',
  },
];

const teamMembers = [
  {
    id: 1,
    name: 'Yaro Donald',
    role: 'CEO & Founder',
    troubleMaker: false,
    image:
      'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?ga=GA1.1.1818589012.1736774497&semt=ais_hybrid',
    socialMedia: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 2,
    name: 'Timothy Marcus',
    role: 'CTO',
    troubleMaker: true,

    image:
      'https://img.freepik.com/premium-photo/png-headset-headphones-portrait-cartoon_53876-762197.jpg?ga=GA1.1.1818589012.1736774497&semt=ais_hybrid',
    socialMedia: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'David Locklear',
    role: 'Lead Designer',
    troubleMaker: false,

    image:
      'https://img.freepik.com/premium-photo/png-cartoon-portrait-glasses-white-background_53876-905385.jpg?ga=GA1.1.1818589012.1736774497&semt=ais_hybrid',
    socialMedia: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 4,
    name: 'Michael Brown',
    role: 'Marketing Director',
    troubleMaker: false,

    image:
      'https://img.freepik.com/premium-psd/3d-avatar-character_975163-690.jpg?ga=GA1.1.1818589012.1736774497&semt=ais_hybrid',
    socialMedia: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Enter Your Results',
    description:
      'Input your A-Level and O-Level results to calculate your eligibility points.',
    icon: 'Graph',
    color: 'violet',
  },
  {
    step: '02',
    title: 'Discover Courses',
    description:
      'Browse through courses from various universities that match your qualifications.',
    icon: 'Clock',
    color: 'violet',
  },
  {
    step: '03',
    title: 'Apply with Confidence',
    description:
      'Apply to courses knowing you meet the entry requirements and academic standards.',
    icon: 'DollarSign',
    color: 'violet',
  },
];

const testimonials = [
  {
    name: 'Maria Johnson',
    role: 'HR Director, Resto Group',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=40&h=40&auto=format&fit=crop',
    quote:
      "The payroll system simplified our processes enormously. We've saved hours of admin work each week and reduced errors substantially.",
  },
  {
    name: `${siteConfig.name}`,
    role: 'CFO, TechStart Inc.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=40&h=40&auto=format&fit=crop',
    quote: `${siteConfig.name}'s tax compliance features have been a game-changer for our multi-state operations. We're confident our payroll is always accurate and compliant.`,
  },
  {
    name: 'Sarah Williams',
    role: 'Office Manager, Craft Builders',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=40&h=40&auto=format&fit=crop',
    quote:
      'As a small business, we needed an affordable solution that could grow with us. {siteConfig.name} delivers enterprise-level features at a price we can afford.',
  },
];

export default function page() {
  return (
    <>
      <section>
        <div className="relative justify-center h-screen z-0 mx-auto items-center space-y-4 max-w-3xl md:pb-24 pt-16 text-center">
          <div>
            <h1 className="mb-8 bg-gradient-to-t from-[#6d6d6d] to-[#f4f4f4] bg-clip-text text-4xl text-transparent md:text-7xl">
              Advanced <span className="text-violet-500">Course Matching</span>{' '}
              with Expert Online Guidance
            </h1>
            <p className="text-lg max-w-2xl text-gray-500">
              Our AI-powered platform analyzes your academic results to match
              you with the perfect university courses in Uganda, ensuring you
              make the right choice for your future career.
            </p>
          </div>
          <AnimatedTooltip
            items={people}
            className="flex items-center justify-center"
          />
        </div>

        <div className="md:flex h-11 justify-center top-[36rem] hidden inset-x-0 z-20 absolute my-8">
          <img
            src="/dashed-arrow.svg"
            alt="Arrow pointing down"
            className="w-[25rem] h-[15rem] object-cover invert"
          />
        </div>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4 text-white">
                How Course-Match Works
              </h2>
              <p className="text-lg text-gray-600">
                Our platform simplifies the process of finding the right
                university course based on your academic performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {howItWorks.map((item, i) => (
                <div key={i} className="relative">
                  <div className="border-[#f4f4f4]/50 border rounded-lg shadow-sm p-8 h-full relative z-10 hover:shadow-md transition-shadow">
                    <div
                      className={`bg-violet-600 z-40 text-5xl p-1 font-bold opacity-10 absolute -top-2 -left-2 text-white`}
                    >
                      {item.step}
                    </div>
                    <div
                      className={`h-12 w-12 rounded-lg bg-${item.color}-100 flex items-center justify-center mb-6`}
                    >
                      {item.icon === 'Graph' && (
                        <GitGraph
                          className={`h-6 w-6 text-${item.color}-600`}
                        />
                      )}
                      {item.icon === 'Clock' && (
                        <Clock className={`h-6 w-6 text-${item.color}-600`} />
                      )}
                      {item.icon === 'DollarSign' && (
                        <DollarSign
                          className={`h-6 w-6 text-${item.color}-600`}
                        />
                      )}
                    </div>
                    <h3 className="text-xl text-white font-bold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 z-20">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <TeamSection
          backgroundColor="bg-indigo-950s"
          title="developers of this application"
          headline="Developed by the best of best"
          teamMembers={teamMembers}
        />

        {/* Testimonials Section */}
        <section className="py-20" id="testimonials">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-t from-[#6d6d6d] to-[#f4f4f4] bg-clip-text text-transparent">
                Trusted by businesses worldwide
              </h2>
              <p className="text-lg text-gray-600">
                See what our customers have to say about our payroll solution
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((item, i) => (
                <Card
                  key={i}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6">"{item.quote}"</p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          width={400}
                          height={400}
                          alt={`${item.name}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r rounded-lg from-[#f4f4f4] to-violet-500 ">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect University Course?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of students that trust {siteConfig.name} for their
              university needs. Get started today with our free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/start">Start Free Now</Link>
              </Button>
              <Button disabled variant="outline" size="lg" className="px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
