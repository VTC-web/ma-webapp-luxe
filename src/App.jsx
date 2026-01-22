import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft, ArrowRight, Play, Pause, X, Plus, Minus, Plane, Star, ChevronDown } from 'lucide-react'
import './index.css'
import './styles.css'

function App() {
  // State Management - Simplifié pour le panier uniquement
  const [cart, setCart] = useState({
    vehicle: null,
    route: null
  })

  // BookingWizard State
  const [wizardOpen, setWizardOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1-5
  const [bookingData, setBookingData] = useState({
    vehicle: null,
    luggage: 0,
    route: null,
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [scrollY, setScrollY] = useState(0)
  const [expandedDetails, setExpandedDetails] = useState({}) // { vehicleId: true/false }
  const [openFAQ, setOpenFAQ] = useState(null) // FAQ accordion
  const [testimonialIndex, setTestimonialIndex] = useState(0) // Pour le slider d'avis
  const heroVideoRef = useRef(null)

  // Données
  const vehicles = [
    {
      id: 'mercedes-e-class',
      name: 'Mercedes Classe E',
      tagline: 'ÉLÉGANCE ET PERFORMANCE',
      category: 'berline',
      specs: { passengers: 4, luggage: 2, power: '320 HP', speed: '220 KM/H' },
      images: [
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
      ],
      price: 'À partir de 100€'
    },
    {
      id: 'mercedes-s680',
      name: 'Mercedes Classe S',
      tagline: 'L\'EXCELLENCE ABSOLUE',
      category: 'suv',
      specs: { passengers: 4, luggage: 3, power: '450 HP', speed: '250 KM/H' },
      images: [
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
      ],
      price: 'À partir de 120€'
    },
    {
      id: 'van-luxe',
      name: 'Van Premium',
      tagline: 'CONFORT MAXIMAL POUR GROUPES',
      category: 'van',
      specs: { passengers: 8, luggage: 6, power: '280 HP', speed: '180 KM/H' },
      images: [
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
        'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg'
      ],
      price: 'À partir de 150€'
    }
  ]

  const routes = [
    {
      id: 'cdg_paris',
      from: 'Paris',
      to: 'CDG',
      duration: '45 min',
      price: '120€',
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
      services: ['Accueil pancarte', 'Attente 30min', 'Rafraîchissements', 'Suivi temps réel']
    },
    {
      id: 'disneyland',
      from: 'Paris',
      to: 'Disneyland',
      duration: '50 min',
      price: '150€',
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
      services: ['Accueil pancarte', 'Attente 45min', 'Rafraîchissements', 'WiFi haut débit']
    },
    {
      id: 'orly_paris',
      from: 'Paris',
      to: 'Orly',
      duration: '30 min',
      price: '100€',
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
      services: ['Accueil pancarte', 'Attente 20min', 'Rafraîchissements', 'Service express']
    },
    {
      id: 'custom',
      from: 'Départ',
      to: 'Destination',
      duration: 'Sur mesure',
      price: 'Sur devis',
      image: 'https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg',
      services: ['Itinéraire personnalisé', 'Arrêts multiples', 'Service premium', 'Devis gratuit']
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

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-play hero video
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {
        // Auto-play blocked, user interaction required
      })
    }
  }, [])

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
    document.body.style.overflow = 'hidden'
  }

  const closeWizard = () => {
    setWizardOpen(false)
    document.body.style.overflow = ''
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
    const whatsappNumber = '33605998211'
    let message = 'RÉSERVATION\n\n'
    message += `Véhicule : ${bookingData.vehicle?.name || 'Non sélectionné'}\n`
    message += `Itinéraire : ${bookingData.route ? `${bookingData.route.from} → ${bookingData.route.to}` : 'Non sélectionné'}\n`
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
      {/* Navigation Minimaliste */}
      <nav className="nav">
        <div className="nav__logo">FleetPrivée</div>
        <button 
          className="nav__menu"
          onClick={() => scrollToSection('hero')}
        >
          Menu
        </button>
      </nav>

      {/* Hero Section - Cinématographique */}
      <section id="hero" className="hero">
        <div className="hero__media">
          <div className="hero__image-wrapper">
            <img 
              src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg"
              alt="Luxury Vehicle"
              className="hero__image"
            />
          </div>
          <div className="hero__overlay"></div>
        </div>
        
        <div className="hero__content">
          <div className="hero__badge">DEPUIS 2018</div>
          <h1 className="hero__title">
            <span className="hero__title-line">Transport</span>
            <span className="hero__title-line">d'Excellence</span>
          </h1>
          <p className="hero__subtitle">
            Expérience premium avec chauffeur privé
          </p>
          <button 
            className="hero__cta"
            onClick={openWizard}
          >
            Réserver maintenant
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="hero__scroll-indicator">
          <div className="hero__scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Section Flotte - Style Rimac Automobili */}
      <section id="fleet" className="fleet">
        <div className="fleet__header">
          <div className="fleet__header-content">
            <span className="fleet__number">01</span>
            <h2 className="fleet__title">Notre Flotte</h2>
          </div>
          <p className="fleet__description">
            Sélection de véhicules premium pour chaque occasion
          </p>
        </div>

        <div className="fleet__grid">
          {vehicles.map((vehicle, index) => {
            const currentSlide = activeFleetSlide[vehicle.id] || 0
            
            return (
              <div 
                key={vehicle.id}
                className="fleet__card-showcase"
                onClick={() => {
                  updateBookingData('vehicle', vehicle)
                  openWizard()
                }}
              >
                {/* Image Slider - 100% de la carte */}
                <div className="fleet__card-showcase-media">
                  <div className="fleet__card-showcase-slider">
                    {vehicle.images.map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`fleet__card-showcase-slide ${imgIndex === currentSlide ? 'is-active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                  </div>
                  
                  {/* Indicateurs visuels seulement */}
                  {vehicle.images.length > 1 && (
                    <div className="fleet__card-showcase-indicators">
                      {vehicle.images.map((_, dotIndex) => (
                        <button
                          key={dotIndex}
                          className={`fleet__card-showcase-dot ${dotIndex === currentSlide ? 'is-active' : ''}`}
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

                  {/* Overlay avec nom et prix */}
                  <div className="fleet__card-showcase-overlay">
                    <div className="fleet__card-showcase-info">
                      <h3 className="fleet__card-showcase-name">{vehicle.name}</h3>
                      <div className="fleet__card-showcase-price">{vehicle.price}</div>
                    </div>
                    <button 
                      className="fleet__card-showcase-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateBookingData('vehicle', vehicle)
                        openWizard()
                      }}
                    >
                      Réserver
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section Transferts Aéroport */}
      <section id="airports" className="airports">
        <div className="airports__header">
          <div className="airports__header-content">
            <span className="airports__number">02</span>
            <h2 className="airports__title">Transferts Aéroport</h2>
          </div>
          <p className="airports__description">
            Service premium vers tous les aéroports parisiens
          </p>
        </div>

        <div className="airports__grid">
          {airports.map((airport) => (
            <div 
              key={airport.id}
              className="airports__card"
              onClick={() => {
                const route = routes.find(r => r.to === airport.code || r.id === airport.id.toLowerCase().replace('-', '_'))
                if (route) {
                  updateBookingData('route', route)
                  openWizard()
                }
              }}
            >
              <div className="airports__icon">
                <Plane size={32} />
              </div>
              <div className="airports__content">
                <h3 className="airports__name">{airport.name}</h3>
                <p className="airports__code">{airport.code}</p>
                <p className="airports__duration">{airport.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Avis Clients */}
      <section id="testimonials" className="testimonials">
        <div className="testimonials__header">
          <div className="testimonials__header-content">
            <span className="testimonials__number">03</span>
            <h2 className="testimonials__title">Avis Clients</h2>
          </div>
          <p className="testimonials__description">
            Ce que nos clients VIP disent de notre service
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

      {/* Section Itinéraires - Catalogue de Voyage Privé */}
      <section id="routes" className="routes">
        <div className="routes__header">
          <div className="routes__header-content">
            <span className="routes__number">02</span>
            <h2 className="routes__title">Itinéraires</h2>
          </div>
          <p className="routes__description">
            Destinations premium sélectionnées pour votre confort
          </p>
        </div>

        <div className="routes__catalog">
          {routes.map((route) => {
            const isSelected = cart.route?.id === route.id
            
            return (
              <div
                key={route.id}
                className={`routes__item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    removeFromCart('route')
                  } else {
                    addToCart('route', route)
                  }
                }}
              >
                <div 
                  className="routes__item-image"
                  style={{ backgroundImage: `url(${route.image})` }}
                >
                  <div className="routes__item-overlay"></div>
                  <div className="routes__item-badge">{route.duration}</div>
                </div>
                
                <div className="routes__item-content">
                  <div className="routes__item-route">
                    <span className="routes__item-from">{route.from}</span>
                    <ArrowRight className="routes__item-arrow" size={20} />
                    <span className="routes__item-to">{route.to}</span>
                  </div>
                  
                  <div className="routes__item-services">
                    {route.services.slice(0, 2).map((service, idx) => (
                      <span key={idx} className="routes__item-service">{service}</span>
                    ))}
                  </div>
                  
                  <div className="routes__item-footer">
                    <span className="routes__item-price">{route.price}</span>
                    <div className={`routes__item-check ${isSelected ? 'is-checked' : ''}`}>
                      {isSelected ? <X size={16} /> : <Plus size={16} />}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Panier Flottant Minimaliste */}
      {(cart.vehicle || cart.route) && (
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
            {cart.route && (
              <div className="cart__item">
                <span className="cart__item-label">Itinéraire</span>
                <span className="cart__item-value">{cart.route.from} → {cart.route.to}</span>
                <button
                  className="cart__item-remove"
                  onClick={() => removeFromCart('route')}
                  aria-label="Retirer l'itinéraire"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button className="cart__confirm">
              Réserver
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* BookingWizard Overlay */}
      {wizardOpen && (
        <div className="booking-wizard">
          <div className="booking-wizard__backdrop" onClick={closeWizard}></div>
          <div className="booking-wizard__container">
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
              {/* Étape 1 : Sélection Véhicule */}
              {currentStep === 1 && (
                <div className="booking-wizard__step">
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
                </div>
              )}

              {/* Étape 2 : Sélection Itinéraire */}
              {currentStep === 2 && (
                <div className="booking-wizard__step">
                  <h2 className="booking-wizard__step-title">Choisissez votre itinéraire</h2>
                  <p className="booking-wizard__step-subtitle">Sélectionnez une destination ou créez un trajet personnalisé</p>
                  
                  <div className="booking-wizard__routes">
                    {routes.map((route) => {
                      const isSelected = bookingData.route?.id === route.id
                      
                      return (
                        <div
                          key={route.id}
                          className={`booking-wizard__route-card ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => updateBookingData('route', route)}
                        >
                          <div 
                            className="booking-wizard__route-image"
                            style={{ backgroundImage: `url(${route.image})` }}
                          >
                            <div className="booking-wizard__route-overlay"></div>
                            <div className="booking-wizard__route-badge">{route.duration}</div>
                          </div>
                          <div className="booking-wizard__route-content">
                            <div className="booking-wizard__route-route">
                              <span>{route.from}</span>
                              <ArrowRight size={18} />
                              <span>{route.to}</span>
                            </div>
                            <div className="booking-wizard__route-price">{route.price}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Étape 3 : Date & Heure */}
              {currentStep === 3 && (
                <div className="booking-wizard__step">
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
                </div>
              )}

              {/* Étape 4 : Informations Passager */}
              {currentStep === 4 && (
                <div className="booking-wizard__step">
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
                </div>
              )}

              {/* Étape 5 : Récapitulatif */}
              {currentStep === 5 && (
                <div className="booking-wizard__step">
                  <h2 className="booking-wizard__step-title">Récapitulatif</h2>
                  <p className="booking-wizard__step-subtitle">Vérifiez les détails de votre réservation</p>
                  
                  <div className="booking-wizard__summary">
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Véhicule</span>
                      <span className="booking-wizard__summary-value">{bookingData.vehicle?.name || 'Non sélectionné'}</span>
                    </div>
                    <div className="booking-wizard__summary-item">
                      <span className="booking-wizard__summary-label">Itinéraire</span>
                      <span className="booking-wizard__summary-value">
                        {bookingData.route ? `${bookingData.route.from} → ${bookingData.route.to}` : 'Non sélectionné'}
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
                </div>
              )}
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
                    (currentStep === 2 && !bookingData.route) ||
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
          </div>
        </div>
      )}

      {/* Footer Minimaliste avec FAQ */}
      <footer className="footer">
        <div className="footer__content">
          {/* FAQ Section */}
          <div className="footer__faq">
            <h3 className="footer__faq-title">Questions Fréquentes</h3>
            <div className="footer__faq-list">
              {faqs.map((faq) => (
                <div 
                  key={faq.id}
                  className={`footer__faq-item ${openFAQ === faq.id ? 'is-open' : ''}`}
                >
                  <button
                    className="footer__faq-question"
                    onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      className={`footer__faq-icon ${openFAQ === faq.id ? 'is-open' : ''}`}
                      size={20}
                    />
                  </button>
                  {openFAQ === faq.id && (
                    <div className="footer__faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer__bottom">
            <div className="footer__brand">FleetPrivée</div>
            <div className="footer__links">
              <a href="#hero">Accueil</a>
              <a href="#fleet">Flotte</a>
              <a href="#airports">Aéroports</a>
              <a href="mailto:contact@fleetprivee.com">Contact</a>
              <a href="#legal">Mentions Légales</a>
            </div>
            <div className="footer__copyright">
              © 2024 FleetPrivée. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
