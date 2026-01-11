import './UserView.css'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiService } from '../services/api'
import { FaChevronLeft, FaTrash, FaUser, FaEnvelope, FaIdBadge, FaBook, FaTrophy } from 'react-icons/fa'
import { getUser } from '../context/UserContext'

function UserView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      navigate('/signin', { replace: true })
      return
    }
    setCurrentUser(user)

    const userRole = user.role?.replace('ROLE_', '')
    if (userRole !== 'ADMIN') {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return
      
      try {
        setLoading(true)
        const data = await apiService.getUserById(id)
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchUserData()
    }
  }, [id, currentUser])

  const handleDelete = async () => {
    try {
      await apiService.deleteUser(id)
      alert('User deleted successfully')
      navigate('/admin')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  if (!currentUser || loading) {
    return (
      <div className="user-view">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="user-view">
        <div className="error-container">
          <h2>User not found</h2>
          <button className="btn-primary" onClick={() => navigate('/admin')}>
            Back to Admin
          </button>
        </div>
      </div>
    )
  }

  const isAdminUser = userData.role === 'ADMIN' || userData.role === 'ROLE_ADMIN'

  return (
    <div className="user-view">
      <div className="user-view-header">
        <div className="header-left">
          <button className="btn-back-arrow" onClick={() => navigate('/admin')} aria-label="Back to Admin">
            <FaChevronLeft />
          </button>
          <div className="header-icon">
            <FaUser size={48} />
          </div>
          <div className="header-info">
            <h1>{userData.name}</h1>
            <p className="user-email">{userData.email}</p>
            <span className={`role-badge ${userData.role?.toLowerCase()}`}>
              {userData.role?.replace('ROLE_', '')}
            </span>
          </div>
        </div>
        <div className="header-actions">
          {!isAdminUser && (
            <button className="btn-delete" onClick={() => setShowDeleteModal(true)}>
              <FaTrash /> Delete User
            </button>
          )}
        </div>
      </div>

      <div className="user-view-content">
        <div className="user-details-grid">
          <div className="detail-card">
            <div className="detail-icon">
              <FaIdBadge />
            </div>
            <div className="detail-info">
              <span className="detail-label">User ID</span>
              <span className="detail-value">{userData.id}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <FaUser />
            </div>
            <div className="detail-info">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{userData.name}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <FaEnvelope />
            </div>
            <div className="detail-info">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{userData.email}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <FaBook />
            </div>
            <div className="detail-info">
              <span className="detail-label">Enrolled Courses</span>
              <span className="detail-value">{userData.enrolledCourses || 0}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <FaTrophy />
            </div>
            <div className="detail-info">
              <span className="detail-label">Completed Courses</span>
              <span className="detail-value">{userData.completedCourses || 0}</span>
            </div>
          </div>
        </div>

        <div className="user-stats-section">
          <h3>User Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Account Status</span>
              <span className="stat-value active">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Role</span>
              <span className="stat-value">{userData.role?.replace('ROLE_', '')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Courses</span>
              <span className="stat-value">{userData.enrolledCourses || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Progress</span>
              <span className="stat-value">
                {userData.completedCourses || 0} / {userData.enrolledCourses || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Delete User</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="warning-box">
                <p className="warning-text">
                  <strong>Warning:</strong> You are about to delete user <strong>"{userData.name}"</strong>.
                </p>
                <p className="warning-text">
                  This action will permanently remove:
                </p>
                <ul className="warning-list">
                  <li>User account and profile</li>
                  <li>All course enrollments</li>
                  <li>Learning progress and statistics</li>
                  <li>Account preferences and settings</li>
                </ul>
                <p className="warning-text danger">
                  <strong>This action cannot be undone!</strong>
                </p>
              </div>
              
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn-danger-confirm" onClick={handleDelete}>
                  Yes, Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserView
