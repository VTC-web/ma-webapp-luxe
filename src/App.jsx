import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft, ArrowRight, Play, Pause, X, Plus, Minus, Plane, Star, ChevronDown, Users, Package, Sparkles, Briefcase, Heart, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Clock, Shield, Award, Home, Car, Calendar, ArrowLeftRight } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import AnimatedCounter from './components/AnimatedCounter'
import './index.css'
import './styles.css'

function App() {
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
  const [testimonialV2Index, setTestimonialV2Index] = useState(0)
  const [serviceIndex, setServiceIndex] = useState(0)
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [heroAddressFrom, setHeroAddressFrom] = useState('')
  const [heroAddressTo, setHeroAddressTo] = useState('')
  const [heroPassengers, setHeroPassengers] = useState(1)
  const [heroLuggage, setHeroLuggage] = useState(0)
  const [aboutReadMore, setAboutReadMore] = useState(false)
  const heroRef = useRef(null)
  const menuRef = useRef(null)
  const hamburgerRef = useRef(null)
  const serviceViewportRef = useRef(null)

  // Données
  const vehicles = [
    {
      id: 'mercedes-e-class',
      name: 'Mercedes Classe E',
      tagline: 'ÉLÉGANCE ET PERFORMANCE',
      category: 'berline',
      vehicleClass: 'Business',
      specs: { passengers: 4, luggage: 2, power: '320 HP', speed: '220 KM/H', horsepower: 320 },
      images: [
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
      ],
      price: 'À partir de 100€',
      description: 'Business - rendez-vous d\'affaires, transferts aéroport',
      occasion: 'Idéal pour les rendez-vous d\'affaires, les événements professionnels et les transferts aéroport. Son élégance discrète et son confort premium en font le choix parfait pour les déplacements urbains et interurbains en toute sérénité.'
    },
    {
      id: 'mercedes-s680',
      name: 'Mercedes Classe S',
      tagline: 'L\'EXCELLENCE ABSOLUE',
      category: 'suv',
      vehicleClass: 'Prestige',
      specs: { passengers: 4, luggage: 3, power: '450 HP', speed: '250 KM/H', horsepower: 450 },
      images: [
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
      ],
      price: 'À partir de 120€',
      description: 'Prestige - mariages, galas, événements VIP',
      occasion: 'Parfait pour les occasions prestigieuses, les mariages, les galas et les événements VIP. Son intérieur somptueux et ses technologies de pointe offrent une expérience de luxe inégalée pour vos moments les plus importants.'
    },
    {
      id: 'van-luxe',
      name: 'Mercedes Classe V',
      tagline: 'CONFORT MAXIMAL POUR GROUPES',
      category: 'van',
      vehicleClass: 'Sedan',
      specs: { passengers: 8, luggage: 6, power: '280 HP', speed: '180 KM/H', horsepower: 280 },
      images: [
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
      ],
      price: 'À partir de 150€',
      description: 'Sedan - groupes, familles, transferts avec bagages',
      occasion: 'Conçu pour les groupes, les familles nombreuses et les événements nécessitant un transport spacieux. Idéal pour les sorties en groupe, les transferts aéroport avec bagages volumineux et les déplacements confortables à plusieurs.'
    }
  ]

  const services = [
    {
      id: 'transfert-aeroport',
      name: 'Transfert Aéroport',
      icon: '✈️',
      description: 'Service premium de transfert vers tous les aéroports parisiens avec accueil personnalisé et suivi en temps réel.',
      features: ['Accueil avec pancarte', 'Attente gratuite 30min', 'Rafraîchissements', 'Suivi GPS'],
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
    },
    {
      id: 'evenement-corporate',
      name: 'Événement Corporate',
      icon: '💼',
      description: 'Transport VIP pour vos événements d\'affaires, conférences et rendez-vous professionnels avec chauffeur dédié.',
      features: ['Chauffeur professionnel', 'WiFi haut débit', 'Espace de travail', 'Service discret'],
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
    },
    {
      id: 'mariage-prestige',
      name: 'Mariage & Prestige',
      icon: '💍',
      description: 'Service de luxe pour vos moments les plus importants : mariages, galas et événements prestigieux.',
      features: ['Décoration personnalisée', 'Champagne offert', 'Service 24/7', 'Photographe optionnel'],
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
    },
    {
      id: 'service-sur-mesure',
      name: 'Service sur Mesure',
      icon: '⭐',
      description: 'Création d\'un service personnalisé adapté à vos besoins spécifiques et à vos exigences particulières.',
      features: ['Itinéraire personnalisé', 'Arrêts multiples', 'Devis gratuit', 'Service premium'],
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
    }
  ]

  // Données Transferts Aéroport
  const airports = [
    { id: 'cdg', name: 'CDG', code: 'CDG', duration: '45 min' },
    { id: 'orly', name: 'Orly', code: 'ORY', duration: '30 min' },
    { id: 'le-bourget', name: 'Le Bourget', code: 'LBG', duration: '25 min' }
  ]

  // Données Avis Clients
  const testimonials = [
    {
      id: 1,
      name: 'Sophie M.',
      role: 'CEO, TechCorp',
      text: 'Service exceptionnel. Ponctualité parfaite et véhicule impeccable. Je recommande sans hésitation.',
      rating: 5
    },
    {
      id: 2,
      name: 'Marc D.',
      role: 'Investisseur',
      text: 'Le niveau de service est au-delà de mes attentes. Chauffeur professionnel et discret.',
      rating: 5
    },
    {
      id: 3,
      name: 'Isabelle L.',
      role: 'Directrice Artistique',
      text: 'Expérience premium de bout en bout. Un must pour les déplacements professionnels.',
      rating: 5
    }
  ]

  // Données FAQ
  const faqs = [
    {
      id: 1,
      question: 'Comment réserver un véhicule ?',
      answer: 'Utilisez notre formulaire de réservation en ligne. Sélectionnez votre véhicule, votre itinéraire, date et heure, puis complétez vos informations. La confirmation se fait via WhatsApp.'
    },
    {
      id: 2,
      question: 'Quels sont les modes de paiement acceptés ?',
      answer: 'Nous acceptons le paiement à bord, par lien de paiement sécurisé, ou par carte bancaire. Tous les détails vous seront communiqués lors de la confirmation.'
    },
    {
      id: 3,
      question: 'Peut-on modifier une réservation ?',
      answer: 'Oui, contactez-nous au moins 24h avant votre trajet pour toute modification. Nous ferons notre maximum pour répondre à votre demande.'
    },
    {
      id: 4,
      question: 'Les véhicules sont-ils disponibles 24/7 ?',
      answer: 'Oui, notre service est disponible 24h/24 et 7j/7 pour répondre à tous vos besoins de transport premium.'
    }
  ]


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
    // Générer message WhatsApp
    const whatsappNumber = '+33605998211'
    let message = 'RÉSERVATION\n\n'
    message += `Véhicule : ${bookingData.vehicle?.name || 'Non sélectionné'}\n`
    message += `Service : ${bookingData.service?.name || 'Non sélectionné'}\n`
    message += `Date : ${bookingData.date || 'Non renseigné'}\n`
    message += `Heure : ${bookingData.time || 'Non renseigné'}\n`
    message += `Bagages : ${bookingData.luggage || 0}\n\n`
    message += `Client : ${bookingData.passenger.firstName} ${bookingData.passenger.lastName}\n`
    message += `Téléphone : ${bookingData.passenger.phone}\n`
    message += `Email : ${bookingData.passenger.email}\n`
    if (bookingData.passenger.specialRequests) {
      message += `Demandes spéciales : ${bookingData.passenger.specialRequests}\n`
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    closeWizard()
  }

  return (
    <div className="app">
      {/* Hero Section - Design 2026 */}
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
              {/* Logo */}
              <div className="hero__top-bar-logo">
                <img 
                  src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" 
                  alt="SafenessTransport Logo" 
                  className="hero__top-bar-logo-image"
                />
                <span>SafenessTransport</span>
              </div>

            {/* Menu Navigation Desktop */}
            <nav className="hero__top-bar-menu">
              <a 
                href="#about" 
                className="hero__top-bar-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                À Propos
              </a>
              <a 
                href="#fleet" 
                className="hero__top-bar-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('fleet'); }}
              >
                Flotte
              </a>
              <a 
                href="#services" 
                className="hero__top-bar-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
              >
                Services
              </a>
              <a 
                href="#airports" 
                className="hero__top-bar-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('airports'); }}
              >
                Aéroports
              </a>
            </nav>

            {/* Menu Hamburger Mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a 
                href="tel:+33605998211"
                className="hero__top-bar-phone"
                aria-label="Appeler"
              >
                <Phone size={20} />
              </a>
              <button 
                ref={hamburgerRef}
                className="hero__top-bar-hamburger"
                onClick={() => setMenuExpanded(!menuExpanded)}
                aria-label="Menu"
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
                  <span>Accueil</span>
                </a>
                <a 
                  href="#about" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); scrollToSection('about'); setMenuExpanded(false); }}
                >
                  <Users size={20} />
                  <span>À Propos</span>
                </a>
                <a 
                  href="#services" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); scrollToSection('services'); setMenuExpanded(false); }}
                >
                  <Briefcase size={20} />
                  <span>Services</span>
                </a>
                <a 
                  href="#fleet" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); scrollToSection('fleet'); setMenuExpanded(false); }}
                >
                  <Car size={20} />
                  <span>Flottes</span>
                </a>
                <a 
                  href="#contact" 
                  className="hero__top-bar-expanded-link"
                  onClick={(e) => { e.preventDefault(); const footer = document.querySelector('.footer'); if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' }); setMenuExpanded(false); }}
                >
                  <Mail size={20} />
                  <span>Contact</span>
                </a>
                <button 
                  className="hero__top-bar-expanded-link hero__top-bar-expanded-link--cta"
                  onClick={() => { openWizard(); setMenuExpanded(false); }}
                >
                  <Calendar size={16} />
                  <span>Réserver</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hero__container">
          {/* Image de fond pleine hauteur */}
          <div className="hero__background-image-wrapper">
            <img 
              src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" 
              alt="Mercedes S-Class" 
              className="hero__background-image"
            />
            <div className="hero__background-overlay"></div>
          </div>
          
          {/* Hero “app-like” */}
          <div className="hero__app">
            <motion.div
              className="hero__app-media"
              initial={{ opacity: 0, scale: 0.98, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={springConfig}
            >
              <div className="hero__app-media-bg" aria-hidden="true" />
              <div className="hero__app-media-badge" aria-hidden="true">
                <Car size={18} />
              </div>
              <img
                className="hero__app-media-car"
                src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg"
                alt="Véhicule premium"
              />
              <div className="hero__app-chip">Chauffeur VIP</div>
            </motion.div>

            <motion.div
              className="hero__app-body"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.08 }}
            >
              <p className="hero__app-eyebrow">L’excellence depuis 2018</p>
              <h1 className="hero__app-title">
                Transport avec chauffeur à Paris
              </h1>
              <p className="hero__app-subtitle">
                Paris & Île‑de‑France — transferts aéroport, événements, mise à disposition.
              </p>
            </motion.div>

            <motion.div
              className="hero__form-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.12 }}
            >
              <div className="hero__form-addresses">
                <div className="hero__form-field">
                  <label className="hero__form-label" htmlFor="hero-address-from">Départ</label>
                  <input
                    id="hero-address-from"
                    type="text"
                    className="hero__form-input"
                    placeholder="Adresse de départ"
                    value={heroAddressFrom}
                    onChange={(e) => setHeroAddressFrom(e.target.value)}
                  />
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  className="hero__form-swap-icon"
                  onClick={swapHeroAddresses}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swapHeroAddresses(); } }}
                  aria-label="Échanger les adresses"
                >
                  <ArrowLeftRight size={18} />
                </span>
                <div className="hero__form-field">
                  <label className="hero__form-label" htmlFor="hero-address-to">Arrivée</label>
                  <input
                    id="hero-address-to"
                    type="text"
                    className="hero__form-input"
                    placeholder="Adresse d'arrivée"
                    value={heroAddressTo}
                    onChange={(e) => setHeroAddressTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="hero__form-row">
                <div className="hero__form-field">
                  <label className="hero__form-label" htmlFor="hero-passengers">Passagers</label>
                  <input
                    id="hero-passengers"
                    type="number"
                    min={1}
                    max={8}
                    className="hero__form-input"
                    placeholder="Passagers"
                    value={heroPassengers || ''}
                    onChange={(e) => setHeroPassengers(parseInt(e.target.value, 10) || 1)}
                  />
                </div>
                <div className="hero__form-field">
                  <label className="hero__form-label" htmlFor="hero-luggage">Bagages</label>
                  <input
                    id="hero-luggage"
                    type="number"
                    min={0}
                    max={10}
                    className="hero__form-input"
                    placeholder="Bagages"
                    value={heroLuggage === 0 ? '' : heroLuggage}
                    onChange={(e) => setHeroLuggage(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>
              <motion.button
                type="button"
                className="hero__app-cta hero__form-cta"
                onClick={openWizardAtVehicles}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Réserver un chauffeur"
              >
                <span className="hero__app-cta-icon" aria-hidden="true">
                  <Car size={18} />
                </span>
                <span className="hero__app-cta-text">Réserver un chauffeur</span>
                <span className="hero__app-cta-arrows" aria-hidden="true">
                  ›››
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        </section>

      {/* Section Services - Prestations Premium */}
      <motion.section
        id="services"
        className="services"
        initial={{ opacity: 0, x: -56 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 80, damping: 22 }}
      >
        <div className="services__header">
          <p className="services__subtitle">L'excellence en mouvement</p>
          <div className="services__header-content">
            <span className="services__number">01</span>
            <h2 className="services__title">Nos Services</h2>
          </div>
          <p className="services__description">
            Découvrez notre gamme complète de services premium, conçus pour répondre à tous vos besoins de transport avec chauffeur privé.
          </p>
          <motion.button
            className="services__header-cta"
            onClick={openWizard}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Réserver
            <ArrowRight size={18} />
          </motion.button>
        </div>

        <div className="services__catalog">
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
                  aria-label="Service précédent"
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
                  aria-label="Service suivant"
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
                  aria-label={`Service ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Section À Propos */}
      <motion.section
        id="about"
        className="about"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 70, damping: 24 }}
      >
        <div className="about__header">
          <div className="about__header-content">
            <span className="about__number">02</span>
            <h2 className="about__title">À Propos</h2>
          </div>
          <p className="about__description">
            Excellence et discrétion depuis 2018
            {' '}
            <button
              type="button"
              className="about__read-more"
              onClick={() => setAboutReadMore(!aboutReadMore)}
              aria-expanded={aboutReadMore}
            >
              {aboutReadMore ? 'Lire moins' : 'Lire plus'}
            </button>
          </p>
          {aboutReadMore && (
            <p className="about__paragraph about__paragraph--expandable">
              SafenessTransport est votre partenaire de confiance pour tous vos déplacements d'exception.
              {' '}
              Depuis 2018, nous avons perfectionné l'art du transport privé avec chauffeur,
              offrant une expérience sur-mesure qui allie élégance, ponctualité et discrétion absolue.
            </p>
          )}
        </div>

        <div className="about__content">
          <div className="about__text">
            <div className="about__qualities">
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Star size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">Excellence</h3>
                  <p className="about__quality-description">
                    Véhicules premium entretenus, chauffeurs formés et accueil soigné : 
                    nous visons la perfection à chaque trajet pour vous offrir une expérience digne de vos attentes.
                  </p>
                </div>
              </div>
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Shield size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">Discrétion</h3>
                  <p className="about__quality-description">
                    Confidentialité totale et respect de votre vie privée. 
                    Que ce soit pour un déplacement professionnel ou personnel, votre trajet reste strictement confidentiel.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about__image-wrapper">
            <img 
              src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg"
              alt="SafenessTransport - Service premium de transport"
              className="about__image"
              loading="lazy"
            />
          </div>

          <div className="about__stats">
            {[
              { value: 6, suffix: '+', label: "Années d'excellence", isNum: true },
              { value: 2500, suffix: '+', label: 'Clients fidèles', isNum: true },
              { value: '24/7', suffix: '', label: 'Service disponible', isNum: false },
              { value: 98, suffix: '%', label: 'Taux de satisfaction', isNum: true }
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
              </div>
      </motion.section>

      {/* Section Flotte - Cartes optimisées conversion & mobile */}
      <motion.section
        id="fleet"
        className="fleet-v2"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
      >
        <div className="fleet-v2__header">
          <span className="fleet-v2__number">03</span>
          <h2 className="fleet-v2__title">Notre Flotte</h2>
          <p className="fleet-v2__description">
            Véhicules premium avec chauffeur. Choisissez le vôtre et réservez en quelques secondes.
          </p>
        </div>
        <div className="fleet-v2__list">
          {vehicles.map((vehicle, index) => (
            <motion.article
              key={vehicle.id}
              className="fleet-v2__card"
              initial={{ opacity: 0, y: 20, x: index % 2 === 0 ? -16 : 16 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springConfig, delay: index * 0.07 }}
            >
              <div className="fleet-v2__card-image-wrap">
                <div
                  className="fleet-v2__card-image"
                  style={{ backgroundImage: `url(${vehicle.images[0]})` }}
                  aria-hidden="true"
                />
                <div className="fleet-v2__card-image-overlay" />
                <span className="fleet-v2__card-badge">{vehicle.vehicleClass}</span>
              </div>
              <div className="fleet-v2__card-body">
                <h3 className="fleet-v2__card-title">{vehicle.name}</h3>
                <p className="fleet-v2__card-desc">{vehicle.description}</p>
                <div className="fleet-v2__card-specs">
                  <span className="fleet-v2__card-spec">
                    <Users size={18} aria-hidden="true" />
                    {vehicle.specs.passengers} passagers
                  </span>
                  <span className="fleet-v2__card-spec">
                    <Package size={18} aria-hidden="true" />
                    {vehicle.specs.luggage} bagages
                  </span>
                </div>
                <div className="fleet-v2__card-footer">
                  <span className="fleet-v2__card-price">{vehicle.price}</span>
                  <motion.button
                    type="button"
                    className="fleet-v2__card-cta"
                    onClick={() => {
                      updateBookingData('vehicle', vehicle)
                      openWizard()
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Réserver
                    <ArrowRight size={20} aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Section Transferts Aéroport v2 - Optimisé conversion & mobile */}
      <motion.section
        id="airports"
        className="airports-v2"
        initial={{ opacity: 0, x: 56 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 80, damping: 22 }}
      >
        <div className="airports-v2__header">
          <span className="airports-v2__number">04</span>
          <h2 className="airports-v2__title">Transferts Aéroport</h2>
          <p className="airports-v2__description">
            CDG, Orly, Le Bourget — accueil personnalisé et véhicule premium. Réservez en quelques secondes.
          </p>
        </div>
        <div className="airports-v2__list">
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
                <span className="airports-v2__card-duration">~{airport.duration} depuis Paris</span>
                <motion.button
                  type="button"
                  className="airports-v2__card-cta"
                  onClick={() => openWizard()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Réserver
                  <ArrowRight size={20} aria-hidden="true" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Section Avis - Diaporama auto */}
      <motion.section
        id="testimonials"
        className="testimonials-v2"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 75, damping: 23 }}
      >
        <div className="testimonials-v2__header">
          <span className="testimonials-v2__number">05</span>
          <h2 className="testimonials-v2__title">Ils nous font confiance</h2>
          <p className="testimonials-v2__description">
            Témoignages de clients satisfaits par notre service de transport premium.
          </p>
        </div>
        <div className="testimonials-v2__slider">
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
                    <div className="testimonials-v2__card-rating" aria-label={`${testimonial.rating} étoiles`}>
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
          <div className="testimonials-v2__dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`testimonials-v2__dot ${index === testimonialV2Index ? 'is-active' : ''}`}
                onClick={() => setTestimonialV2Index(index)}
                aria-label={`Avis ${index + 1}`}
                aria-current={index === testimonialV2Index ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section FAQ */}
      <motion.section
        id="faq"
        className="faq"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 85, damping: 21 }}
      >
        <div className="faq__header">
          <div className="faq__header-content">
            <span className="faq__number">06</span>
            <h2 className="faq__title">Questions Fréquentes</h2>
          </div>
          <p className="faq__description">
            Trouvez les réponses aux questions les plus courantes sur nos services de transport premium.
          </p>
        </div>

        <div className="faq__list">
          {faqs.map((faq, index) => (
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
        </div>
      </motion.section>

      {/* Panier Flottant Minimaliste */}
      {cart.vehicle && (
        <div className="cart">
          <div className="cart__content">
            {cart.vehicle && (
              <div className="cart__item">
                <span className="cart__item-label">Véhicule</span>
                <span className="cart__item-value">{cart.vehicle.name}</span>
                <button 
                  className="cart__item-remove"
                  onClick={() => removeFromCart('vehicle')}
                  aria-label="Retirer le véhicule"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button className="cart__confirm" onClick={openWizard}>
              Réserver
              <ArrowRight size={16} />
            </button>
            </div>
          </div>
      )}

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
                Étape {currentStep} sur 5
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
                  <h2 className="booking-wizard__step-title">Choisissez votre véhicule</h2>
                  <p className="booking-wizard__step-subtitle">Combien de bagages transportez-vous ?</p>
                  
                  <div className="booking-wizard__luggage-input">
                    <input 
                      type="number"
                      min="0"
                      max="10"
                      value={bookingData.luggage || ''}
                      onChange={(e) => updateBookingData('luggage', parseInt(e.target.value) || 0)}
                      placeholder="Nombre de bagages"
                      className="booking-wizard__input"
                    />
                  </div>

                  {bookingData.luggage > 0 && (
                    <div className="booking-wizard__recommendation">
                      <span className="booking-wizard__recommendation-text">
                        Recommandation IA : {bookingData.luggage <= 2 ? 'Berline' : bookingData.luggage <= 4 ? 'SUV' : 'Van'}
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
                                SÉLECTION IA
                  </div>
                            )}
                </div>
                          <div className="booking-wizard__vehicle-content">
                            <h3 className="booking-wizard__vehicle-name">{vehicle.name}</h3>
                            <p className="booking-wizard__vehicle-tagline">{vehicle.tagline}</p>
                            <div className="booking-wizard__vehicle-specs">
                              <span>{vehicle.specs.passengers} passagers</span>
                              <span>•</span>
                              <span>{vehicle.specs.luggage} bagages</span>
                            </div>
                            <div className="booking-wizard__vehicle-price">{vehicle.price}</div>
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
                  <h2 className="booking-wizard__step-title">Choisissez votre service</h2>
                  <p className="booking-wizard__step-subtitle">Sélectionnez le service qui correspond à vos besoins</p>
                  
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
                  <h2 className="booking-wizard__step-title">Date et heure</h2>
                  <p className="booking-wizard__step-subtitle">Quand souhaitez-vous être pris en charge ?</p>
                  
                  <div className="booking-wizard__datetime">
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">Date</label>
                <input 
                  type="date" 
                        value={bookingData.date}
                        onChange={(e) => updateBookingData('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">Heure</label>
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
                  <h2 className="booking-wizard__step-title">Vos informations</h2>
                  <p className="booking-wizard__step-subtitle">Nous avons besoin de quelques détails pour finaliser votre réservation</p>
                  
                  <div className="booking-wizard__form">
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">Prénom</label>
                <input 
                  type="text" 
                        value={bookingData.passenger.firstName}
                        onChange={(e) => updateBookingData('passenger.firstName', e.target.value)}
                        placeholder="Votre prénom"
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">Nom</label>
                      <input
                        type="text"
                        value={bookingData.passenger.lastName}
                        onChange={(e) => updateBookingData('passenger.lastName', e.target.value)}
                        placeholder="Votre nom"
                        className="booking-wizard__input"
                      />
                    </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">Téléphone</label>
                <input 
                  type="tel" 
                        value={bookingData.passenger.phone}
                        onChange={(e) => updateBookingData('passenger.phone', e.target.value)}
                  placeholder="+33 6 12 34 56 78" 
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">Email</label>
                <input 
                  type="email" 
                        value={bookingData.passenger.email}
                        onChange={(e) => updateBookingData('passenger.email', e.target.value)}
                  placeholder="votre@email.com" 
                        className="booking-wizard__input"
                />
              </div>
                    <div className="booking-wizard__field">
                      <label className="booking-wizard__label">Demandes spéciales (optionnel)</label>
                <textarea 
                        value={bookingData.passenger.specialRequests}
                        onChange={(e) => updateBookingData('passenger.specialRequests', e.target.value)}
                        placeholder="Siège enfant, champagne, etc."
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
                  <h2 className="booking-wizard__step-title">Récapitulatif</h2>
                  <p className="booking-wizard__step-subtitle">Vérifiez les détails de votre réservation</p>
                  
                  <div className="booking-wizard__summary">
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Véhicule</span>
                      <span className="booking-wizard__summary-value">{bookingData.vehicle?.name || 'Non sélectionné'}</span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Service</span>
                      <span className="booking-wizard__summary-value">
                        {bookingData.service?.name || 'Non sélectionné'}
                      </span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Date</span>
                      <span className="booking-wizard__summary-value">{bookingData.date || 'Non renseigné'}</span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Heure</span>
                      <span className="booking-wizard__summary-value">{bookingData.time || 'Non renseigné'}</span>
                      </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Bagages</span>
                      <span className="booking-wizard__summary-value">{bookingData.luggage || 0}</span>
                    </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Client</span>
                      <span className="booking-wizard__summary-value">
                        {bookingData.passenger.firstName} {bookingData.passenger.lastName}
                      </span>
                    </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Contact</span>
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
                  Précédent
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
                  Suivant
                  <ArrowRight size={20} />
                      </button>
              ) : (
                      <button 
                  className="booking-wizard__btn booking-wizard__btn--primary" 
                  onClick={handleConfirmBooking}
                      >
                  Confirmer la réservation
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
              <h3 className="footer__brand-name">SafenessTransport</h3>
              <p className="footer__brand-tagline">Transport d'Excellence depuis 2018</p>
              <p className="footer__brand-description">
                Service premium de transport avec chauffeur privé. Élégance, discrétion et ponctualité pour tous vos déplacements d'exception.
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
              <h4 className="footer__nav-title">Navigation</h4>
              <ul className="footer__nav-list">
                <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Accueil</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>À Propos</a></li>
                <li><a href="#fleet" onClick={(e) => { e.preventDefault(); scrollToSection('fleet'); }}>Flotte</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a></li>
                <li><a href="#airports" onClick={(e) => { e.preventDefault(); scrollToSection('airports'); }}>Aéroports</a></li>
                <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Avis Clients</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
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
              <h4 className="footer__contact-title">Contact</h4>
              <ul className="footer__contact-list">
                <li>
                  <a href="tel:+33605998211" className="footer__contact-item">
                    <Phone size={18} />
                    <span>+33 6 05 99 82 11</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@fleetprivee.com" className="footer__contact-item">
                    <Mail size={18} />
                    <span>contact@fleetprivee.com</span>
                  </a>
                </li>
                <li>
                  <div className="footer__contact-item">
                    <MapPin size={18} />
                    <span>Paris, France</span>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Social Media & CTA */}
            <motion.div 
              className="footer__social"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <h4 className="footer__social-title">Suivez-nous</h4>
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
                <span>Réserver maintenant</span>
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
                <p>© 2026 SafenessTransport. Tous droits réservés.</p>
              </div>
              <div className="footer__legal">
                <a href="#legal">Mentions Légales</a>
                <span className="footer__separator">•</span>
                <a href="#privacy">Politique de Confidentialité</a>
                <span className="footer__separator">•</span>
                <a href="#cookies">Cookies</a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

export default App
