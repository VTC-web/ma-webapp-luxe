import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Play, Pause, X, Plus, Minus, Plane, Star, ChevronDown, Users, Package, Sparkles, Briefcase, Heart, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Clock, Shield, Award, Home, Car, Calendar, ArrowLeftRight, Info } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import AnimatedCounter from './components/AnimatedCounter'
import './index.css'
import './styles.css'

const SERVICE_IDS = ['transfert-aeroport', 'evenement-corporate', 'mariage-prestige', 'zones-desservies']
const VEHICLE_IDS = ['mercedes-e-class', 'mercedes-s680', 'van-luxe']
const AIRPORT_IDS = ['cdg', 'orly', 'le-bourget']

const vehicleSpecs = {
  'mercedes-e-class': { passengers: 4, luggage: 2, images: ['https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg', 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg', 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'] },
  'mercedes-s680': { passengers: 4, luggage: 3, images: ['https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg', 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg', 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'] },
  'van-luxe': { passengers: 8, luggage: 6, images: ['https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg', 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg', 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'] }
}

function App() {
  const { t, i18n } = useTranslation()

  // Configuration Spring unifiée pour toutes les animations
  const springConfig = {
    type: "spring",
    stiffness: 100,
    damping: 20
  }

  // State Management - Simplifié pour le panier uniquement
  const [cart, setCart] = useState({
    vehicle: null
  })

  // BookingWizard State
  const [wizardOpen, setWizardOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1-5
  const [bookingData, setBookingData] = useState({
    vehicle: null,
    luggage: 0,
    service: null,
    date: '',
    time: '',
    passenger: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      specialRequests: ''
    }
  })

  const [openFAQ, setOpenFAQ] = useState(null)
  const [faqExpanded, setFaqExpanded] = useState(false)
  const [testimonialV2Index, setTestimonialV2Index] = useState(0)
  const [serviceIndex, setServiceIndex] = useState(0)
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [heroAddressFrom, setHeroAddressFrom] = useState('')
  const [heroAddressTo, setHeroAddressTo] = useState('')
  const [heroVehicleId, setHeroVehicleId] = useState(VEHICLE_IDS[0] || null)
  const [heroPassengers, setHeroPassengers] = useState(1)
  const [heroLuggage, setHeroLuggage] = useState(0)
  const [aboutReadMore, setAboutReadMore] = useState(false)
  const [vehicleModalId, setVehicleModalId] = useState(null)
  const [vehicleModalPhotoIndex, setVehicleModalPhotoIndex] = useState(0)
  const [legalModal, setLegalModal] = useState(null) // 'legal' | 'cgv' | null
  const [blogModalId, setBlogModalId] = useState(null) // id de l'article ouvert
  const [serviceModalId, setServiceModalId] = useState(null) // id du service ouvert
  const heroRef = useRef(null)
  const menuRef = useRef(null)
  const hamburgerRef = useRef(null)
  const serviceViewportRef = useRef(null)
  const firstScreenRef = useRef(null)
  const [showBottomNav, setShowBottomNav] = useState(false)

  // Données construites depuis les traductions (mise à jour au changement de langue)
  const serviceIcons = { 'transfert-aeroport': '✈️', 'evenement-corporate': '💼', 'mariage-prestige': '💍', 'zones-desservies': 'map' }
  const serviceImage = 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
  const airportCodes = { cdg: 'CDG', orly: 'ORY', 'le-bourget': 'LBG' }

  const vehicles = useMemo(() =>
    VEHICLE_IDS.map(id => {
      const spec = vehicleSpecs[id]
      const content = t(`fleet.vehicles.${id}.content`, { defaultValue: '' })
      return {
        id,
        name: t(`fleet.vehicles.${id}.name`),
        tagline: t(`fleet.vehicles.${id}.tagline`),
        vehicleClass: t(`fleet.vehicles.${id}.vehicleClass`),
        description: t(`fleet.vehicles.${id}.description`),
        price: t(`fleet.vehicles.${id}.price`),
        content: content || null,
        specs: { passengers: spec.passengers, luggage: spec.luggage },
        images: spec.images
      }
    }),
    [t]
  )

  const services = useMemo(() =>
    SERVICE_IDS.map(id => {
      const content = t(`services.list.${id}.content`, { defaultValue: '' })
      return {
        id,
        name: t(`services.list.${id}.name`),
        description: t(`services.list.${id}.description`),
        content: content || null,
        features: t(`services.list.${id}.features`, { returnObjects: true }),
        icon: serviceIcons[id],
        image: serviceImage
      }
    }),
    [t]
  )

  const airports = useMemo(() =>
    AIRPORT_IDS.map(id => ({
      id,
      name: t(`airports.list.${id}.name`),
      code: airportCodes[id],
      duration: t(`airports.list.${id}.duration`),
      price: t(`airports.list.${id}.price`, { defaultValue: '' })
    })),
    [t]
  )

  const partners = useMemo(() => {
    const list = t('partners.list', { returnObjects: true })
    return Array.isArray(list) ? list.map((item, i) => ({ id: i + 1, ...item })) : []
  }, [t])

  const testimonials = useMemo(() => {
    const list = t('testimonials.list', { returnObjects: true })
    return Array.isArray(list) ? list.map((item, i) => ({ id: i + 1, ...item, rating: 5 })) : []
  }, [t])

  const blogArticles = useMemo(() => {
    const list = t('blog.list', { returnObjects: true })
    return Array.isArray(list) ? list.map((item, i) => ({ id: i + 1, ...item })) : []
  }, [t])

  const faqs = useMemo(() => {
    const list = t('faq.list', { returnObjects: true })
    return Array.isArray(list) ? list.map((item, i) => ({ id: i + 1, ...item })) : []
  }, [t])

  const footerCities = useMemo(() => {
    const raw = t('footer.cities', { returnObjects: true })
    return Array.isArray(raw) ? raw : []
  }, [t])

  // Handlers
  const addToCart = (type, item) => {
    setCart(prev => ({
      ...prev,
      [type]: item
    }))
  }

  const removeFromCart = (type) => {
    setCart(prev => ({
      ...prev,
      [type]: null
    }))
  }

  // Auto-rotation partenaires (désactivée pour l'instant, animation CSS gère le scroll)


  // Afficher la barre du bas quand on sort du hero (scroll)
  useEffect(() => {
    const threshold = () => {
      const vh = window.innerHeight
      setShowBottomNav(window.scrollY > vh * 0.3)
    }
    threshold()
    window.addEventListener('scroll', threshold, { passive: true })
    return () => window.removeEventListener('scroll', threshold)
  }, [])

  // Fermer le menu déroulant quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuExpanded && 
          menuRef.current && 
          hamburgerRef.current &&
          !menuRef.current.contains(event.target) &&
          !hamburgerRef.current.contains(event.target)) {
        setMenuExpanded(false)
      }
    }

    if (menuExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuExpanded])

  // Bloquer le scroll du body quand une modal plein écran est ouverte (scroll uniquement dans la modal)
  useEffect(() => {
    const isModalOpen = !!vehicleModalId || !!legalModal || !!blogModalId || !!serviceModalId
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [vehicleModalId, legalModal, blogModalId, serviceModalId])

  // Défilement automatique des avis v2
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialV2Index((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const vehicleModal = vehicleModalId ? vehicles.find((v) => v.id === vehicleModalId) : null

  // Logique de Recommandation Intelligente
  const getRecommendedVehicle = (luggageCount) => {
    if (luggageCount <= 2) {
      return 'mercedes-e-class' // Berline
    } else if (luggageCount >= 3 && luggageCount <= 4) {
      return 'mercedes-s680' // SUV
    } else {
      return 'van-luxe' // Van
    }
  }

  const isRecommended = (vehicleId) => {
    if (bookingData.luggage === 0) return false
    return getRecommendedVehicle(bookingData.luggage) === vehicleId
  }

  // Handlers BookingWizard
  const openWizard = () => {
    setWizardOpen(true)
    setCurrentStep(1)
  }

  const openWizardAtVehicles = () => {
    setWizardOpen(true)
    setCurrentStep(1)
  }

  const swapHeroAddresses = () => {
    setHeroAddressFrom(heroAddressTo)
    setHeroAddressTo(heroAddressFrom)
  }

  const closeWizard = () => {
    setWizardOpen(false)
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateBookingData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleConfirmBooking = () => {
    const whatsappNumber = '+33605998211'
    let message = `${t('wizard.whatsappTitle')}\n\n`
    message += `${t('wizard.summaryVehicle')} : ${bookingData.vehicle?.name || t('wizard.notSelected')}\n`
    message += `${t('wizard.summaryService')} : ${bookingData.service?.name || t('wizard.notSelected')}\n`
    message += `${t('wizard.summaryDate')} : ${bookingData.date || t('wizard.notFilled')}\n`
    message += `${t('wizard.summaryTime')} : ${bookingData.time || t('wizard.notFilled')}\n`
    message += `${t('wizard.summaryLuggage')} : ${bookingData.luggage || 0}\n\n`
    message += `${t('wizard.summaryClient')} : ${bookingData.passenger.firstName} ${bookingData.passenger.lastName}\n`
    message += `${t('wizard.phone')} : ${bookingData.passenger.phone}\n`
    message += `${t('wizard.email')} : ${bookingData.passenger.email}\n`
    if (bookingData.passenger.specialRequests) {
      message += `${t('wizard.specialRequests')} : ${bookingData.passenger.specialRequests}\n`
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    closeWizard()
  }

  const whatsappQuoteUrl = `https://wa.me/33605998211?text=${encodeURIComponent(t('section.quoteMessage'))}`

  const blockAnim = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: springConfig
  }

  const sectionCTA = (
    <div className="section-cta">
      <motion.button type="button" className="section-cta__btn" onClick={openWizard} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {t('section.reserve')}
      </motion.button>
      <a href={whatsappQuoteUrl} target="_blank" rel="noopener noreferrer" className="section-cta__quote">
        {t('section.quote')}
      </a>
    </div>
  )

  return (
    <div className="app">
      {/* Premier écran: hero + partenaires = 100vh, barre du bas cachée */}
      <div className="first-screen" ref={firstScreenRef}>
      <section id="hero" className="hero" ref={heroRef}>
        {/* Barre de menu/logo en haut du Hero */}
        <motion.div 
          className="hero__top-bar"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springConfig}
        >
          <div className="hero__top-bar-container">
            <div className="hero__top-bar-container-inner">
              {/* Gauche : logo + langue */}
              <div className="hero__top-bar-left">
                <div className="hero__top-bar-logo">
                  <img 
                    src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" 
                    alt={t('footer.brandName')} 
                    className="hero__top-bar-logo-image"
                  />
                  <span>{t('nav.brand')}</span>
                </div>
                <div className="hero__lang-switcher">
                  <button
                    type="button"
                    className={i18n.language === 'fr' ? 'hero__lang-btn is-active' : 'hero__lang-btn'}
                    onClick={() => i18n.changeLanguage('fr')}
                    aria-label="Français"
                    title="Français"
                  >
                    <span className="hero__lang-flag" aria-hidden="true">🇫🇷</span>
                  </button>
                  <button
                    type="button"
                    className={i18n.language === 'en' ? 'hero__lang-btn is-active' : 'hero__lang-btn'}
                    onClick={() => i18n.changeLanguage('en')}
                    aria-label="English"
                    title="English"
                  >
                    <span className="hero__lang-flag" aria-hidden="true">🇬🇧</span>
                  </button>
                </div>
              </div>

              {/* Centre : navigation */}
              <div className="hero__top-bar-center">
                <nav className="hero__top-bar-menu">
                  <a 
                    href="#about" 
                    className="hero__top-bar-link"
                    onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                  >
                    {t('nav.about')}
                  </a>
                  <a 
                    href="#fleet" 
                    className="hero__top-bar-link"
                    onClick={(e) => { e.preventDefault(); scrollToSection('fleet'); }}
                  >
                    {t('nav.fleet')}
                  </a>
                  <a 
                    href="#services" 
                    className="hero__top-bar-link"
                    onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                  >
                    {t('nav.services')}
                  </a>
                  <a 
                    href="#airports" 
                    className="hero__top-bar-link"
                    onClick={(e) => { e.preventDefault(); scrollToSection('airports'); }}
                  >
                    {t('nav.airports')}
                  </a>
                </nav>
              </div>

              {/* Droite : téléphone + hamburger */}
              <div className="hero__top-bar-right">
                <a 
                  href="tel:+33605998211"
                  className="hero__top-bar-phone"
                  aria-label={t('nav.ariaCall')}
                >
                  <Phone size={20} />
                </a>
                <button 
                  ref={hamburgerRef}
                  className="hero__top-bar-hamburger"
                  onClick={() => setMenuExpanded(!menuExpanded)}
                  aria-label={t('nav.ariaMenu')}
                  aria-expanded={menuExpanded}
                >
                  <div className="hero__top-bar-hamburger-icon">
                    <span className={`hero__top-bar-hamburger-line ${menuExpanded ? 'is-open' : ''}`}></span>
                    <span className={`hero__top-bar-hamburger-line ${menuExpanded ? 'is-open' : ''}`}></span>
                    <span className={`hero__top-bar-hamburger-line ${menuExpanded ? 'is-open' : ''}`}></span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Mobile Expanded - Bloc externe en dessous de la barre */}
        <AnimatePresence>
          {menuExpanded && (
            <motion.div 
              ref={menuRef}
              className="hero__top-bar-expanded"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springConfig}
            >
              <div className="hero__top-bar-expanded-content">
                <a 
                  href="#hero" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); scrollToSection('hero'); setMenuExpanded(false); }}
                >
                  <Home size={20} />
                  <span>{t('nav.home')}</span>
                </a>
                <a 
                  href="#about" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); scrollToSection('about'); setMenuExpanded(false); }}
                >
                  <Users size={20} />
                  <span>{t('nav.about')}</span>
                </a>
                <a 
                  href="#services" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); setMenuExpanded(false); }}
                >
                  <Briefcase size={20} />
                  <span>{t('nav.services')}</span>
                </a>
                <a 
                  href="#fleet" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); scrollToSection('fleet'); setMenuExpanded(false); }}
                >
                  <Car size={20} />
                  <span>{t('nav.fleets')}</span>
                </a>
                <a 
                  href="#contact" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); const footer = document.querySelector('.footer'); if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' }); setMenuExpanded(false); }}
                >
                  <Mail size={20} />
                  <span>{t('nav.contact')}</span>
                </a>
                <div className="hero__top-bar-expanded-lang">
                <button
                  type="button"
                  className={i18n.language === 'fr' ? 'hero__lang-btn is-active' : 'hero__lang-btn'}
                  onClick={() => { i18n.changeLanguage('fr'); setMenuExpanded(false); }}
                  title="Français"
                >
                  <span className="hero__lang-flag" aria-hidden="true">🇫🇷</span>
                </button>
                <button
                  type="button"
                  className={i18n.language === 'en' ? 'hero__lang-btn is-active' : 'hero__lang-btn'}
                  onClick={() => { i18n.changeLanguage('en'); setMenuExpanded(false); }}
                  title="English"
                >
                  <span className="hero__lang-flag" aria-hidden="true">🇬🇧</span>
                </button>
              </div>
                <button 
                  className="hero__top-bar-expanded-link hero__top-bar-expanded-link--cta"
                  onClick={() => { openWizard(); setMenuExpanded(false); }}
                >
                  <Calendar size={16} />
                  <span>{t('nav.book')}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCREEN_1: Full-screen hero, image + overlay, content at bottom */}
        <div className="hero__container">
          <div className="hero__background-image-wrapper">
            <img
              src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg"
              alt=""
              className="hero__background-image"
            />
            <div className="hero__background-overlay" aria-hidden="true" />
          </div>
          {/* Logo top-left: 60px, 24px — spec exacte */}
          <div className="hero__logo" aria-hidden="true">
            <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="" />
          </div>
          {/* Content overlay: padding 0 24px, headline bottom 180px, subheadline + CTA bottom 120px */}
          <div className="hero__content-overlay">
            <h1 className="hero__headline">
              {t('hero.titleBefore')}
              <span className="hero__headline-accent">{t('hero.titleAccent')}</span>
              {t('hero.titleAfter')}
            </h1>
            <p className="hero__subheadline">{t('hero.subtitle')}</p>
            <div className="hero__form-mini" role="group" aria-label={t('hero.form.ariaReserve')}>
              <div className="hero__form-mini-fields">
                <input
                  id="hero-mini-from"
                  type="text"
                  className="hero__form-mini-input"
                  placeholder={t('hero.form.fromPlaceholder')}
                  value={heroAddressFrom}
                  onChange={(e) => setHeroAddressFrom(e.target.value)}
                  autoComplete="section-departure street-address"
                  aria-label={t('hero.form.from')}
                />
                <span className="hero__form-mini-sep" aria-hidden="true">→</span>
                <input
                  id="hero-mini-to"
                  type="text"
                  className="hero__form-mini-input"
                  placeholder={t('hero.form.toPlaceholder')}
                  value={heroAddressTo}
                  onChange={(e) => setHeroAddressTo(e.target.value)}
                  autoComplete="section-arrival street-address"
                  aria-label={t('hero.form.to')}
                />
                <select
                  id="hero-mini-vehicle"
                  className="hero__form-mini-select"
                  value={heroVehicleId || ''}
                  onChange={(e) => setHeroVehicleId(e.target.value || null)}
                  aria-label={t('hero.form.vehicle')}
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <motion.button
                type="button"
                className="hero__form-mini-cta"
                onClick={() => {
                  const v = vehicles.find((x) => x.id === heroVehicleId)
                  if (v) updateBookingData('vehicle', v)
                  openWizardAtVehicles()
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={t('hero.ariaCta')}
              >
                <span>{t('section.reserve')}</span>
                <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>

        </section>

      {/* Partenaires — dans le premier écran avec le hero */}
      <section className="partners" aria-label={t('partners.title')}>
        <div className="partners__marquee">
          <div className="partners__track" aria-hidden="true">
            {[1, 2].map((copy) => (
              <div key={copy} className="partners__list">
                {partners.map((partner) => {
                  const content = (
                    <>
                      {partner.logo ? (
                        <img src={partner.logo} alt="" className="partners__logo" width="120" height="40" loading="lazy" />
                      ) : (
                        <span className="partners__name">{partner.name}</span>
                      )}
                    </>
                  )
                  return partner.url ? (
                    <a key={`${copy}-${partner.id}`} href={partner.url} target="_blank" rel="noopener noreferrer" className="partners__item">{content}</a>
                  ) : (
                    <span key={`${copy}-${partner.id}`} className="partners__item partners__item--no-link">{content}</span>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* Barre du bas — champs adresse + CTA vers wizard (visible après scroll) */}
      <aside className={`bottom-bar ${!showBottomNav ? 'bottom-bar--hidden' : ''}`} aria-label={t('nav.ariaMenu')}>
        <div className="bottom-bar__inner">
          <div className="bottom-bar__fields">
            <label className="bottom-bar__label" htmlFor="bottom-address-from">
              <MapPin size={14} aria-hidden="true" />
              {t('hero.form.from')}
            </label>
            <input
              id="bottom-address-from"
              type="text"
              className="bottom-bar__input"
              placeholder={t('hero.form.fromPlaceholder')}
              value={heroAddressFrom}
              onChange={(e) => setHeroAddressFrom(e.target.value)}
              autoComplete="section-departure street-address"
            />
          </div>
          <div className="bottom-bar__fields">
            <label className="bottom-bar__label" htmlFor="bottom-address-to">
              <MapPin size={14} aria-hidden="true" />
              {t('hero.form.to')}
            </label>
            <input
              id="bottom-address-to"
              type="text"
              className="bottom-bar__input"
              placeholder={t('hero.form.toPlaceholder')}
              value={heroAddressTo}
              onChange={(e) => setHeroAddressTo(e.target.value)}
              autoComplete="section-arrival street-address"
            />
          </div>
          <motion.button
            type="button"
            className="bottom-bar__cta"
            onClick={openWizard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={t('nav.book')}
          >
            <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            <span>{t('section.reserve')}</span>
          </motion.button>
        </div>
      </aside>

      {/* Section Flotte — juste sous hero + partenaires */}
      <section id="fleet" className="listing">
        <div className="listing__header">
          <h2 className="listing__title">{t('fleet.title')}</h2>
          <button type="button" className="listing__see-all" onClick={openWizard}>{t('fleet.seeAll')}</button>
        </div>
        <div className="listing__filters">
          <button type="button" className="listing__filter is-active">{t('fleet.filterAll')}</button>
          {vehicles.map((v) => (
            <button key={v.id} type="button" className="listing__filter">{v.vehicleClass}</button>
          ))}
        </div>
        <motion.div className="listing__list" {...blockAnim}>
          {vehicles.map((vehicle, index) => (
            <motion.article
              key={vehicle.id}
              className="listing-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ ...springConfig, delay: index * 0.06 }}
            >
              <div
                className="listing-card__image"
                style={{ backgroundImage: `url(${vehicle.images[0]})` }}
                aria-hidden="true"
              />
              <div className="listing-card__overlay" aria-hidden="true" />
              <div className="listing-card__badge" aria-hidden="true">
                <Car size={16} />
              </div>
              <div className="listing-card__rating">
                <Star size={14} fill="currentColor" className="listing-card__star" />
                <span>4.9</span>
              </div>
              <div className="listing-card__content">
                <span className="listing-card__brand">{t('nav.brand')}</span>
                <h3 className="listing-card__model">{vehicle.name}</h3>
                <div className="listing-card__bottom">
                  <div className="listing-card__price-wrap">
                    <span className="listing-card__price">{vehicle.price}</span>
                    <span className="listing-card__period">/ {t('fleet.perDay')}</span>
                  </div>
                  <div className="listing-card__actions">
                    <button
                      type="button"
                      className="listing-card__info"
                      onClick={(e) => { e.stopPropagation(); setVehicleModalId(vehicle.id); setVehicleModalPhotoIndex(0); }}
                      aria-label={t('fleet.info')}
                    >
                      <Info size={18} strokeWidth={2.5} />
                      <span>{t('fleet.info')}</span>
                    </button>
                    <motion.button
                      type="button"
                      className="listing-card__cta"
                      onClick={() => { updateBookingData('vehicle', vehicle); openWizard(); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label={t('fleet.cta')}
                    >
                      <ArrowRight size={20} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
        <motion.div className="listing__cta" {...blockAnim}>{sectionCTA}</motion.div>
      </section>

      {/* Section Services - Prestations Premium */}
      <section id="services" className="services">
        <motion.div className="services__header" {...blockAnim}>
          <p className="services__subtitle">{t('services.subtitle')}</p>
          <div className="services__header-content">
            <span className="services__number">{t('services.number')}</span>
            <h2 className="services__title">{t('services.title')}</h2>
          </div>
          <p className="services__description">
            {t('services.description')}
          </p>
          <motion.button
            className="services__header-cta"
            onClick={openWizard}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('services.cta')}
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        <motion.div className="services__catalog" {...blockAnim}>
          <div
            ref={serviceViewportRef}
            className="services__slider-viewport"
            onScroll={(e) => {
              const v = e.target
              if (v.scrollWidth <= v.clientWidth) { setServiceIndex(0); return }
              const i = Math.round((v.scrollLeft / (v.scrollWidth - v.clientWidth)) * (services.length - 1))
              setServiceIndex(Math.max(0, Math.min(services.length - 1, i)))
            }}
          >
            <div
              className="services__slider-track"
              style={{ width: `${services.length * 100}%` }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className={`services__item ${index === serviceIndex ? 'is-active' : ''}`}
                  style={{ flex: `0 0 ${100 / services.length}%` }}
                  onClick={() => openWizard()}
                >
                  <div 
                    className="services__item-image"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="services__item-overlay"></div>
                    <div className="services__item-icon">
                      {service.icon === '✈️' && <Plane size={40} />}
                      {service.icon === '💼' && <Briefcase size={40} />}
                      {service.icon === '💍' && <Heart size={40} />}
                      {service.icon === '⭐' && <Sparkles size={40} />}
                      {service.icon === 'map' && <MapPin size={40} />}
                    </div>
                  </div>
                  <div className="services__item-content">
                    <div className="services__item-header">
                      <h3 className="services__item-title">{service.name}</h3>
                      <p className="services__item-description">{service.description}</p>
                    </div>
                    <div className="services__item-features">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="services__item-feature">
                          <span className="services__item-feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                    {service.content && (
                      <button
                        type="button"
                        className="services__item-info"
                        onClick={(e) => {
                          e.stopPropagation()
                          setServiceModalId(service.id)
                        }}
                        aria-label={t('services.ariaInfo')}
                      >
                        <Info size={18} aria-hidden="true" />
                        <span>{t('services.info')}</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {services.length > 1 && (
              <>
                <button
                  type="button"
                  className="services__nav services__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    const next = (serviceIndex - 1 + services.length) % services.length
                    setServiceIndex(next)
                    const v = serviceViewportRef.current
                    if (v) v.scrollTo({ left: next * (v.scrollWidth / services.length), behavior: 'smooth' })
                  }}
                  aria-label={t('services.ariaPrev')}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className="services__nav services__nav--next"
                  onClick={(e) => {
                    e.stopPropagation()
                    const next = (serviceIndex + 1) % services.length
                    setServiceIndex(next)
                    const v = serviceViewportRef.current
                    if (v) v.scrollTo({ left: next * (v.scrollWidth / services.length), behavior: 'smooth' })
                  }}
                  aria-label={t('services.ariaNext')}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          {services.length > 1 && (
            <div className="services__nav-dots">
              {services.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`services__nav-dot ${index === serviceIndex ? 'is-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setServiceIndex(index)
                    const v = serviceViewportRef.current
                    if (v) v.scrollTo({ left: index * (v.scrollWidth / services.length), behavior: 'smooth' })
                  }}
                  aria-label={t('services.ariaService', { index: index + 1 })}
                />
              ))}
            </div>
          )}
        </motion.div>
        <motion.div className="services__cta" {...blockAnim}>{sectionCTA}</motion.div>
      </section>

      {/* Section À Propos */}
      <section id="about" className="about">
        <motion.div className="about__header" {...blockAnim}>
          <div className="about__header-content">
            <span className="about__number">{t('about.number')}</span>
            <h2 className="about__title">{t('about.title')}</h2>
          </div>
          <p className="about__description">
            {t('about.tagline')}
            {' '}
            <button
              type="button"
              className="about__read-more"
              onClick={() => setAboutReadMore(!aboutReadMore)}
              aria-expanded={aboutReadMore}
            >
              {aboutReadMore ? t('about.readLess') : t('about.readMore')}
            </button>
          </p>
          {aboutReadMore && (
            <p className="about__paragraph about__paragraph--expandable">
              {t('about.paragraph')}
            </p>
          )}
        </motion.div>

        <motion.div className="about__content" {...blockAnim}>
          <div className="about__text">
            <div className="about__qualities">
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Star size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">{t('about.qualities.excellence.title')}</h3>
                  <p className="about__quality-description">
                    {t('about.qualities.excellence.description')}
                  </p>
                </div>
              </div>
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Shield size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">{t('about.qualities.discretion.title')}</h3>
                  <p className="about__quality-description">
                    {t('about.qualities.discretion.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about__image-wrapper">
            <img 
              src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg"
              alt={`${t('footer.brandName')} - Service premium de transport`}
              className="about__image"
              loading="lazy"
            />
          </div>

          <div className="about__stats">
            {[
              { value: 6, suffix: '+', label: t('about.stats.years'), isNum: true },
              { value: 1500, suffix: '', label: t('about.stats.clients'), isNum: true },
              { value: '24/7', suffix: '', label: t('about.stats.availability'), isNum: false },
              { value: 98, suffix: '%', label: t('about.stats.satisfaction'), isNum: true }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="about__stat"
                initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28, y: 12 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ ...springConfig, delay: index * 0.08 }}
              >
                <div className="about__stat-number">
                  {stat.isNum ? <AnimatedCounter value={stat.value} suffix={stat.suffix} /> : stat.value}
                </div>
                <div className="about__stat-label">{stat.label}</div>
              </motion.div>
            ))}
                </div>
              </motion.div>
        <motion.div className="about__cta" {...blockAnim}>{sectionCTA}</motion.div>
      </section>

      {/* Section Transferts Aéroport v2 - Optimisé conversion & mobile */}
      <section id="airports" className="airports-v2">
        <motion.div className="airports-v2__header" {...blockAnim}>
          <span className="airports-v2__number">{t('airports.number')}</span>
          <h2 className="airports-v2__title">{t('airports.title')}</h2>
          <p className="airports-v2__description">
            {t('airports.description')}
          </p>
        </motion.div>
        <motion.div className="airports-v2__list" {...blockAnim}>
          {airports.map((airport, index) => (
            <motion.article
              key={airport.id}
              className="airports-v2__card"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springConfig, delay: index * 0.08 }}
            >
              <div className="airports-v2__card-icon" aria-hidden="true">
                <Plane size={28} />
              </div>
              <div className="airports-v2__card-body">
                <div className="airports-v2__card-main">
                  <h3 className="airports-v2__card-title">{airport.name}</h3>
                  <span className="airports-v2__card-code">{airport.code}</span>
                </div>
                <span className="airports-v2__card-duration">{t('airports.durationFrom', { duration: airport.duration })}</span>
                {airport.price && <span className="airports-v2__card-price">{airport.price}</span>}
                <motion.button
                  type="button"
                  className="airports-v2__card-cta"
                  onClick={() => openWizard()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('airports.cta')}
                  <ArrowRight size={20} aria-hidden="true" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
        <motion.div className="airports-v2__cta" {...blockAnim}>{sectionCTA}</motion.div>
      </section>

      {/* Section Avis - Diaporama auto */}
      <section id="testimonials" className="testimonials-v2">
        <motion.div className="testimonials-v2__header" {...blockAnim}>
          <span className="testimonials-v2__number">{t('testimonials.number')}</span>
          <h2 className="testimonials-v2__title">{t('testimonials.title')}</h2>
          <p className="testimonials-v2__description">
            {t('testimonials.description')}
          </p>
        </motion.div>
        <motion.div className="testimonials-v2__slider" {...blockAnim}>
          <div className="testimonials-v2__track">
            <AnimatePresence mode="wait" initial={false}>
              {(() => {
                const testimonial = testimonials[testimonialV2Index]
                if (!testimonial) return null
                return (
                  <motion.article
                    key={testimonial.id}
                    className="testimonials-v2__card"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={springConfig}
                  >
                    <div className="testimonials-v2__card-rating" aria-label={t('testimonials.ariaStars', { count: testimonial.rating })}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="testimonials-v2__card-text">"{testimonial.text}"</blockquote>
                    <footer className="testimonials-v2__card-author">
                      <span className="testimonials-v2__card-name">{testimonial.name}</span>
                      <span className="testimonials-v2__card-role">{testimonial.role}</span>
                    </footer>
                  </motion.article>
                )
              })()}
            </AnimatePresence>
          </div>
          <div className="testimonials-v2__footer">
            <div className="testimonials-v2__dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`testimonials-v2__dot ${index === testimonialV2Index ? 'is-active' : ''}`}
                  onClick={() => setTestimonialV2Index(index)}
                  aria-label={t('testimonials.ariaSlide', { index: index + 1 })}
                  aria-current={index === testimonialV2Index ? 'true' : undefined}
                />
              ))}
            </div>
            <a
              href={t('testimonials.reviewsUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="testimonials-v2__see-all"
            >
              {t('testimonials.seeAllReviews')}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
        <motion.div className="testimonials-v2__cta" {...blockAnim}>{sectionCTA}</motion.div>
      </section>

      {/* Section Blog / Actualités - SEO & confiance */}
      <section id="blog" className="blog">
        <motion.div className="blog__header" {...blockAnim}>
          <span className="blog__number">{t('blog.number')}</span>
          <h2 className="blog__title">{t('blog.title')}</h2>
          <p className="blog__description">{t('blog.description')}</p>
        </motion.div>
        <motion.div className="blog__grid" {...blockAnim}>
          {blogArticles.map((article, index) => (
            <motion.article
              key={article.id}
              className="blog__card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ ...springConfig, delay: index * 0.06 }}
            >
              <span className="blog__card-category" aria-hidden="true">
                {t(`blog.categories.${article.category}`)}
              </span>
              <time className="blog__card-date" dateTime={article.date}>
                {new Date(article.date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })}
              </time>
              <h3 className="blog__card-title">{article.title}</h3>
              <p className="blog__card-excerpt">{article.excerpt}</p>
              <button
                type="button"
                className="blog__card-link"
                onClick={() => setBlogModalId(article.id)}
              >
                {t('blog.readMore')}
              </button>
            </motion.article>
          ))}
        </motion.div>
        <motion.div className="blog__cta" {...blockAnim}>{sectionCTA}</motion.div>
      </section>

      {/* Section FAQ */}
      <section id="faq" className="faq">
        <motion.div className="faq__list" {...blockAnim}>
          {(faqExpanded ? faqs : faqs.slice(0, 3)).map((faq, index) => (
            <motion.div
              key={faq.id}
              className="faq__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springConfig, delay: index * 0.1 }}
            >
              <button
                className={`faq__question ${openFAQ === faq.id ? 'is-open' : ''}`}
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                aria-expanded={openFAQ === faq.id}
              >
                <span className="faq__question-text">{faq.question}</span>
                <ChevronDown 
                  className="faq__question-icon"
                  size={20}
                />
              </button>
              <AnimatePresence>
                {openFAQ === faq.id && (
                  <motion.div
                    className="faq__answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springConfig}
                  >
                    <div className="faq__answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        {faqs.length > 3 && (
          <motion.div className="faq__more" {...blockAnim}>
            <button
              type="button"
              className="faq__more-btn"
              onClick={() => setFaqExpanded(!faqExpanded)}
              aria-expanded={faqExpanded}
            >
              {faqExpanded ? t('faq.showLess') : t('faq.showMore')}
            </button>
          </motion.div>
        )}
        <motion.div className="faq__cta" {...blockAnim}>{sectionCTA}</motion.div>
      </section>

      {/* Panier Flottant Minimaliste */}
      {cart.vehicle && (
        <div className="cart">
          <div className="cart__content">
            {cart.vehicle && (
              <div className="cart__item">
                <span className="cart__item-label">{t('cart.vehicle')}</span>
                <span className="cart__item-value">{cart.vehicle.name}</span>
                <button 
                  className="cart__item-remove"
                  onClick={() => removeFromCart('vehicle')}
                  aria-label={t('cart.ariaRemove')}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button className="cart__confirm" onClick={openWizard}>
              {t('cart.cta')}
              <ArrowRight size={16} />
            </button>
            </div>
          </div>
      )}

      {/* Page détail véhicule — design SCREEN_3 (hero 55%, contenu chevauchant, specs grid, CTA fixe) */}
      <AnimatePresence>
        {vehicleModal && (
          <motion.div
            className="vehicle-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springConfig}
          >
            <div className="vehicle-detail__hero">
              <button
                type="button"
                className="vehicle-detail__back"
                onClick={() => setVehicleModalId(null)}
                aria-label={t('common.back')}
              >
                <ArrowLeft size={20} />
              </button>
              <button type="button" className="vehicle-detail__favorite" aria-label="Favoris">
                <Star size={20} fill="currentColor" />
              </button>
              <div className="vehicle-detail__hero-badge" aria-hidden="true">
                <Car size={24} />
              </div>
              <div className="vehicle-detail__hero-image-wrap">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={vehicleModalPhotoIndex}
                    src={vehicleModal.images[vehicleModalPhotoIndex]}
                    alt=""
                    className="vehicle-detail__hero-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
              </div>
              <div className="vehicle-detail__dots">
                {vehicleModal.images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`vehicle-detail__dot ${index === vehicleModalPhotoIndex ? 'is-active' : ''}`}
                    onClick={() => setVehicleModalPhotoIndex(index)}
                    aria-label={`Photo ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="vehicle-detail__content">
              <h1 className="vehicle-detail__title">{vehicleModal.name}</h1>
              <div className="vehicle-detail__rating">
                <Star size={14} fill="currentColor" className="vehicle-detail__star" />
                <span>4.9</span>
              </div>
              <div className="vehicle-detail__specs">
                <div className="vehicle-detail__spec">
                  <Users size={24} aria-hidden="true" />
                  <span className="vehicle-detail__spec-value">{vehicleModal.specs.passengers}</span>
                  <span className="vehicle-detail__spec-label">{t('fleet.passengers')}</span>
                </div>
                <div className="vehicle-detail__spec">
                  <Package size={24} aria-hidden="true" />
                  <span className="vehicle-detail__spec-value">{vehicleModal.specs.luggage}</span>
                  <span className="vehicle-detail__spec-label">{t('fleet.luggage')}</span>
                </div>
                <div className="vehicle-detail__spec">
                  <Award size={24} aria-hidden="true" />
                  <span className="vehicle-detail__spec-value">{vehicleModal.vehicleClass}</span>
                  <span className="vehicle-detail__spec-label">{t('fleet.category')}</span>
                </div>
              </div>
              <p className="vehicle-detail__description">{vehicleModal.description}</p>
              {vehicleModal.content && (
                <div className="vehicle-detail__body">{vehicleModal.content}</div>
              )}
              <div className="vehicle-detail__price-block">
                <span className="vehicle-detail__price-label">{t('vehiclePage.rentPrice')}</span>
                <div className="vehicle-detail__price-row">
                  <span className="vehicle-detail__price">{vehicleModal.price}</span>
                  <span className="vehicle-detail__period">/ 1 {t('fleet.perDay')}</span>
                </div>
              </div>
            </div>

            <div className="vehicle-detail__cta-wrap">
              <motion.button
                type="button"
                className="vehicle-detail__cta"
                onClick={() => {
                  updateBookingData('vehicle', vehicleModal)
                  setVehicleModalId(null)
                  openWizard()
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('vehiclePage.book')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Mentions légales (plein écran + Revenir) */}
      <AnimatePresence>
        {legalModal === 'legal' && (
          <motion.div
            className="legal-modal legal-modal--fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springConfig}
          >
            <motion.div
              className="legal-modal__content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springConfig}
            >
              <button type="button" className="legal-modal__back" onClick={() => setLegalModal(null)} aria-label={t('common.back')}>
                <ArrowLeft size={22} aria-hidden="true" />
                <span>{t('common.back')}</span>
              </button>
              <h2 className="legal-modal__title">{t('legal.title')}</h2>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('legal.editorTitle')}</h3>
                <p className="legal-modal__block-text">{t('legal.editorContent')}</p>
              </div>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('legal.hostTitle')}</h3>
                <p className="legal-modal__block-text">{t('legal.hostContent')}</p>
              </div>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('legal.dpoTitle')}</h3>
                <p className="legal-modal__block-text">{t('legal.dpoContent')}</p>
              </div>
              <div className="legal-modal__block" id="privacy">
                <h3 className="legal-modal__block-title">{t('legal.privacyTitle')}</h3>
                <p className="legal-modal__block-text">{t('legal.privacyContent')}</p>
              </div>
              <div className="legal-modal__block" id="cookies">
                <h3 className="legal-modal__block-title">{t('legal.cookiesTitle')}</h3>
                <p className="legal-modal__block-text">{t('legal.cookiesContent')}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal CGV (même page, comme le wizard) */}
      <AnimatePresence>
        {legalModal === 'cgv' && (
          <motion.div
            className="legal-modal legal-modal--fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springConfig}
          >
            <motion.div
              className="legal-modal__content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springConfig}
            >
              <button type="button" className="legal-modal__back" onClick={() => setLegalModal(null)} aria-label={t('common.back')}>
                <ArrowLeft size={22} aria-hidden="true" />
                <span>{t('common.back')}</span>
              </button>
              <h2 className="legal-modal__title">{t('cgv.title')}</h2>
              <p className="legal-modal__intro">{t('cgv.intro')}</p>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('cgv.scope')}</h3>
                <p className="legal-modal__block-text">{t('cgv.scopeContent')}</p>
              </div>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('cgv.price')}</h3>
                <p className="legal-modal__block-text">{t('cgv.priceContent')}</p>
              </div>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('cgv.cancel')}</h3>
                <p className="legal-modal__block-text">{t('cgv.cancelContent')}</p>
              </div>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('cgv.responsibility')}</h3>
                <p className="legal-modal__block-text">{t('cgv.responsibilityContent')}</p>
              </div>
              <div className="legal-modal__block">
                <h3 className="legal-modal__block-title">{t('cgv.disputes')}</h3>
                <p className="legal-modal__block-text">{t('cgv.disputesContent')}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal article blog (plein écran + Revenir) */}
      <AnimatePresence>
        {blogModalId && (() => {
          const article = blogArticles.find((a) => a.id === blogModalId)
          if (!article) return null
          return (
            <motion.div
              className="blog-modal blog-modal--fullscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springConfig}
            >
              <motion.div
                className="blog-modal__content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={springConfig}
              >
                <button
                  type="button"
                  className="blog-modal__back"
                  onClick={() => setBlogModalId(null)}
                  aria-label={t('common.back')}
                >
                  <ArrowLeft size={22} aria-hidden="true" />
                  <span>{t('common.back')}</span>
                </button>
                <span className="blog-modal__category">{t(`blog.categories.${article.category}`)}</span>
                <time className="blog-modal__date" dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <h1 className="blog-modal__title">{article.title}</h1>
                <p className="blog-modal__excerpt">{article.excerpt}</p>
                {article.content && <div className="blog-modal__body">{article.content}</div>}
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* Modal Service (détail service, plein écran) */}
      <AnimatePresence>
        {serviceModalId && (() => {
          const service = services.find((s) => s.id === serviceModalId)
          if (!service) return null
          return (
            <motion.div
              className="service-modal service-modal--fullscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springConfig}
            >
              <motion.div
                className="service-modal__content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={springConfig}
              >
                <button
                  type="button"
                  className="service-modal__back"
                  onClick={() => setServiceModalId(null)}
                  aria-label={t('common.back')}
                >
                  <ArrowLeft size={22} aria-hidden="true" />
                  <span>{t('common.back')}</span>
                </button>
                <h2 className="service-modal__title">{service.name}</h2>
                {service.content && <div className="service-modal__body">{service.content}</div>}
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* BookingWizard Overlay */}
      <AnimatePresence>
        {wizardOpen && (
          <motion.div 
            className="booking-wizard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springConfig}
          >
            <motion.div 
              className="booking-wizard__backdrop" 
              onClick={closeWizard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
            <motion.div 
              className="booking-wizard__container"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={springConfig}
            >
            {/* Header avec progression */}
            <div className="booking-wizard__header">
              <button className="booking-wizard__close" onClick={closeWizard}>
                <X size={24} />
                  </button>
              <div className="booking-wizard__progress">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`booking-wizard__progress-step ${step <= currentStep ? 'is-active' : ''} ${step < currentStep ? 'is-completed' : ''}`}
                  >
                    <div className="booking-wizard__progress-dot"></div>
                    {step < currentStep && <div className="booking-wizard__progress-line"></div>}
                  </div>
                ))}
              </div>
              <div className="booking-wizard__step-indicator">
                {t('wizard.stepIndicator', { current: currentStep, total: 5 })}
                </div>
              </div>

            {/* Contenu des étapes */}
            <div className="booking-wizard__content">
              <AnimatePresence mode="wait">
                {/* Étape 1 : Sélection Véhicule */}
                {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    className="booking-wizard__step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={springConfig}
                  >
                  <h2 className="booking-wizard__step-title">{t('wizard.stepVehicleTitle')}</h2>
                  <p className="booking-wizard__step-subtitle">{t('wizard.stepVehicleSubtitle')}</p>
                  
                  <div className="booking-wizard__luggage-input">
                    <input 
                      type="number"
                      min="0"
                      max="10"
                      value={bookingData.luggage || ''}
                      onChange={(e) => updateBookingData('luggage', parseInt(e.target.value) || 0)}
                      placeholder={t('wizard.luggagePlaceholder')}
                      className="booking-wizard__input"
                    />
                  </div>

                  {bookingData.luggage > 0 && (
                    <div className="booking-wizard__recommendation">
                      <span className="booking-wizard__recommendation-text">
                        {t('wizard.recommendation', { type: bookingData.luggage <= 2 ? t('wizard.recommendationTypes.berline') : bookingData.luggage <= 4 ? t('wizard.recommendationTypes.suv') : t('wizard.recommendationTypes.van') })}
                      </span>
                  </div>
                  )}

                  <div className="booking-wizard__vehicles">
                    {vehicles.map((vehicle) => {
                      const isSelected = bookingData.vehicle?.id === vehicle.id
                      const recommended = isRecommended(vehicle.id)
                      
                      return (
                        <div
                          key={vehicle.id}
                          className={`booking-wizard__vehicle-card ${isSelected ? 'is-selected' : ''} ${recommended ? 'is-recommended' : ''}`}
                          onClick={() => updateBookingData('vehicle', vehicle)}
                        >
                          <div 
                            className="booking-wizard__vehicle-image"
                            style={{ backgroundImage: `url(${vehicle.images[0]})` }}
                          >
                            <div className="booking-wizard__vehicle-overlay"></div>
                            {recommended && (
                              <div className="booking-wizard__vehicle-badge">
                                {t('wizard.badgeIA')}
                  </div>
                            )}
                </div>
                          <div className="booking-wizard__vehicle-content">
                            <h3 className="booking-wizard__vehicle-name">{vehicle.name}</h3>
                            <p className="booking-wizard__vehicle-tagline">{vehicle.tagline}</p>
                            <div className="booking-wizard__vehicle-specs">
                              <span>{vehicle.specs.passengers} {t('fleet.passengers')}</span>
                              <span>•</span>
                              <span>{vehicle.specs.luggage} {t('fleet.luggage')}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  </motion.div>
                )}

                {/* Étape 2 : Sélection Service */}
                {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    className="booking-wizard__step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={springConfig}
                  >
                  <h2 className="booking-wizard__step-title">{t('wizard.stepServiceTitle')}</h2>
                  <p className="booking-wizard__step-subtitle">{t('wizard.stepServiceSubtitle')}</p>
                  
                  <div className="booking-wizard__services">
                    {services.map((service) => {
                      const isSelected = bookingData.service?.id === service.id
                      
                      return (
                        <div
                          key={service.id}
                          className={`booking-wizard__service-card ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => updateBookingData('service', service)}
                        >
                          <div 
                            className="booking-wizard__service-image"
                            style={{ backgroundImage: `url(${service.image})` }}
                          >
                            <div className="booking-wizard__service-overlay"></div>
                            <div className="booking-wizard__service-icon">
                              {service.icon === '✈️' && <Plane size={32} />}
                              {service.icon === '💼' && <Briefcase size={32} />}
                              {service.icon === '💍' && <Heart size={32} />}
                              {service.icon === '⭐' && <Sparkles size={32} />}
                              {service.icon === 'map' && <MapPin size={32} />}
              </div>
            </div>
                          <div className="booking-wizard__service-content">
                            <h3 className="booking-wizard__service-name">{service.name}</h3>
                            <p className="booking-wizard__service-description">{service.description}</p>
          </div>
                        </div>
                      )
                    })}
                  </div>
                  </motion.div>
                )}

                {/* Étape 3 : Date & Heure */}
                {currentStep === 3 && (
                  <motion.div 
                    key="step3"
                    className="booking-wizard__step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={springConfig}
                  >
                  <h2 className="booking-wizard__step-title">{t('wizard.stepDateTimeTitle')}</h2>
                  <p className="booking-wizard__step-subtitle">{t('wizard.stepDateTimeSubtitle')}</p>
                  
                  <div className="booking-wizard__datetime">
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">{t('wizard.date')}</label>
                <input 
                  type="date" 
                        value={bookingData.date}
                        onChange={(e) => updateBookingData('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">{t('wizard.time')}</label>
                <input 
                  type="time" 
                        value={bookingData.time}
                        onChange={(e) => updateBookingData('time', e.target.value)}
                        className="booking-wizard__input"
                />
              </div>
                  </div>
                  </motion.div>
                )}

                {/* Étape 4 : Informations Passager */}
                {currentStep === 4 && (
                  <motion.div 
                    key="step4"
                    className="booking-wizard__step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={springConfig}
                  >
                  <h2 className="booking-wizard__step-title">{t('wizard.stepInfoTitle')}</h2>
                  <p className="booking-wizard__step-subtitle">{t('wizard.stepInfoSubtitle')}</p>
                  
                  <div className="booking-wizard__form">
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">{t('wizard.firstName')}</label>
                <input 
                  type="text" 
                        value={bookingData.passenger.firstName}
                        onChange={(e) => updateBookingData('passenger.firstName', e.target.value)}
                        placeholder={t('wizard.firstNamePlaceholder')}
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">{t('wizard.lastName')}</label>
                      <input
                        type="text"
                        value={bookingData.passenger.lastName}
                        onChange={(e) => updateBookingData('passenger.lastName', e.target.value)}
                        placeholder={t('wizard.lastNamePlaceholder')}
                        className="booking-wizard__input"
                      />
                    </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">{t('wizard.phone')}</label>
                <input 
                  type="tel" 
                        value={bookingData.passenger.phone}
                        onChange={(e) => updateBookingData('passenger.phone', e.target.value)}
                  placeholder={t('wizard.phonePlaceholder')} 
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">{t('wizard.email')}</label>
                <input 
                  type="email" 
                        value={bookingData.passenger.email}
                        onChange={(e) => updateBookingData('passenger.email', e.target.value)}
                  placeholder={t('wizard.emailPlaceholder')} 
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">{t('wizard.specialRequests')}</label>
                <textarea 
                        value={bookingData.passenger.specialRequests}
                        onChange={(e) => updateBookingData('passenger.specialRequests', e.target.value)}
                        placeholder={t('wizard.specialRequestsPlaceholder')}
                        className="booking-wizard__textarea"
                  rows="3" 
                />
              </div>
              </div>
                  </motion.div>
                )}

                {/* Étape 5 : Récapitulatif */}
                {currentStep === 5 && (
                  <motion.div 
                    key="step5"
                    className="booking-wizard__step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={springConfig}
                  >
                  <h2 className="booking-wizard__step-title">{t('wizard.stepSummaryTitle')}</h2>
                  <p className="booking-wizard__step-subtitle">{t('wizard.stepSummarySubtitle')}</p>
                  
                  <div className="booking-wizard__summary">
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">{t('wizard.summaryVehicle')}</span>
                      <span className="booking-wizard__summary-value">{bookingData.vehicle?.name || t('wizard.notSelected')}</span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">{t('wizard.summaryService')}</span>
                      <span className="booking-wizard__summary-value">
                        {bookingData.service?.name || t('wizard.notSelected')}
                      </span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">{t('wizard.summaryDate')}</span>
                      <span className="booking-wizard__summary-value">{bookingData.date || t('wizard.notFilled')}</span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">{t('wizard.summaryTime')}</span>
                      <span className="booking-wizard__summary-value">{bookingData.time || t('wizard.notFilled')}</span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">{t('wizard.summaryLuggage')}</span>
                      <span className="booking-wizard__summary-value">{bookingData.luggage || 0}</span>
                    </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">{t('wizard.summaryClient')}</span>
                      <span className="booking-wizard__summary-value">
                        {bookingData.passenger.firstName} {bookingData.passenger.lastName}
                      </span>
                    </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">{t('wizard.summaryContact')}</span>
                      <span className="booking-wizard__summary-value">
                        {bookingData.passenger.phone} / {bookingData.passenger.email}
                      </span>
                    </div>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
                  </div>

            {/* Navigation */}
            <div className="booking-wizard__navigation">
              {currentStep > 1 && (
                <button className="booking-wizard__btn booking-wizard__btn--secondary" onClick={prevStep}>
                  <ChevronLeft size={20} />
                  {t('wizard.prev')}
                      </button>
              )}
              <div className="booking-wizard__navigation-spacer"></div>
              {currentStep < 5 ? (
                      <button 
                  className="booking-wizard__btn booking-wizard__btn--primary" 
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !bookingData.vehicle) ||
                    (currentStep === 2 && !bookingData.service) ||
                    (currentStep === 3 && (!bookingData.date || !bookingData.time))
                  }
                >
                  {t('wizard.next')}
                  <ArrowRight size={20} />
                      </button>
              ) : (
                      <button 
                  className="booking-wizard__btn booking-wizard__btn--primary" 
                  onClick={handleConfirmBooking}
                      >
                  {t('wizard.confirm')}
                  <ArrowRight size={20} />
                      </button>
              )}
                    </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Moderne 2026 */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springConfig}
      >
        <div className="footer__container">
          {/* Section principale */}
          <div className="footer__main">
            {/* Brand & Description */}
            <motion.div 
              className="footer__brand"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springConfig, delay: 0.1 }}
            >
              <h3 className="footer__brand-name">{t('footer.brandName')}</h3>
              <p className="footer__brand-tagline">{t('footer.brandTagline')}</p>
              <p className="footer__brand-description">
                {t('footer.brandDescription')}
              </p>
            </motion.div>

            {/* Navigation Links */}
            <motion.div 
              className="footer__nav"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <h4 className="footer__nav-title">{t('footer.navTitle')}</h4>
              <ul className="footer__nav-list">
                <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>{t('nav.home')}</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>{t('nav.about')}</a></li>
                <li><a href="#fleet" onClick={(e) => { e.preventDefault(); scrollToSection('fleet'); }}>{t('nav.fleet')}</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>{t('nav.services')}</a></li>
                <li><a href="#airports" onClick={(e) => { e.preventDefault(); scrollToSection('airports'); }}>{t('nav.airports')}</a></li>
                <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>{t('nav.testimonials')}</a></li>
                <li><a href="#blog" onClick={(e) => { e.preventDefault(); scrollToSection('blog'); }}>{t('nav.blog')}</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>{t('nav.faq')}</a></li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="footer__contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <h4 className="footer__contact-title">{t('footer.contactTitle')}</h4>
              <ul className="footer__contact-list">
                <li>
                  <a href="tel:+33605998211" className="footer__contact-item">
                    <Phone size={18} />
                    <span>{t('footer.phoneDisplay')}</span>
                  </a>
                </li>
                <li>
                  <a href="#contact-email" className="footer__contact-item" onClick={(e) => e.preventDefault()}>
                    <Mail size={18} />
                    <span>{t('footer.emailDisplay')}</span>
                  </a>
                </li>
                <li>
                  <div className="footer__contact-item">
                    <MapPin size={18} />
                    <span>{t('footer.zone')}</span>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Villes desservies */}
            {footerCities.length > 0 && (
              <motion.div 
                className="footer__cities"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={springConfig}
              >
                <h4 className="footer__cities-title">{t('footer.citiesTitle')}</h4>
                <div className="footer__cities-list">
                  {footerCities.map((city, index) => (
                    <span key={index} className="footer__cities-pill">{city}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Social Media & CTA */}
            <motion.div 
              className="footer__social"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <h4 className="footer__social-title">{t('footer.socialTitle')}</h4>
              <div className="footer__social-links">
                <motion.a 
                  href="https://instagram.com/fleetprivee" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a 
                  href="https://facebook.com/fleetprivee" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a 
                  href="https://linkedin.com/company/fleetprivee" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={20} />
                </motion.a>
              </div>
              <motion.button 
                className="footer__cta-button"
                onClick={openWizard}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{t('footer.cta')}</span>
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div 
            className="footer__bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={springConfig}
          >
            <div className="footer__bottom-content">
              <div className="footer__copyright">
                <p>{t('footer.copyright')}</p>
              </div>
              <div className="footer__legal">
                <button type="button" className="footer__legal-link" onClick={() => setLegalModal('legal')}>{t('footer.legal')}</button>
                <span className="footer__separator">•</span>
                <button type="button" className="footer__legal-link" onClick={() => setLegalModal('cgv')}>{t('footer.cgv')}</button>
                <span className="footer__separator">•</span>
                <button type="button" className="footer__legal-link" onClick={() => setLegalModal('legal')}>{t('footer.privacy')}</button>
                <span className="footer__separator">•</span>
                <button type="button" className="footer__legal-link" onClick={() => setLegalModal('legal')}>{t('footer.cookies')}</button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Bouton fixe Contact WhatsApp */}
      <a
        href="https://wa.me/33605998211"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label={t('whatsapp.ariaLabel')}
      >
        <span className="whatsapp-fab__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </span>
        <span className="whatsapp-fab__label">{t('whatsapp.contactButton')}</span>
      </a>
    </div>
  )
}

export default App
