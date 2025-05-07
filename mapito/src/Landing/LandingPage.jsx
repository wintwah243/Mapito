import React from 'react'
import LandingNavbar from './LandingNavbar'
import LandingIntro from './LandingIntro'
import LandingFeature from './LandingFeature'
import LandingLearnMore from './LandingLearnMore'
import LandingHero from './LandingHero'
import LandingFooter from './LandingFooter'
import FAQ from '../components/FAQ'

const LandingPage = () => {
  return (
    <>
      <LandingNavbar />
      <LandingIntro />
      <LandingFeature />
      <LandingLearnMore />
      <LandingHero />
      <FAQ />
      <LandingFooter />
    </>
  )
}

export default LandingPage
