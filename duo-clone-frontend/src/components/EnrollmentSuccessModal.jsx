import { useEffect } from 'react'
import { FaCheckCircle, FaRocket } from 'react-icons/fa'
import confetti from 'canvas-confetti'
import './EnrollmentSuccessModal.css'

export default function EnrollmentSuccessModal({ courseName, onClose, onContinue }) {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Auto-redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      onContinue()
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(redirectTimer)
    }
  }, [onContinue])

  return (
    <>
      <div className="enrollment-modal-overlay" onClick={onClose} />
      <div className="enrollment-modal">
        <div className="enrollment-modal-content">
          <div className="success-icon-container">
            <FaCheckCircle className="success-icon" />
          </div>
          
          <h2 className="enrollment-title">Successfully Enrolled!</h2>
          
          <p className="enrollment-message">
            You've been enrolled in <strong>{courseName}</strong>
          </p>
          
          <div className="enrollment-animation">
            <FaRocket className="rocket-icon" />
          </div>
          
          <p className="redirect-message">
            Redirecting to your course in a moment...
          </p>
          
          <div className="enrollment-actions">
            <button className="btn-continue-now" onClick={onContinue}>
              Start Learning Now
            </button>
            <button className="btn-go-home" onClick={onClose}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
