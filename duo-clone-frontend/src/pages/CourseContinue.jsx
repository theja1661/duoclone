import './CourseContinue.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiService } from '../services/api'
import { CourseIcon } from '../components/IconFinder'
import { getUser } from '../context/UserContext'
import { FaChevronLeft, FaChevronRight, FaCheck, FaLock, FaSignOutAlt, FaTimes, FaEllipsisV } from 'react-icons/fa'
import UnenrollSuccessModal from '../components/UnenrollSuccessModal'

export default function CourseContinue() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [currentSection, setCurrentSection] = useState('technical') // 'technical' or 'mcq'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [technicalProgress, setTechnicalProgress] = useState([])
  const [mcqProgress, setMcqProgress] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showUnenrollModal, setShowUnenrollModal] = useState(false)
  const [showUnenrollSuccess, setShowUnenrollSuccess] = useState(false)
  const [unenrolling, setUnenrolling] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      navigate('/signin', { replace: true })
      return
    }
    setUser(currentUser)
  }, [navigate])

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const courseData = await apiService.getCourseDetails(id)
        
        if (!courseData.enrolled) {
          navigate(`/course-enroll/${id}`, { replace: true })
          return
        }
        
        setCourse(courseData)
        
        // Initialize progress arrays
        const techProgress = new Array(courseData.technicalContent?.length || 0).fill(false)
        const mcqProgressArray = new Array(courseData.mcqQuestions?.length || 0).fill(false)
        
        // Get saved progress from backend
        const savedProgress = await apiService.getCourseProgress(id)
        if (savedProgress) {
          setTechnicalProgress(savedProgress.technicalProgress || techProgress)
          setMcqProgress(savedProgress.mcqProgress || mcqProgressArray)
          setCurrentIndex(savedProgress.currentIndex || 0)
          setCurrentSection(savedProgress.currentSection || 'technical')
        } else {
          setTechnicalProgress(techProgress)
          setMcqProgress(mcqProgressArray)
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCourse()
    }
  }, [id, user, navigate])

  const updateProgress = async (newTechnicalProgress = technicalProgress, newMcqProgress = mcqProgress) => {
    const totalTechnical = course.technicalContent?.length || 0
    const totalMcq = course.mcqQuestions?.length || 0
    const completedTechnical = newTechnicalProgress.filter(Boolean).length
    const completedMcq = newMcqProgress.filter(Boolean).length
    
    const overallProgress = Math.round(
      ((completedTechnical + completedMcq) / (totalTechnical + totalMcq)) * 100
    )

    try {
      await apiService.updateCourseProgress(id, {
        progress: overallProgress,
        technicalProgress: newTechnicalProgress,
        mcqProgress: newMcqProgress,
        currentIndex,
        currentSection,
        completed: overallProgress === 100
      })
      console.log('Progress saved:', overallProgress)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleMarkComplete = async () => {
    const newProgress = [...technicalProgress]
    newProgress[currentIndex] = true
    setTechnicalProgress(newProgress)
    
    // Save immediately
    await updateProgress(newProgress, mcqProgress)
    
    // Then move to next
    setTimeout(() => handleNext(), 300)
  }

  const handleMcqAnswer = async (answerIndex) => {
    if (showExplanation) return
    
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === currentMcqItem.correctAnswerIndex
    setIsCorrect(correct)
    setShowExplanation(true)
    
    if (correct) {
      const newProgress = [...mcqProgress]
      newProgress[currentIndex] = true
      setMcqProgress(newProgress)
      
      // Save immediately
      await updateProgress(technicalProgress, newProgress)
    }
  }

  const handleNext = () => {
    setShowExplanation(false)
    setSelectedAnswer(null)
    
    if (currentSection === 'technical') {
      if (currentIndex < (course.technicalContent?.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Move to MCQ section
        setCurrentSection('mcq')
        setCurrentIndex(0)
      }
    } else {
      if (currentIndex < (course.mcqQuestions?.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Course completed
        alert('Congratulations! You have completed this course!')
        navigate('/home')
      }
    }
  }

  const handlePrevious = () => {
    setShowExplanation(false)
    setSelectedAnswer(null)
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (currentSection === 'mcq') {
      setCurrentSection('technical')
      setCurrentIndex((course.technicalContent?.length || 1) - 1)
    }
  }

  const handleUnenroll = async () => {
    if (!course) return
    
    setUnenrolling(true)
    try {
      await apiService.unenrollCourse(id)
      setShowUnenrollModal(false)
      setShowUnenrollSuccess(true)
    } catch (error) {
      console.error('Error unenrolling:', error)
      alert(error.response?.data?.error || 'Failed to unenroll. Please try again.')
      setShowUnenrollModal(false)
    } finally {
      setUnenrolling(false)
    }
  }

  const handleUnenrollSuccessClose = () => {
    setShowUnenrollSuccess(false)
    navigate('/home', { replace: true })
  }

  if (loading || !course) {
    return (
      <div className="course-continue-page">
        <div className="loading-container">
          <p>Loading course...</p>
        </div>
      </div>
    )
  }

  const allTechnicalCompleted = technicalProgress.every(Boolean)
  const isMcqLocked = !allTechnicalCompleted && currentSection === 'mcq'

  const currentTechnicalItem = course.technicalContent?.[currentIndex]
  const currentMcqItem = course.mcqQuestions?.[currentIndex]

  const totalItems = (course.technicalContent?.length || 0) + (course.mcqQuestions?.length || 0)
  const completedItems = [...technicalProgress, ...mcqProgress].filter(Boolean).length
  const overallProgress = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="course-continue-page">
      {/* Unenroll Success Modal */}
      {showUnenrollSuccess && (
        <UnenrollSuccessModal
          courseName={course.name}
          onClose={handleUnenrollSuccessClose}
        />
      )}

      {/* Unenroll Warning Modal */}
      {showUnenrollModal && (
        <>
          <div className="modal-overlay" onClick={() => !unenrolling && setShowUnenrollModal(false)} />
          <div className="unenroll-modal">
            <button className="modal-close-btn" onClick={() => setShowUnenrollModal(false)} disabled={unenrolling}>
              <FaTimes />
            </button>
            <div className="modal-icon-warning">
              <FaSignOutAlt size={40} />
            </div>
            <h2>Unenroll from Course?</h2>
            <p className="modal-warning-text">
              This will permanently remove all your progress in <strong>{course?.name}</strong>.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowUnenrollModal(false)}
                disabled={unenrolling}
              >
                Cancel
              </button>
              <button 
                className="btn-unenroll-confirm" 
                onClick={handleUnenroll}
                disabled={unenrolling}
              >
                {unenrolling ? 'Unenrolling...' : 'Unenroll'}
              </button>
            </div>
          </div>
        </>
      )}

      <header className="continue-header">
        <button className="btn-back-arrow" onClick={() => navigate('/home')} aria-label="Back to Home">
          <FaChevronLeft />
        </button>
        <div className="header-content">
          <div className="course-icon-small">
            <CourseIcon courseName={course?.name} size={32} />
          </div>
          <div className="header-info">
            <h2>{course?.name}</h2>
            <div className="progress-indicator">
              <span className="progress-text">{completedItems} / {totalItems} completed</span>
              <div className="progress-bar-header">
                <div className="progress-fill-header" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Options Menu */}
        <div className="course-options-menu">
          <button 
            className="btn-options" 
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            aria-label="Course options"
          >
            <FaEllipsisV />
          </button>
          
          {showOptionsMenu && (
            <>
              <div className="options-overlay" onClick={() => setShowOptionsMenu(false)} />
              <div className="options-dropdown">
                <button 
                  className="option-item option-danger"
                  onClick={() => {
                    setShowOptionsMenu(false)
                    setShowUnenrollModal(true)
                  }}
                >
                  <FaSignOutAlt />
                  <span>Unenroll</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="continue-main">
        <div className="content-area">
          {/* Section Tabs */}
          <div className="section-tabs">
            <button
              className={`section-tab ${currentSection === 'technical' ? 'active' : ''}`}
              onClick={() => {
                setCurrentSection('technical')
                setCurrentIndex(0)
              }}
            >
              Technical Content ({technicalProgress.filter(Boolean).length}/{course.technicalContent?.length || 0})
            </button>
            <button
              className={`section-tab ${currentSection === 'mcq' ? 'active' : ''} ${!allTechnicalCompleted ? 'locked' : ''}`}
              onClick={() => {
                if (allTechnicalCompleted) {
                  setCurrentSection('mcq')
                  setCurrentIndex(0)
                }
              }}
              disabled={!allTechnicalCompleted}
            >
              {!allTechnicalCompleted && <FaLock className="lock-icon" />}
              MCQ Quiz ({mcqProgress.filter(Boolean).length}/{course.mcqQuestions?.length || 0})
            </button>
          </div>

          {/* Content Display */}
          {isMcqLocked ? (
            <div className="locked-content">
              <FaLock size={48} className="lock-icon-large" />
              <h3>MCQ Section Locked</h3>
              <p>Complete all technical content sections to unlock the quiz</p>
              <button className="btn-primary" onClick={() => setCurrentSection('technical')}>
                Go to Technical Content
              </button>
            </div>
          ) : currentSection === 'technical' ? (
            <div className="technical-content-display">
              <div className="content-header">
                <span className="content-number">Lesson {currentIndex + 1} of {course.technicalContent?.length || 0}</span>
                <h1>{currentTechnicalItem?.title}</h1>
                <span className="language-badge">{currentTechnicalItem?.language}</span>
              </div>

              <div className="content-body">
                <p className="content-text">{currentTechnicalItem?.content}</p>

                {currentTechnicalItem?.codeExample && (
                  <div className="code-example">
                    <div className="code-header">
                      <span>Code Example</span>
                    </div>
                    <pre><code>{currentTechnicalItem.codeExample}</code></pre>
                  </div>
                )}
              </div>

              <div className="content-actions">
                {technicalProgress[currentIndex] ? (
                  <div className="completion-badge">
                    <FaCheck /> Completed
                  </div>
                ) : (
                  <button className="btn-mark-complete" onClick={handleMarkComplete}>
                    <FaCheck /> Mark as Complete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mcq-content-display">
              <div className="mcq-header">
                <span className="question-number">Question {currentIndex + 1} of {course.mcqQuestions?.length || 0}</span>
                <h2>{currentMcqItem?.question}</h2>
              </div>

              <div className="mcq-options">
                {currentMcqItem?.options.map((option, index) => (
                  <button
                    key={index}
                    className={`mcq-option ${selectedAnswer === index ? (isCorrect ? 'correct' : 'incorrect') : ''} ${showExplanation && index === currentMcqItem.correctAnswerIndex ? 'correct' : ''}`}
                    onClick={() => handleMcqAnswer(index)}
                    disabled={showExplanation}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                    {showExplanation && index === currentMcqItem.correctAnswerIndex && (
                      <FaCheck className="check-icon" />
                    )}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className={`explanation-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <h4>{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
                  <p>{currentMcqItem?.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button
              className="btn-nav btn-previous"
              onClick={handlePrevious}
              disabled={currentIndex === 0 && currentSection === 'technical'}
            >
              <FaChevronLeft /> Previous
            </button>
            <button
              className="btn-nav btn-next"
              onClick={handleNext}
              disabled={currentSection === 'technical' && !technicalProgress[currentIndex]}
            >
              {currentSection === 'mcq' && currentIndex === (course.mcqQuestions?.length || 1) - 1
                ? 'Finish Course'
                : 'Next'} <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Sidebar Progress */}
        <aside className="progress-sidebar">
          <div className="sidebar-card">
            <h3>Your Progress</h3>
            <div className="circular-progress">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f0e6df" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="8"
                  strokeDasharray={`${overallProgress * 2.827} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="progress-percentage">{overallProgress}%</span>
            </div>
            <p className="progress-description">{completedItems} of {totalItems} items completed</p>
          </div>

          <div className="sidebar-card">
            <h3>Content Checklist</h3>
            <div className="checklist">
              <div className="checklist-section">
                <h4>Technical Content</h4>
                {course.technicalContent?.map((item, index) => (
                  <div key={index} className="checklist-item">
                    <span className={`check-box ${technicalProgress[index] ? 'checked' : ''}`}>
                      {technicalProgress[index] && <FaCheck />}
                    </span>
                    <span className="checklist-text">{item.title}</span>
                  </div>
                ))}
              </div>
              <div className={`checklist-section ${!allTechnicalCompleted ? 'locked' : ''}`}>
                <h4>MCQ Quiz {!allTechnicalCompleted && <FaLock size={12} />}</h4>
                {course.mcqQuestions?.map((item, index) => (
                  <div key={index} className="checklist-item">
                    <span className={`check-box ${mcqProgress[index] ? 'checked' : ''}`}>
                      {mcqProgress[index] && <FaCheck />}
                    </span>
                    <span className="checklist-text">Question {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
