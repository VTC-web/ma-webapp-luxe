import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useAnimationControls } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

function SlideToUnlock({ onComplete }) {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const thumbX = useMotionValue(0)
  const threshold = 0.85
  
  // Calculate fill width from thumbX using useTransform - synchronized with button position
  const fillWidth = useTransform(thumbX, (latest) => {
    if (!trackRef.current || !thumbRef.current) return '0%'
    const trackWidth = trackRef.current.offsetWidth
    const thumbWidth = thumbRef.current.offsetWidth
    const minX = 6
    const maxX = trackWidth - thumbWidth - 6
    const currentX = Math.max(0, Math.min(maxX - minX, latest))
    const fillPercent = (currentX / (maxX - minX)) * 100
    return `${Math.max(0, Math.min(100, fillPercent))}%`
  })
  
  // Calculate icon rotation from thumbX - synchronized with button position
  const iconRotation = useTransform(thumbX, (latest) => {
    if (!trackRef.current || !thumbRef.current) return 0
    const trackWidth = trackRef.current.offsetWidth
    const thumbWidth = thumbRef.current.offsetWidth
    const minX = 6
    const maxX = trackWidth - thumbWidth - 6
    const totalDistance = maxX - minX
    const thresholdDistance = totalDistance * threshold
    const distanceTraveled = Math.max(0, Math.min(latest, thresholdDistance))
    return (distanceTraveled / thresholdDistance) * 90
  })
  
  // Calculate icon scale from thumbX - synchronized with button position
  const iconScale = useTransform(thumbX, (latest) => {
    if (!trackRef.current || !thumbRef.current) return 1
    const trackWidth = trackRef.current.offsetWidth
    const thumbWidth = thumbRef.current.offsetWidth
    const minX = 6
    const maxX = trackWidth - thumbWidth - 6
    const currentX = Math.max(0, Math.min(maxX - minX, latest))
    const fillPercent = (currentX / (maxX - minX)) * 100
    return 1 + (fillPercent / 100) * 0.15
  })

  const thumbControls = useAnimationControls()

  useEffect(() => {
    const thumb = thumbRef.current
    const track = trackRef.current
    if (!thumb || !track) return

    const handleMove = (e) => {
      if (!isDragging) return
      e.preventDefault()
      
      const eventX = e.touches ? e.touches[0].clientX : e.clientX
      const rect = track.getBoundingClientRect()
      const thumbWidth = thumb.offsetWidth
      const minX = 6
      const maxX = rect.width - thumbWidth - 6
      const relativeX = eventX - rect.left
      const newX = Math.max(minX, Math.min(maxX, relativeX - thumbWidth / 2))
      
      thumbX.set(newX - minX)
    }

    const handleEnd = () => {
      if (!isDragging) return
      setIsDragging(false)
      
      const currentX = thumbX.get()
      const trackWidth = track.offsetWidth
      const thumbWidth = thumb.offsetWidth
      const minX = 6
      const maxX = trackWidth - thumbWidth - 6
      const fillPercent = (currentX / (maxX - minX)) * 100

      if (fillPercent >= threshold * 100) {
        // Complete
        thumbControls.start({
          x: maxX - minX,
          transition: { type: 'spring', stiffness: 50, damping: 20 }
        }).then(() => {
          if (onComplete) onComplete()
        })
      } else {
        // Reset
        thumbControls.start({
          x: 0,
          transition: { type: 'spring', stiffness: 50, damping: 20 }
        })
        thumbX.set(0)
      }
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, thumbControls, thumbX, threshold, onComplete])

  return (
    <div className="slide-unlock">
      <div className="slide-unlock__track" ref={trackRef}>
        <motion.div 
          className="slide-unlock__fill"
          style={{ width: fillWidth }}
        />
        <div className="slide-unlock__text">Glissez pour réserver</div>
      </div>
      <motion.div
        className="slide-unlock__thumb"
        ref={thumbRef}
        drag="x"
        dragConstraints={() => {
          if (!trackRef.current || !thumbRef.current) return { left: 0, right: 0 }
          const trackWidth = trackRef.current.offsetWidth
          const thumbWidth = thumbRef.current.offsetWidth
          const minX = 6
          const maxX = trackWidth - thumbWidth - 6
          return { left: 0, right: maxX - minX }
        }}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDrag={(event, info) => {
          if (!trackRef.current || !thumbRef.current) return
          const trackWidth = trackRef.current.offsetWidth
          const thumbWidth = thumbRef.current.offsetWidth
          const minX = 6
          const maxX = trackWidth - thumbWidth - 6
          const constrainedX = Math.max(0, Math.min(maxX - minX, info.offset.x))
          thumbX.set(constrainedX)
        }}
        onDragEnd={() => setIsDragging(false)}
        style={{ 
          x: thumbX,
          left: 6
        }}
        whileHover={{ x: -15 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        <motion.div
          style={{
            rotate: iconRotation,
            scale: iconScale
          }}
        >
          <ChevronRight className="slide-unlock__icon" size={24} strokeWidth={2.5} />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SlideToUnlock
