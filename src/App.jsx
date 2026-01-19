import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Check, Menu, Zap } from 'lucide-react'
import './index.css'
import './styles.css'
import SlideToUnlock from './components/SlideToUnlock'

function App() {
  // State Management
  const [bookingState, setBookingState] = useState({
    vehicle: { id: null },
    route: { type: null, presetId: null, customRoute: { pickup: { address: null }, dropoff: { address: null } } },
    schedule: { date: null, time: null },
    passenger: { firstName: null, lastName: null, phone: null, email: null, specialRequests: null },
    payment: { method: null }
  })

  const [openAccordion, setOpenAccordion] = useState(null)
  const [expandedVehicle, setExpandedVehicle] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const scrollContainerRef = useRef(null)

  // Update nested state
  const updateBookingState = (path, value) => {
    setBookingState(prev => {
      const keys = path.split('.')
      const newState = { ...prev }
      let current = newState
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newState
    })
  }

  // Validators
  const validateStep = (step) => {
    switch (step) {
      case 'vehicle':
        return bookingState.vehicle.id !== null
      case 'route':
        if (!bookingState.route.type) return false
        if (bookingState.route.type === 'preset') {
          return bookingState.route.presetId !== null
        }
        return bookingState.route.customRoute.pickup.address && bookingState.route.customRoute.dropoff.address
      case 'details':
        const { date, time } = bookingState.schedule
        const { firstName, lastName, phone, email } = bookingState.passenger
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[\d\s\+\-\(\)]+$/
        return date && time && firstName && lastName && 
               email && emailRegex.test(email) && 
               phone && phoneRegex.test(phone) && 
               phone.replace(/\D/g, '').length >= 10 &&
               bookingState.payment.method !== null
      default:
        return false
    }
  }

  // Scroll lock logic
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const sectionHeight = window.innerHeight
      const newIndex = Math.round(scrollTop / sectionHeight)
      setCurrentSection(newIndex)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Vehicle selection handlers
  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicle(vehicleId)
    updateBookingState('vehicle.id', vehicleId)
  }

  const handleRouteSelect = (type, presetId = null) => {
    updateBookingState('route.type', type)
    if (presetId) {
      updateBookingState('route.presetId', presetId)
    }
  }

  const handleCustomRouteChange = (field, value) => {
    updateBookingState(`route.customRoute.${field}`, value)
  }

  const handleDetailsChange = (field, value) => {
    if (field === 'name') {
      const parts = value.trim().split(/\s+/)
      updateBookingState('passenger.firstName', parts[0] || '')
      updateBookingState('passenger.lastName', parts.slice(1).join(' ') || '')
    } else {
      updateBookingState(field, value)
    }
  }

  const handlePaymentSelect = (method) => {
    updateBookingState('payment.method', method)
  }

  const handleConfirmDetails = () => {
    if (validateStep('details')) {
      setShowSummary(true)
      setTimeout(() => {
        const summarySection = document.getElementById('bookingSummarySection')
        if (summarySection) {
          summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const getVehicleName = (id) => {
    const names = {
      'mercedes-s680': 'Mercedes Classe S',
      'mercedes-e-class': 'Mercedes Classe E',
      'van-luxe': 'Van Premium'
    }
    return names[id] || 'Non sélectionné'
  }

  const handleUnlock = () => {
    scrollToSection('booking-vehicle')
  }

  const sections = ['hero', 'about', 'booking-vehicle', 'booking-route', 'booking-details']

  return (
    <>
      <button className="header__menu-btn" aria-label="Menu">
        <span>MENU</span>
        <Menu className="header__menu-icon" size={18} />
      </button>

      <main className="scroll-container" ref={scrollContainerRef}>
        <div className="header__logo">
          <Zap className="header__logo-icon" />
          <span>FleetPrivée</span>
        </div>
        {/* Section 1: Hero */}
        <section className="section section--hero" id="hero">
          <img 
            src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" 
            alt="Mercedes S-Class" 
            className="section__bg"
          />
          <div className="section__overlay"></div>
          <div className="section__content">
            <div className="hero">
              <span className="hero__badge">DEPUIS 2018</span>
              <h1 className="hero__title">
                Profitez d'un Confort Ultime avec<br />SafenessDrive Chauffeurs privés.
              </h1>
              <div className="hero__cta">
                <SlideToUnlock onComplete={handleUnlock} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Booking - Vehicle Selection */}
        <section className="section" id="booking-vehicle">
          <div className="section__overlay"></div>
          <div className="section__content">
            <div className="vehicle-selection">
              <h2 className="vehicle-selection__title">Réservez une expérience unique</h2>
              <p className="vehicle-selection__subtitle">Choisissez votre véhicule</p>
              
              <div className="vehicle-list">
                <div 
                  className={`vehicle-card ${expandedVehicle === 'mercedes-s680' ? 'is-expanded' : ''} ${selectedVehicle === 'mercedes-s680' ? 'selected' : ''}`}
                  onClick={() => {
                    handleVehicleSelect('mercedes-s680')
                    setExpandedVehicle(expandedVehicle === 'mercedes-s680' ? null : 'mercedes-s680')
                  }}
                >
                  <div className="vehicle-card__image-wrapper">
                    <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Mercedes Classe S" className="vehicle-card__image" />
                    <div className="vehicle-card__overlay"></div>
                    <div className="vehicle-card__content">
                      <div className="vehicle-card__info">
                        <h3 className="vehicle-card__title">Mercedes Classe S</h3>
                        <p className="vehicle-card__tagline">L'EXCELLENCE POUR VOS MOMENTS PRESTIGIEUX.</p>
                        <div className="vehicle-card__specs">
                          <div className="vehicle-card__spec-badge">
                            <Zap className="vehicle-card__spec-icon" />
                            <span>250KM/H</span>
                          </div>
                          <div className="vehicle-card__spec-badge">
                            <Zap className="vehicle-card__spec-icon" />
                            <span>250KM/H</span>
                          </div>
                        </div>
                      </div>
                      <div className="vehicle-card__actions">
                        <button className="vehicle-card__reserve-btn" onClick={(e) => { e.stopPropagation(); handleVehicleSelect('mercedes-s680'); scrollToSection('booking-route'); }}>
                          RÉSERVER
                        </button>
                      </div>
                      <button className="vehicle-card__details-btn" onClick={(e) => e.stopPropagation()}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="vehicle-card__expand">
                    <div className="vehicle-card__expand-content">
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Disponible</span>
                        <span className="vehicle-card__expand-value">Paris / Milan / Amsterdam / Munich</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Nombre chevaux</span>
                        <span className="vehicle-card__expand-value">450 HP</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Vitesse max</span>
                        <span className="vehicle-card__expand-value">250 KM/H</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Passagers</span>
                        <span className="vehicle-card__expand-value">4 personnes</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Bagages</span>
                        <span className="vehicle-card__expand-value">3 valises</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Options</span>
                        <span className="vehicle-card__expand-value">Champagne, WiFi, Sièges enfant</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`vehicle-card ${expandedVehicle === 'mercedes-e-class' ? 'is-expanded' : ''} ${selectedVehicle === 'mercedes-e-class' ? 'selected' : ''}`}
                  onClick={() => {
                    handleVehicleSelect('mercedes-e-class')
                    setExpandedVehicle(expandedVehicle === 'mercedes-e-class' ? null : 'mercedes-e-class')
                  }}
                >
                  <div className="vehicle-card__image-wrapper">
                    <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Mercedes Classe E" className="vehicle-card__image" />
                    <div className="vehicle-card__overlay"></div>
                    <div className="vehicle-card__content">
                      <div className="vehicle-card__info">
                        <h3 className="vehicle-card__title">Classe E / MERCEDES</h3>
                        <p className="vehicle-card__tagline">ÉLÉGANCE ET PERFORMANCE POUR VOS DÉPLACEMENTS.</p>
                        <div className="vehicle-card__specs">
                          <div className="vehicle-card__spec-badge">
                            <Zap className="vehicle-card__spec-icon" />
                            <span>220KM/H</span>
                          </div>
                          <div className="vehicle-card__spec-badge">
                            <Zap className="vehicle-card__spec-icon" />
                            <span>220KM/H</span>
                          </div>
                        </div>
                      </div>
                      <div className="vehicle-card__actions">
                        <button className="vehicle-card__reserve-btn" onClick={(e) => { e.stopPropagation(); handleVehicleSelect('mercedes-e-class'); scrollToSection('booking-route'); }}>
                          RÉSERVER
                        </button>
                        <button className="vehicle-card__details-btn" onClick={(e) => e.stopPropagation()}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="vehicle-card__expand">
                    <div className="vehicle-card__expand-content">
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Disponible</span>
                        <span className="vehicle-card__expand-value">Paris / Milan / Amsterdam / Munich</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Nombre chevaux</span>
                        <span className="vehicle-card__expand-value">320 HP</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Vitesse max</span>
                        <span className="vehicle-card__expand-value">220 KM/H</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Passagers</span>
                        <span className="vehicle-card__expand-value">4 personnes</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Bagages</span>
                        <span className="vehicle-card__expand-value">2 valises</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Options</span>
                        <span className="vehicle-card__expand-value">WiFi, Sièges enfant</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`vehicle-card ${expandedVehicle === 'van-luxe' ? 'is-expanded' : ''} ${selectedVehicle === 'van-luxe' ? 'selected' : ''}`}
                  onClick={() => {
                    handleVehicleSelect('van-luxe')
                    setExpandedVehicle(expandedVehicle === 'van-luxe' ? null : 'van-luxe')
                  }}
                >
                  <div className="vehicle-card__image-wrapper">
                    <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Van de Luxe" className="vehicle-card__image" />
                    <div className="vehicle-card__overlay"></div>
                    <div className="vehicle-card__content">
                      <div className="vehicle-card__info">
                        <h3 className="vehicle-card__title">Van Premium</h3>
                        <p className="vehicle-card__tagline">CONFORT MAXIMAL POUR LES GROUPES ET FAMILLES.</p>
                        <div className="vehicle-card__specs">
                          <div className="vehicle-card__spec-badge">
                            <Zap className="vehicle-card__spec-icon" />
                            <span>180KM/H</span>
                          </div>
                          <div className="vehicle-card__spec-badge">
                            <Zap className="vehicle-card__spec-icon" />
                            <span>180KM/H</span>
                          </div>
                        </div>
                      </div>
                      <div className="vehicle-card__actions">
                        <button className="vehicle-card__reserve-btn" onClick={(e) => { e.stopPropagation(); handleVehicleSelect('van-luxe'); scrollToSection('booking-route'); }}>
                          RÉSERVER
                        </button>
                        <button className="vehicle-card__details-btn" onClick={(e) => e.stopPropagation()}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="vehicle-card__expand">
                    <div className="vehicle-card__expand-content">
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Disponible</span>
                        <span className="vehicle-card__expand-value">Paris / Milan / Amsterdam / Munich</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Nombre chevaux</span>
                        <span className="vehicle-card__expand-value">280 HP</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Vitesse max</span>
                        <span className="vehicle-card__expand-value">180 KM/H</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Passagers</span>
                        <span className="vehicle-card__expand-value">8 personnes</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Bagages</span>
                        <span className="vehicle-card__expand-value">6 valises</span>
                      </div>
                      <div className="vehicle-card__expand-item">
                        <span className="vehicle-card__expand-label">Options</span>
                        <span className="vehicle-card__expand-value">Champagne, WiFi, Sièges enfant, Bar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-xl">
                <button 
                  className="btn btn--primary btn--large" 
                  disabled={!validateStep('vehicle')}
                  onClick={() => scrollToSection('booking-route')}
                >
                  CHOISIR
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Booking - Route Selection */}
        <section className="section" id="booking-route">
          <div className="section__overlay"></div>
          <div className="section__content">
            <h2 className="text-center mb-lg">Sélectionnez votre itinéraire</h2>
            <div className="route-list">
              <div 
                className={`route-card ${(bookingState.route.type === 'preset' && bookingState.route.presetId === 'cdg_paris') ? 'selected' : ''}`}
                onClick={() => handleRouteSelect('preset', 'cdg_paris')}
              >
                <div className="route-card__image-wrapper">
                  <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Transfert aéroport" className="route-card__image" />
                  <div className="route-card__overlay"></div>
                  <div className="route-card__content">
                    <div className="route-card__info">
                      <h3 className="route-card__title">Transfert aéroport</h3>
                      <p className="route-card__tagline">L'EXCELLENCE POUR VOS MOMENTS PRESTIGIEUX.</p>
                    </div>
                    <div className="route-card__actions">
                      <button className="route-card__details-btn" onClick={(e) => { e.stopPropagation(); handleRouteSelect('preset', 'cdg_paris'); }}>
                        <span>+</span>
                        <div className="route-card__arrow-icon">
                          <ChevronRight size={20} strokeWidth={2.5} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`route-card ${(bookingState.route.type === 'preset' && bookingState.route.presetId === 'disneyland') ? 'selected' : ''}`}
                onClick={() => handleRouteSelect('preset', 'disneyland')}
              >
                <div className="route-card__image-wrapper">
                  <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Disneyland" className="route-card__image" />
                  <div className="route-card__overlay"></div>
                  <div className="route-card__content">
                    <div className="route-card__info">
                      <h3 className="route-card__title">Disneyland</h3>
                      <p className="route-card__tagline">L'EXCELLENCE POUR VOS MOMENTS PRESTIGIEUX.</p>
                    </div>
                    <div className="route-card__actions">
                      <button className="route-card__details-btn" onClick={(e) => { e.stopPropagation(); handleRouteSelect('preset', 'disneyland'); }}>
                        <span>+</span>
                        <div className="route-card__arrow-icon">
                          <ChevronRight size={20} strokeWidth={2.5} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`route-card ${(bookingState.route.type === 'preset' && bookingState.route.presetId === 'orly_paris') ? 'selected' : ''}`}
                onClick={() => handleRouteSelect('preset', 'orly_paris')}
              >
                <div className="route-card__image-wrapper">
                  <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Trajet rapide" className="route-card__image" />
                  <div className="route-card__overlay"></div>
                  <div className="route-card__content">
                    <div className="route-card__info">
                      <h3 className="route-card__title">Trajet rapide</h3>
                      <p className="route-card__tagline">L'EXCELLENCE POUR VOS MOMENTS PRESTIGIEUX.</p>
                    </div>
                    <div className="route-card__actions">
                      <button className="route-card__details-btn" onClick={(e) => { e.stopPropagation(); handleRouteSelect('preset', 'orly_paris'); }}>
                        <span>+</span>
                        <div className="route-card__arrow-icon">
                          <ChevronRight size={20} strokeWidth={2.5} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`route-card ${bookingState.route.type === 'custom' ? 'selected' : ''}`}
                onClick={() => handleRouteSelect('custom')}
              >
                <div className="route-card__image-wrapper">
                  <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Itinéraire personnalisé" className="route-card__image" />
                  <div className="route-card__overlay"></div>
                  <div className="route-card__content">
                    <div className="route-card__info">
                      <h3 className="route-card__title">Itinéraire personnalisé</h3>
                      <p className="route-card__tagline">L'EXCELLENCE POUR VOS MOMENTS PRESTIGIEUX.</p>
                    </div>
                    <div className="route-card__actions">
                      <button className="route-card__details-btn" onClick={(e) => { e.stopPropagation(); handleRouteSelect('custom'); }}>
                        <span>+</span>
                        <div className="route-card__arrow-icon">
                          <ChevronRight size={20} strokeWidth={2.5} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-container">

              {bookingState.route.type === 'custom' && (
                <div id="customRouteForm">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pickupAddress">Adresse de prise en charge</label>
                    <input 
                      type="text" 
                      id="pickupAddress" 
                      className="form-input" 
                      placeholder="Ex: 123 Avenue des Champs-Élysées, Paris"
                      value={bookingState.route.customRoute.pickup.address || ''}
                      onChange={(e) => handleCustomRouteChange('pickup.address', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dropoffAddress">Adresse de destination</label>
                    <input 
                      type="text" 
                      id="dropoffAddress" 
                      className="form-input" 
                      placeholder="Ex: Aéroport Charles de Gaulle"
                      value={bookingState.route.customRoute.dropoff.address || ''}
                      onChange={(e) => handleCustomRouteChange('dropoff.address', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pickupInstructions">Instructions spéciales (optionnel)</label>
                    <input 
                      type="text" 
                      id="pickupInstructions" 
                      className="form-input" 
                      placeholder="Ex: Porte cochère gauche"
                      onChange={(e) => handleCustomRouteChange('pickup.instructions', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="text-center mt-xl">
                <button 
                  className="btn btn--primary btn--large" 
                  disabled={!validateStep('route')}
                  onClick={() => scrollToSection('booking-details')}
                >
                  CONTINUER
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Booking - Details */}
        <section className="section" id="booking-details">
          <div className="section__overlay"></div>
          <div className="section__content">
            <h2 className="text-center mb-lg">Détails de votre réservation</h2>
            <div className="form-container--small">
              <div className="form-group">
                <label className="form-label" htmlFor="bookingDate">Date</label>
                <input 
                  type="date" 
                  id="bookingDate" 
                  className="form-input" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingState.schedule.date || ''}
                  onChange={(e) => handleDetailsChange('schedule.date', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="bookingTime">Heure</label>
                <input 
                  type="time" 
                  id="bookingTime" 
                  className="form-input" 
                  required
                  value={bookingState.schedule.time || ''}
                  onChange={(e) => handleDetailsChange('schedule.time', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="passengerName">Nom complet</label>
                <input 
                  type="text" 
                  id="passengerName" 
                  className="form-input" 
                  placeholder="Prénom et nom" 
                  required
                  onChange={(e) => handleDetailsChange('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="passengerPhone">Téléphone</label>
                <input 
                  type="tel" 
                  id="passengerPhone" 
                  className="form-input" 
                  placeholder="+33 6 12 34 56 78" 
                  required
                  value={bookingState.passenger.phone || ''}
                  onChange={(e) => handleDetailsChange('passenger.phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="passengerEmail">Email</label>
                <input 
                  type="email" 
                  id="passengerEmail" 
                  className="form-input" 
                  placeholder="votre@email.com" 
                  required
                  value={bookingState.passenger.email || ''}
                  onChange={(e) => handleDetailsChange('passenger.email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="specialRequests">Demandes spéciales (optionnel)</label>
                <textarea 
                  id="specialRequests" 
                  className="form-input" 
                  rows="3" 
                  placeholder="Ex: Siège enfant, Champagne, etc."
                  value={bookingState.passenger.specialRequests || ''}
                  onChange={(e) => handleDetailsChange('passenger.specialRequests', e.target.value)}
                />
              </div>
              <div className="text-center mt-xl">
                <button 
                  className="btn btn--primary btn--large" 
                  disabled={!validateStep('details')}
                  onClick={handleConfirmDetails}
                >
                  CONTINUER
                </button>
              </div>

              {/* Récapitulatif et Paiement */}
              {showSummary && (
                <div id="bookingSummarySection" className="mt-2xl">
                  <h2 className="text-center mb-lg">Récapitulatif</h2>
                  <div className="summary-card">
                    <div className="grid-gap-md">
                      <div>
                        <strong className="label-text">Véhicule</strong>
                        <p className="summary-value">{getVehicleName(bookingState.vehicle.id)}</p>
                      </div>
                      <div>
                        <strong className="label-text">Itinéraire</strong>
                        <p className="summary-value">
                          {bookingState.route.type === 'preset' 
                            ? bookingState.route.presetId.replace(/_/g, ' → ').replace(/\b\w/g, l => l.toUpperCase())
                            : `${bookingState.route.customRoute.pickup.address || ''} → ${bookingState.route.customRoute.dropoff.address || ''}`
                          }
                        </p>
                      </div>
                      <div>
                        <strong className="label-text">Date & Heure</strong>
                        <p className="summary-value">
                          {bookingState.schedule.date ? new Date(bookingState.schedule.date).toLocaleDateString('fr-FR') : ''} {bookingState.schedule.time || ''}
                        </p>
                      </div>
                      <div>
                        <strong className="label-text">Passager</strong>
                        <p className="summary-value">
                          {bookingState.passenger.firstName || ''} {bookingState.passenger.lastName || ''}
                        </p>
                        <p className="summary-meta">
                          {bookingState.passenger.phone || ''}<br />
                          {bookingState.passenger.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mode de paiement</label>
                    <div className="grid-auto-fit--small">
                      <button 
                        className={`btn btn--primary ${bookingState.payment.method === 'card' ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelect('card')}
                      >
                        Carte bancaire
                      </button>
                      <button 
                        className={`btn btn--primary ${bookingState.payment.method === 'apple_pay' ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelect('apple_pay')}
                      >
                        Apple Pay
                      </button>
                      <button 
                        className={`btn btn--primary ${bookingState.payment.method === 'invoice' ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelect('invoice')}
                      >
                        Facture
                      </button>
                    </div>
                  </div>

                  <div className="text-center mt-xl">
                    <button 
                      className="btn btn--white btn--large" 
                      disabled={!bookingState.payment.method}
                      onClick={() => {
                        console.log('Booking confirmed:', bookingState)
                        alert('Réservation confirmée ! Vous recevrez un email de confirmation sous peu.')
                      }}
                    >
                      CONFIRMER LA RÉSERVATION
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section About - L'Excellence avec FleetPrivée */}
        <section className="section" id="about">
          <img 
            src="https://mercedes-benz-mauritius.com//uploads/vehicles/versions/21C0407_011.jpg" 
            alt="Luxury Vehicle" 
            className="section__bg"
          />
          <div className="section__overlay"></div>
          <div className="section__content">
            <h2 className="text-center mb-xl">L'Excellence avec FleetPrivée</h2>
            <div className="accordion-group">
              <div className={`accordion ${openAccordion === 'qui' ? 'is-open' : ''}`}>
                <div className="accordion__header" onClick={() => setOpenAccordion(openAccordion === 'qui' ? null : 'qui')}>
                  <h3 className="accordion__title">Qui sommes nous ?</h3>
                  <ChevronRight className="accordion__icon" />
                </div>
                <div className="accordion__content">
                  <div className="accordion__body">
                    <div className="accordion__text">
                      <p>FleetPrivée est une entreprise spécialisée dans le transport de luxe depuis 2018. Nous proposons une flotte exclusive de véhicules haut de gamme avec des chauffeurs professionnels expérimentés, dédiés à offrir une expérience de transport exceptionnelle.</p>
                      <p>Notre mission est de transformer chaque trajet en un moment de confort et d'élégance, que ce soit pour vos déplacements professionnels, vos événements spéciaux ou vos transferts aéroport.</p>
                      <p>Avec des agences à Paris, Milan, Amsterdam et Munich, nous couvrons les principales destinations européennes avec le même niveau d'excellence.</p>
                    </div>
                    <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Chauffeur professionnel" className="accordion__image" />
                  </div>
                </div>
              </div>

              <div className={`accordion ${openAccordion === 'diff' ? 'is-open' : ''}`}>
                <div className="accordion__header" onClick={() => setOpenAccordion(openAccordion === 'diff' ? null : 'diff')}>
                  <h3 className="accordion__title">Comment se différencie autres Shuttle ?</h3>
                  <ChevronRight className="accordion__icon" />
                </div>
                <div className="accordion__content">
                  <div className="accordion__body">
                    <div className="accordion__text">
                      <p>FleetPrivée se distingue par son approche personnalisée et son attention aux détails. Contrairement aux services de transport classiques, nous offrons :</p>
                      <ul className="list-unstyled">
                        <li className="mb-12">✓ Une flotte exclusivement composée de véhicules premium (Mercedes Classe S, Classe E, Vans de luxe)</li>
                        <li className="mb-12">✓ Des chauffeurs formés aux standards de l'excellence, bilingues et discrets</li>
                        <li className="mb-12">✓ Un service sur-mesure avec options personnalisables (champagne, WiFi, sièges enfant)</li>
                        <li className="mb-12">✓ Un suivi en temps réel de votre réservation et une disponibilité 24/7</li>
                        <li className="mb-12">✓ Des tarifs transparents sans frais cachés</li>
                      </ul>
                      <p>Chaque trajet est conçu pour être une expérience mémorable, où le confort et la ponctualité sont garantis.</p>
                    </div>
                    <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Véhicule de luxe" className="accordion__image" />
                  </div>
                </div>
              </div>

              <div className={`accordion ${openAccordion === 'shuttle' ? 'is-open' : ''}`}>
                <div className="accordion__header" onClick={() => setOpenAccordion(openAccordion === 'shuttle' ? null : 'shuttle')}>
                  <h3 className="accordion__title">Qu'est ce qu'un Shuttle ?</h3>
                  <ChevronRight className="accordion__icon" />
                </div>
                <div className="accordion__content">
                  <div className="accordion__body">
                    <div className="accordion__text">
                      <p>Un Shuttle, dans notre contexte, désigne un service de transport privé avec chauffeur, généralement utilisé pour des trajets point à point ou des transferts aéroport.</p>
                      <p>Chez FleetPrivée, nous avons élevé le concept du Shuttle à un niveau supérieur en proposant :</p>
                      <ul className="list-unstyled">
                        <li className="mb-12">• Des véhicules de prestige plutôt que des minibus standards</li>
                        <li className="mb-12">• Un service individuel et personnalisé, non partagé</li>
                        <li className="mb-12">• Des itinéraires flexibles adaptés à vos besoins</li>
                        <li className="mb-12">• Un confort et une discrétion de niveau VIP</li>
                      </ul>
                      <p>Notre service Shuttle est idéal pour les professionnels exigeants, les événements d'entreprise, les mariages, ou simplement pour ceux qui souhaitent voyager dans les meilleures conditions.</p>
                    </div>
                    <img src="https://mercedes-benz-mauritius.com/uploads/vehicles/versions/s-class_Advert-photo.jpg" alt="Service Shuttle" className="accordion__image" />
                  </div>
                </div>
              </div>

              <div className={`accordion ${openAccordion === 'reserver' ? 'is-open' : ''}`}>
                <div className="accordion__header" onClick={() => setOpenAccordion(openAccordion === 'reserver' ? null : 'reserver')}>
                  <h3 className="accordion__title">Comment réserver ?</h3>
                  <ChevronRight className="accordion__icon" />
                </div>
                <div className="accordion__content">
                  <div className="accordion__body">
                    <div className="accordion__text">
                      <p>Réserver avec FleetPrivée est simple et rapide :</p>
                      <ol className="ol-padding">
                        <li className="mb-12"><strong>Choisissez votre véhicule</strong> parmi notre flotte premium (Mercedes Classe S, Classe E, Vans de luxe)</li>
                        <li className="mb-12"><strong>Sélectionnez votre itinéraire</strong> : utilisez nos trajets rapides (Aéroport CDG, Orly, Disneyland) ou créez un trajet personnalisé</li>
                        <li className="mb-12"><strong>Renseignez les détails</strong> : date, heure, adresses de prise en charge et de destination, nombre de passagers</li>
                        <li className="mb-12"><strong>Personnalisez votre expérience</strong> : options supplémentaires (champagne, WiFi, sièges enfant, etc.)</li>
                        <li className="mb-12"><strong>Validez et payez</strong> : consultez le récapitulatif et choisissez votre mode de paiement</li>
                      </ol>
                      <p>Vous recevrez une confirmation immédiate par email avec tous les détails de votre réservation. Notre équipe reste disponible 24/7 pour toute assistance.</p>
                    </div>
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80" alt="Réservation en ligne" className="accordion__image" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-xl">
              <button className="btn btn--white btn--large" onClick={() => scrollToSection('booking-vehicle')}>
                RÉSERVER MAINTENANT
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Navigation Indicators */}
      {currentSection >= 2 && (
        <nav className={`nav-indicators ${currentSection >= 2 ? 'visible' : ''}`}>
          <a 
            href="#booking-vehicle" 
            className={`nav-indicator ${currentSection === 2 ? 'is-active' : ''} ${validateStep('vehicle') ? 'is-validated' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('booking-vehicle'); }}
          >
            <span className="nav-indicator__number">1</span>
            <Check className="nav-indicator__check" size={16} strokeWidth={2.5} />
          </a>
          <a 
            href="#booking-route" 
            className={`nav-indicator ${currentSection === 3 ? 'is-active' : ''} ${validateStep('route') ? 'is-validated' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('booking-route'); }}
          >
            <span className="nav-indicator__number">2</span>
            <Check className="nav-indicator__check" size={16} strokeWidth={2.5} />
          </a>
          <a 
            href="#booking-details" 
            className={`nav-indicator ${currentSection === 4 ? 'is-active' : ''} ${validateStep('details') ? 'is-validated' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('booking-details'); }}
          >
            <span className="nav-indicator__number">3</span>
            <Check className="nav-indicator__check" size={16} strokeWidth={2.5} />
          </a>
        </nav>
      )}
    </>
  )
}

export default App