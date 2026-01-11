import './NewCourse.css'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiService } from '../services/api'
import { FaChevronLeft, FaPlus, FaTrash, FaBook, FaCode, FaQuestion } from 'react-icons/fa'
import { getUser } from '../context/UserContext'

function EditCourse() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeSection, setActiveSection] = useState('basic')
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    fullDescription: '',
    level: 'Beginner',
    duration: '',
    totalLessons: 0,
    totalExercises: 0,
    curriculum: [],
    technicalContent: [],
    mcqQuestions: []
  })

  const [newCurriculumItem, setNewCurriculumItem] = useState('')
  const [newTechContent, setNewTechContent] = useState({
    title: '',
    content: '',
    codeExample: '',
    language: 'java'
  })
  const [newMCQ, setNewMCQ] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: ''
  })

  // Check admin access
  useEffect(() => {
    const currentUser = getUser()
    
    if (!currentUser) {
      navigate('/signin', { replace: true })
      return
    }

    setUser(currentUser)

    const userRole = currentUser.role?.replace('ROLE_', '')
    if (userRole !== 'ADMIN') {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) return
      
      try {
        setFetchLoading(true)
        const course = await apiService.getCourseDetails(id)
        setCourseData({
          name: course.name || '',
          description: course.description || '',
          fullDescription: course.fullDescription || '',
          level: course.level || 'Beginner',
          duration: course.duration || '',
          totalLessons: course.totalLessons || 0,
          totalExercises: course.totalExercises || 0,
          curriculum: course.curriculum || [],
          technicalContent: course.technicalContent || [],
          mcqQuestions: course.mcqQuestions || []
        })
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course details')
      } finally {
        setFetchLoading(false)
      }
    }

    if (user) {
      fetchCourse()
    }
  }, [id, user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseData(prev => ({
      ...prev,
      [name]: name === 'totalLessons' || name === 'totalExercises' 
        ? parseInt(value) || 0 
        : value
    }))
  }

  const handleAddCurriculumItem = () => {
    if (newCurriculumItem.trim()) {
      setCourseData(prev => ({
        ...prev,
        curriculum: [...prev.curriculum, newCurriculumItem.trim()]
      }))
      setNewCurriculumItem('')
    }
  }

  const handleRemoveCurriculumItem = (index) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }))
  }

  const handleAddTechContent = () => {
    if (newTechContent.title.trim() && newTechContent.content.trim()) {
      setCourseData(prev => ({
        ...prev,
        technicalContent: [...prev.technicalContent, {...newTechContent}]
      }))
      setNewTechContent({
        title: '',
        content: '',
        codeExample: '',
        language: 'java'
      })
    } else {
      alert('Title and content are required for technical content')
    }
  }

  const handleRemoveTechContent = (index) => {
    setCourseData(prev => ({
      ...prev,
      technicalContent: prev.technicalContent.filter((_, i) => i !== index)
    }))
  }

  const handleMCQOptionChange = (index, value) => {
    const newOptions = [...newMCQ.options]
    newOptions[index] = value
    setNewMCQ(prev => ({ ...prev, options: newOptions }))
  }

  const handleAddMCQ = () => {
    if (newMCQ.question.trim() && newMCQ.options.every(opt => opt.trim())) {
      setCourseData(prev => ({
        ...prev,
        mcqQuestions: [...prev.mcqQuestions, {...newMCQ}]
      }))
      setNewMCQ({
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      })
    } else {
      alert('Question and all options are required')
    }
  }

  const handleRemoveMCQ = (index) => {
    setCourseData(prev => ({
      ...prev,
      mcqQuestions: prev.mcqQuestions.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!courseData.name.trim()) {
        setError('Course name is required')
        setLoading(false)
        return
      }

      if (!courseData.description.trim()) {
        setError('Course description is required')
        setLoading(false)
        return
      }

      const response = await apiService.updateCourse(id, courseData)
      
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(`Course "${courseData.name}" updated successfully!`)
        setTimeout(() => {
          navigate('/admin')
        }, 2000)
      }
    } catch (err) {
      console.error('Error updating course:', err)
      setError(err.response?.data?.error || 'Failed to update course')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadJSON = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    fileInput.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        try {
          const text = await file.text()
          const jsonData = JSON.parse(text)
          
          // Validate JSON structure
          if (!jsonData.name || !jsonData.description) {
            alert('Invalid JSON: name and description are required')
            return
          }
          
          // Ask for confirmation
          const confirmed = window.confirm(
            'This will overwrite ALL current course data. Are you sure you want to continue?'
          )
          
          if (confirmed) {
            setCourseData({
              name: jsonData.name || '',
              description: jsonData.description || '',
              fullDescription: jsonData.fullDescription || '',
              level: jsonData.level || 'Beginner',
              duration: jsonData.duration || '',
              totalLessons: jsonData.totalLessons || 0,
              totalExercises: jsonData.totalExercises || 0,
              curriculum: jsonData.curriculum || [],
              technicalContent: jsonData.technicalContent || [],
              mcqQuestions: jsonData.mcqQuestions || []
            })
            setSuccess('Course data loaded from JSON successfully!')
            setShowUploadModal(false)
          }
        } catch (error) {
          alert('Error reading JSON file. Please check the file format.')
          console.error('JSON parse error:', error)
        }
      }
    }
    fileInput.click()
  }

  const handleShowUploadModal = () => {
    setShowUploadModal(true)
  }

  const handleCloseUploadModal = () => {
    setShowUploadModal(false)
  }

  if (!user || fetchLoading) {
    return (
      <div className="new-course-page">
        <nav className="new-course-navbar">
          <button className="btn-back" onClick={() => navigate('/admin')}>
            <FaChevronLeft /> Back to Admin
          </button>
          <h2>Loading...</h2>
        </nav>
        <div className="new-course-content">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading course details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="new-course-page">
      <nav className="new-course-navbar">
        <button className="btn-back" onClick={() => navigate('/admin')}>
          <FaChevronLeft /> Back to Admin
        </button>
        <h2>Edit Course</h2>
        <button className="btn-upload-json" onClick={handleShowUploadModal}>
          📄 Upload JSON
        </button>
      </nav>

      <div className="new-course-content">
        <div className="section-nav">
          <button 
            className={`section-nav-btn ${activeSection === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveSection('basic')}
          >
            <FaBook /> Basic Info
          </button>
          <button 
            className={`section-nav-btn ${activeSection === 'content' ? 'active' : ''}`}
            onClick={() => setActiveSection('content')}
          >
            <FaCode /> Technical Content ({courseData.technicalContent.length})
          </button>
          <button 
            className={`section-nav-btn ${activeSection === 'mcq' ? 'active' : ''}`}
            onClick={() => setActiveSection('mcq')}
          >
            <FaQuestion /> MCQ Questions ({courseData.mcqQuestions.length})
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {activeSection === 'basic' && (
            <>
              <div className="form-section">
                <h3>Basic Information</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Course Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={courseData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Advanced Java Programming"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Short Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description (shown in course cards)"
                    rows="2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fullDescription">Full Description</label>
                  <textarea
                    id="fullDescription"
                    name="fullDescription"
                    value={courseData.fullDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the course"
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Course Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="level">Level</label>
                    <select
                      id="level"
                      name="level"
                      value={courseData.level}
                      onChange={handleInputChange}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Beginner to Advanced">Beginner to Advanced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={courseData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., ~12 hours"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="totalLessons">Total Lessons</label>
                    <input
                      type="number"
                      id="totalLessons"
                      name="totalLessons"
                      value={courseData.totalLessons}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalExercises">Total Exercises</label>
                    <input
                      type="number"
                      id="totalExercises"
                      name="totalExercises"
                      value={courseData.totalExercises}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Curriculum</h3>
                
                {courseData.curriculum.length > 0 && (
                  <ul className="curriculum-items">
                    {courseData.curriculum.map((item, index) => (
                      <li key={index} className="curriculum-item">
                        <span>{item}</span>
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => handleRemoveCurriculumItem(index)}
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="curriculum-add">
                  <input
                    type="text"
                    value={newCurriculumItem}
                    onChange={(e) => setNewCurriculumItem(e.target.value)}
                    placeholder="Add curriculum topic..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCurriculumItem())}
                  />
                  <button 
                    type="button" 
                    className="btn-add-item" 
                    onClick={handleAddCurriculumItem}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSection === 'content' && (
            <div className="form-section">
              <h3>Technical Content</h3>
              <p className="section-hint">Manage detailed technical content with code examples</p>
              
              {courseData.technicalContent.length > 0 && (
                <div className="added-items">
                  <h4>Current Content ({courseData.technicalContent.length})</h4>
                  {courseData.technicalContent.map((content, index) => (
                    <div key={index} className="added-item-card">
                      <div className="added-item-header">
                        <h5>{content.title}</h5>
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => handleRemoveTechContent(index)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <p>{content.content.substring(0, 100)}...</p>
                      <span className="content-lang">{content.language}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="content-form">
                <h4 className="form-subsection-title">Add New Technical Content</h4>
                {/* ...existing code for adding technical content... */}
                <div className="form-group">
                  <label htmlFor="tech-title">Content Title *</label>
                  <input
                    type="text"
                    id="tech-title"
                    value={newTechContent.title}
                    onChange={(e) => setNewTechContent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Understanding Java Threads"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tech-content">Content Description *</label>
                  <textarea
                    id="tech-content"
                    value={newTechContent.content}
                    onChange={(e) => setNewTechContent(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Detailed explanation..."
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tech-language">Programming Language</label>
                    <select
                      id="tech-language"
                      value={newTechContent.language}
                      onChange={(e) => setNewTechContent(prev => ({ ...prev, language: e.target.value }))}
                    >
                      <option value="java">Java</option>
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tech-code">Code Example</label>
                  <textarea
                    id="tech-code"
                    className="code-textarea"
                    value={newTechContent.codeExample}
                    onChange={(e) => setNewTechContent(prev => ({ ...prev, codeExample: e.target.value }))}
                    placeholder="// Add code example..."
                    rows="8"
                  />
                </div>

                <button type="button" className="btn-add-large" onClick={handleAddTechContent}>
                  <FaPlus /> Add Technical Content
                </button>
              </div>
            </div>
          )}

          {activeSection === 'mcq' && (
            <div className="form-section">
              <h3>MCQ Questions</h3>
              <p className="section-hint">Manage multiple choice questions</p>
              
              {courseData.mcqQuestions.length > 0 && (
                <div className="added-items">
                  <h4>Current Questions ({courseData.mcqQuestions.length})</h4>
                  {courseData.mcqQuestions.map((mcq, index) => (
                    <div key={index} className="added-item-card">
                      <div className="added-item-header">
                        <h5>Q{index + 1}: {mcq.question}</h5>
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => handleRemoveMCQ(index)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <p className="correct-answer">Correct: {mcq.options[mcq.correctAnswerIndex]}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mcq-form">
                <h4 className="form-subsection-title">Add New MCQ Question</h4>
                {/* ...existing code for adding MCQ... */}
                <div className="form-group">
                  <label htmlFor="mcq-question">Question *</label>
                  <textarea
                    id="mcq-question"
                    value={newMCQ.question}
                    onChange={(e) => setNewMCQ(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter the question..."
                    rows="2"
                  />
                </div>

                <div className="mcq-options">
                  <label>Options * (4 required)</label>
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="option-row">
                      <span className="option-label">Option {index + 1}:</span>
                      <input
                        type="text"
                        value={newMCQ.options[index]}
                        onChange={(e) => handleMCQOptionChange(index, e.target.value)}
                        placeholder={`Enter option ${index + 1}`}
                      />
                      <input
                        type="radio"
                        name="correct-answer"
                        checked={newMCQ.correctAnswerIndex === index}
                        onChange={() => setNewMCQ(prev => ({ ...prev, correctAnswerIndex: index }))}
                      />
                      <span className="radio-label">Correct</span>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label htmlFor="mcq-explanation">Explanation</label>
                  <textarea
                    id="mcq-explanation"
                    value={newMCQ.explanation}
                    onChange={(e) => setNewMCQ(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Explain why this answer is correct..."
                    rows="3"
                  />
                </div>

                <button type="button" className="btn-add-large" onClick={handleAddMCQ}>
                  <FaPlus /> Add MCQ Question
                </button>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/admin')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Updating Course...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>

      {/* Upload JSON Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={handleCloseUploadModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Upload JSON File</h3>
              <button className="modal-close" onClick={handleCloseUploadModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="warning-box">
                <p className="warning-text">
                  <strong>Warning:</strong> Uploading a JSON file will <strong>completely overwrite</strong> all current course data including:
                </p>
                <ul className="warning-list">
                  <li>Basic information (name, description, level, etc.)</li>
                  <li>Curriculum topics</li>
                  <li>Technical content sections</li>
                  <li>MCQ questions</li>
                </ul>
                <p className="warning-text">
                  This action cannot be undone unless you save the changes.
                </p>
              </div>
              
              <div className="modal-actions">
                <button className="btn-secondary" onClick={handleCloseUploadModal}>
                  Cancel
                </button>
                <button className="btn-warning" onClick={handleUploadJSON}>
                  Continue & Upload JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditCourse
