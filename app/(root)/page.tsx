
import BackToTopButton from '@/components/shared/BackToTopButton'
import FeaturedProperties from '@/components/shared/FeaturedProperties'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/shared/Hero'
import Testimonials from '@/components/shared/Testimonials'
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
