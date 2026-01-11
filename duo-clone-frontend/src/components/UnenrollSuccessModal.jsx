import { useEffect } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import './UnenrollSuccessModal.css'

export default function UnenrollSuccessModal({ courseName, onClose }) {
  useEffect(() => {
    // Auto-redirect after 2 seconds
    const timer = setTimeout(() => {
      onClose()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <>
      <div className="unenroll-success-overlay" onClick={onClose} />
      <div className="unenroll-success-modal">
        <div className="unenroll-success-content">
          <FaCheckCircle className="unenroll-success-icon" />
          <h2>Unenrolled Successfully</h2>
          <p>You've been unenrolled from <strong>{courseName}</strong></p>
          <p className="redirect-text">Redirecting to home...</p>
        </div>
      </div>
    </>
  )
}
