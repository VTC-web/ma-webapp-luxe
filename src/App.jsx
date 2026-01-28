import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft, ArrowRight, Play, Pause, X, Plus, Minus, Plane, Star, ChevronDown, Users, Package, Sparkles, Briefcase, Heart, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Clock, Shield, Award, Home, Car, Calendar } from 'lucide-react'
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

  const [activeFleetSlide, setActiveFleetSlide] = useState({})
  const [expandedVehicleDetails, setExpandedVehicleDetails] = useState({})
  const [openFAQ, setOpenFAQ] = useState(null)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [serviceIndex, setServiceIndex] = useState(0)
  const [menuExpanded, setMenuExpanded] = useState(false)
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

  const handleFleetSlideChange = (vehicleId, direction) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return
    
    const currentIndex = activeFleetSlide[vehicleId] || 0
    let newIndex
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % vehicle.images.length
    } else {
      newIndex = (currentIndex - 1 + vehicle.images.length) % vehicle.images.length
    }
    
    setActiveFleetSlide(prev => ({
      ...prev,
      [vehicleId]: newIndex
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
    // Ne pas bloquer le scroll - le wizard utilise un backdrop qui permet le scroll
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
                <Car size={20} />
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
                SafenessTransport : chauffeur privé haut de gamme à Paris
              </h1>
              <p className="hero__app-subtitle">
                Paris & Île‑de‑France — transferts aéroport, événements, mise à disposition.
              </p>
            </motion.div>

            <motion.button
              className="hero__app-cta"
              onClick={openWizard}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Réserver maintenant"
            >
              <span className="hero__app-cta-icon" aria-hidden="true">
                <Car size={18} />
              </span>
              <span className="hero__app-cta-text">Réserver un chauffeur</span>
              <span className="hero__app-cta-arrows" aria-hidden="true">
                ›››
              </span>
            </motion.button>
          </div>
        </div>

        </section>

      {/* Section Services - Prestations Premium */}
      <section id="services" className="services">
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
      </section>

      {/* Section À Propos */}
      <section id="about" className="about">
        <div className="about__header">
          <div className="about__header-content">
            <span className="about__number">02</span>
            <h2 className="about__title">À Propos</h2>
                </div>
          <p className="about__description">
            Excellence et discrétion depuis 2018
          </p>
                    </div>

        <div className="about__content">
          <div className="about__text">
            <p className="about__paragraph">
              SafenessTransport est votre partenaire de confiance pour tous vos déplacements d'exception. 
              Depuis 2018, nous avons perfectionné l'art du transport privé avec chauffeur, 
              offrant une expérience sur-mesure qui allie élégance, ponctualité et discrétion absolue.
            </p>
            
            <div className="about__qualities">
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Star size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">Excellence</h3>
                  <p className="about__quality-description">Service premium de qualité</p>
                </div>
              </div>
              
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Clock size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">Ponctualité</h3>
                  <p className="about__quality-description">Respect des horaires garantis</p>
                </div>
              </div>
              
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Shield size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">Discrétion</h3>
                  <p className="about__quality-description">Confidentialité absolue</p>
                </div>
              </div>
              
              <div className="about__quality">
                <div className="about__quality-icon">
                  <Award size={24} />
                </div>
                <div className="about__quality-text">
                  <h3 className="about__quality-title">Prestige</h3>
                  <p className="about__quality-description">Expérience haut de gamme</p>
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
            <motion.div 
              className="about__stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springConfig, delay: 0.1 }}
            >
              <div className="about__stat-number">
                <AnimatedCounter value={6} suffix="+" />
                </div>
              <div className="about__stat-label">Années d'excellence</div>
            </motion.div>
            <motion.div 
              className="about__stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <div className="about__stat-number">
                <AnimatedCounter value={2500} suffix="+" />
                    </div>
              <div className="about__stat-label">Clients fidèles</div>
            </motion.div>
            <motion.div 
              className="about__stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <div className="about__stat-number">24/7</div>
              <div className="about__stat-label">Service disponible</div>
            </motion.div>
            <motion.div 
              className="about__stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springConfig}
            >
              <div className="about__stat-number">
                <AnimatedCounter value={98} suffix="%" />
                  </div>
              <div className="about__stat-label">Taux de satisfaction</div>
            </motion.div>
                </div>
              </div>
      </section>

      {/* Section Flotte - Style Rimac Automobili */}
      <section id="fleet" className="fleet">
        <div className="fleet__header">
          <div className="fleet__header-content">
            <span className="fleet__number">03</span>
            <h2 className="fleet__title">Notre Flotte</h2>
                </div>
          <p className="fleet__description">
            Découvrez notre collection exclusive de véhicules premium, chacun sélectionné pour répondre à vos besoins spécifiques. De la berline d'affaires à la limousine de prestige, chaque modèle incarne l'excellence du transport privé.
          </p>
                    </div>

        <div className="fleet__grid">
          {vehicles.map((vehicle, index) => {
            const currentSlide = activeFleetSlide[vehicle.id] || 0
            
            return (
              <motion.div 
                key={vehicle.id}
                className="fleet__card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ ...springConfig, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                {/* Zone image avec slider */}
                <div className="fleet__card-image-wrapper">
                  <div className="fleet__card-image-container">
                    {vehicle.images.map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`fleet__card-image ${imgIndex === currentSlide ? 'is-active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                    
                    {/* Flèches de navigation */}
                    {vehicle.images.length > 1 && (
                      <>
                        <button
                          className="fleet__card-nav fleet__card-nav--prev"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveFleetSlide(prev => ({
                              ...prev,
                              [vehicle.id]: (currentSlide - 1 + vehicle.images.length) % vehicle.images.length
                            }))
                          }}
                          aria-label="Image précédente"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          className="fleet__card-nav fleet__card-nav--next"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveFleetSlide(prev => ({
                              ...prev,
                              [vehicle.id]: (currentSlide + 1) % vehicle.images.length
                            }))
                          }}
                          aria-label="Image suivante"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                    
                    {/* Indicateurs */}
                    {vehicle.images.length > 1 && (
                      <div className="fleet__card-dots">
                        {vehicle.images.map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            className={`fleet__card-dot ${dotIndex === currentSlide ? 'is-active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveFleetSlide(prev => ({
                                ...prev,
                                [vehicle.id]: dotIndex
                              }))
                            }}
                            aria-label={`Image ${dotIndex + 1}`}
                          />
                        ))}
                  </div>
                    )}
                </div>
              </div>

                {/* Contenu de la carte */}
                <div className="fleet__card-body">
                  <div className="fleet__card-header">
                    <h3 className="fleet__card-title">{vehicle.name}</h3>
                    <p className="fleet__card-subtitle">{vehicle.description}</p>
                </div>
                  
                  <div className="fleet__card-footer">
                    <div className="fleet__card-specs">
                      <div className="fleet__card-spec">
                        <Users size={14} />
                        <span>{vehicle.specs.passengers}</span>
                    </div>
                      <div className="fleet__card-spec">
                        <Package size={14} />
                        <span>{vehicle.specs.luggage}</span>
                  </div>
                </div>
                    
                    <button 
                      className="fleet__card-info-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedVehicleDetails(prev => ({
                          ...prev,
                          [vehicle.id]: !prev[vehicle.id]
                        }))
                      }}
                    >
                      +info
                      </button>
                    
                    {expandedVehicleDetails[vehicle.id] && (
                      <div className="fleet__card-details">
                        <div className="fleet__card-details-grid">
                          <div className="fleet__card-details-item">
                            <span className="fleet__card-details-label">Puissance</span>
                            <span className="fleet__card-details-value">{vehicle.specs.power}</span>
                    </div>
                          <div className="fleet__card-details-item">
                            <span className="fleet__card-details-label">Chevaux</span>
                            <span className="fleet__card-details-value">{vehicle.specs.horsepower} ch</span>
                  </div>
                          <div className="fleet__card-details-item">
                            <span className="fleet__card-details-label">Vitesse max</span>
                            <span className="fleet__card-details-value">{vehicle.specs.speed}</span>
                      </div>
                      </div>
                      </div>
                    )}
                    
                    <button 
                      className="fleet__card-cta"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateBookingData('vehicle', vehicle)
                        openWizard()
                      }}
                    >
                      Choisir ce véhicule
                      <ArrowRight size={18} />
                    </button>
                      </div>
                      </div>
              </motion.div>
            )
          })}
                      </div>
      </section>

      {/* Section Transferts Aéroport */}
      <section id="airports" className="airports">
        <div className="airports__header">
          <div className="airports__header-content">
            <span className="airports__number">04</span>
            <h2 className="airports__title">Transferts Aéroport</h2>
                    </div>
          <p className="airports__description">
            Transferts aéroport haut de gamme vers CDG, Orly et Le Bourget. Accueil personnalisé, suivi en temps réel et service VIP pour un voyage sans stress.
          </p>
                </div>

          <div className="airports__grid">
           {airports.map((airport, index) => (
               <motion.div 
                 key={airport.id}
                 className="airports__card"
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: '-100px' }}
                 transition={{ ...springConfig, delay: index * 0.05 }}
                 whileHover={{ y: -8 }}
                  onClick={() => {
                   openWizard()
                 }}
               >
                 <div className="airports__card-image-wrapper">
                   <div className="airports__card-image-container">
                     <div className="airports__card-image" style={{ backgroundImage: `url('https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg')` }}></div>
                     <div className="airports__icon">
                       <Plane size={40} />
                          </div>
                        </div>
                      </div>
                 
                 <div className="airports__card-body">
                   <div className="airports__card-header">
                     <h3 className="airports__card-title">{airport.name}</h3>
                     <p className="airports__card-code">{airport.code}</p>
                    </div>
                   
                   <div className="airports__card-footer">
                     <div className="airports__card-duration">
                       <span>{airport.duration}</span>
                  </div>
                     <button className="airports__card-cta">
                       Réserver
                       <ArrowRight size={18} />
                     </button>
                      </div>
                      </div>
               </motion.div>
           ))}
                      </div>
      </section>

      {/* Section Avis Clients */}
      <section id="testimonials" className="testimonials">
        <div className="testimonials__header">
          <div className="testimonials__header-content">
            <span className="testimonials__number">05</span>
            <h2 className="testimonials__title">Avis Clients</h2>
                      </div>
          <p className="testimonials__description">
            La satisfaction de nos clients est notre priorité. Découvrez les témoignages de ceux qui nous font confiance pour leurs déplacements d'exception.
          </p>
                </div>

        <div className="testimonials__container">
          <div className="testimonials__slider">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial__card ${index === testimonialIndex ? 'is-active' : ''}`}
              >
                <div className="testimonial__rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                          </div>
                <p className="testimonial__text">"{testimonial.text}"</p>
                <div className="testimonial__author">
                  <div className="testimonial__name">{testimonial.name}</div>
                  <div className="testimonial__role">{testimonial.role}</div>
                        </div>
                      </div>
            ))}
                    </div>
          <div className="testimonials__nav">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonials__nav-dot ${index === testimonialIndex ? 'is-active' : ''}`}
                onClick={() => setTestimonialIndex(index)}
                aria-label={`Avis ${index + 1}`}
              />
            ))}
                  </div>
                      </div>
      </section>

      {/* Section FAQ */}
      <section id="faq" className="faq">
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
      </section>

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
