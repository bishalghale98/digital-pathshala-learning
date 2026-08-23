import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about BISAN LMS - our mission to provide accessible, high-quality online education to learners everywhere.',
  openGraph: {
    title: 'About Us | BISAN LMS',
    description:
      'Learn about BISAN LMS - our mission to provide accessible, high-quality online education.',
    type: 'website',
  },
};

const AboutUsPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-800">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About BISAN LMS</h1>
                    <p className="text-lg md:text-xl">
                        Empowering students and educators with a seamless online learning experience.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 text-gray-800">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-gray-700">
                            Our mission is to provide accessible, high-quality online education to learners everywhere. We aim to make learning intuitive, engaging, and rewarding.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                        <p className="text-gray-700">
                            We envision a world where anyone, anywhere can gain the knowledge and skills needed to succeed in their careers and personal growth.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {['Ram', 'Shyam', 'Baburaw', 'Anuradha'].map((name) => (
                            <div key={name} className="bg-white rounded-lg shadow p-6">
                                <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 mb-4"></div>
                                <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
                                <p className="text-gray-500 text-sm">.....</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 text-center text-gray-800">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Join BISAN LMS Today!</h2>
                <p className="text-gray-700 mb-6">Start learning and growing with our interactive courses and expert instructors.</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Get Started
                </button>
            </section>
        </div>
    );
};

export default AboutUsPage;
