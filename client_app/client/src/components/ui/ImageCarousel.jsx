import React, { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

/**
 * ImageCarousel - A reusable, customizable image carousel component
 * 
 * @param {Object} props
 * @param {string[]} props.images - Array of image paths/URLs (required)
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.imageClassName - Additional CSS classes for individual images
 * @param {boolean} props.showDots - Show dot indicators (default: true)
 * @param {boolean} props.showArrows - Show navigation arrows (default: true)
 * @param {boolean} props.autoPlay - Enable autoplay (default: false)
 * @param {number} props.autoPlayInterval - Autoplay interval in ms (default: 5000)
 * @param {number} props.transitionDuration - Transition duration in ms (default: 500)
 * @param {string} props.arrowClassName - Additional CSS classes for navigation arrows
 * @param {string} props.dotClassName - Additional CSS classes for dot indicators
 * @param {string} props.activeDotClassName - Additional CSS classes for active dot
 */
export default function ImageCarousel({
  images = [],
  className = '',
  imageClassName = '',
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  transitionDuration = 500,
  arrowClassName = '',
  dotClassName = '',
  activeDotClassName = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, images.length])

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Don't render if no images
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Images container */}
      <div 
        className="flex w-full h-full transition-transform ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transitionDuration: `${transitionDuration}ms`
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full shrink-0"
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={`w-full h-full object-cover ${imageClassName}`}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 ${arrowClassName}`}
            aria-label="Previous image"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 ${arrowClassName}`}
            aria-label="Next image"
          >
            <FaChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? `bg-white ${activeDotClassName}`
                  : `bg-white/50 hover:bg-white/75 ${dotClassName}`
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

