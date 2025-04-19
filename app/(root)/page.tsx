
import BackToTopButton from '@/components/BackToTopButton'
import FeaturedProperties from '@/components/FeaturedProperties'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Testimonials from '@/components/Testimonials'
import React from 'react'

const page = () => {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <Testimonials />
      <Footer />
      <BackToTopButton />
    </>
  )
}

export default page
