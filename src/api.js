// src/api.js
const API_BASE_URL = '/api';

export const api = {
  // ========== AUTH ==========
  register: (userData) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }),
  
  changePassword: (token, passwordData) => fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  }),

  // ========== OFFRES ==========
  getOffres: () => fetch(`${API_BASE_URL}/offers`),
  
  getOfferById: (id) => fetch(`${API_BASE_URL}/offers/${id}`),

  // ========== CANDIDATURES ==========
  getMyApplications: (token) => fetch(`${API_BASE_URL}/applications/my-applications`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  applyToOffer: (offerId, token, message) => fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ offerId, message })
  }),

  // ========== PROFIL ETUDIANT ==========
  getStudentProfile: (token) => fetch(`${API_BASE_URL}/students/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  updateProfile: (token, profileData) => fetch(`${API_BASE_URL}/students/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  }),
  
  updateSkills: (token, skills) => fetch(`${API_BASE_URL}/students/skills`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ competences: skills })
  }),

  // ========== PHOTO ==========
  uploadStudentPhoto: (token, file) => {
    console.log("📤 Uploading photo:", file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('photo', file);
    return fetch(`${API_BASE_URL}/students/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
  },

  // ========== CV ==========
  uploadCV: (token, file) => {
    const formData = new FormData();
    formData.append('cv', file);
    return fetch(`${API_BASE_URL}/students/upload-cv`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
  },
  
  downloadCV: (token) => fetch(`${API_BASE_URL}/students/download-cv`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  generateCV: (token, cvData) => fetch(`${API_BASE_URL}/students/generate-cv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(cvData)
  }),
  
  deleteCV: (token) => fetch(`${API_BASE_URL}/students/cv`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  // Supprimer une candidature (étudiant)
deleteApplication: async (token, applicationId) => {
  // Option 1: Si vous utilisez la route étudiant
  const response = await fetch(`http://localhost:5004/api/applications/my-applications/${applicationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response;
},
  // ========== FAVORIS ==========
  getFavorites: (token) => fetch(`${API_BASE_URL}/students/favorites`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  addFavorite: (token, offerId) => fetch(`${API_BASE_URL}/students/favorites/${offerId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  removeFavorite: (token, offerId) => fetch(`${API_BASE_URL}/students/favorites/${offerId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  // ========== ENTREPRISES ==========
  getCompanies: () => fetch(`${API_BASE_URL}/companies`),
  
  getCompanyProfile: (token) => fetch(`${API_BASE_URL}/companies/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  // ========== ENTREPRISE - OFFRES ==========
  createOffer: (token, offerData) => fetch(`${API_BASE_URL}/companies/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(offerData)
  }),

  getCompanyOffers: (token) => fetch(`${API_BASE_URL}/companies/offers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  deleteOffer: (token, offerId) => fetch(`${API_BASE_URL}/companies/offers/${offerId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  updateOffer: (token, offerId, offerData) => fetch(`${API_BASE_URL}/companies/offers/${offerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(offerData)
  }),

  getCompanyApplications: (token) => fetch(`${API_BASE_URL}/companies/applications`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  updateApplicationStatus: (applicationId, token, status) => fetch(`${API_BASE_URL}/companies/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  }),
// ========== ENTREPRISE - PROFIL (AJOUTE CECI) ==========
  updateCompanyProfile: (token, profileData) => fetch(`${API_BASE_URL}/companies/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  }),

  // ========== ENTREPRISE - STATS (AJOUTE CECI) ==========
  getCompanyStats: (token) => fetch(`${API_BASE_URL}/companies/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  updateApplicationStatus: (applicationId, token, status) => fetch(`${API_BASE_URL}/companies/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  }),
// Dans api.js - autre option
saveEvaluation: (token, applicationId, evaluationData) => {
  return fetch(`${API_BASE_URL}/companies/evaluations/${applicationId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(evaluationData)
  });
},
  getEvaluation: (token, applicationId) => fetch(`${API_BASE_URL}/applications/${applicationId}/evaluation`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }),
// ========== ENTREPRISE - STATS AVANCÉES ==========
  getAdvancedStats: (token) => fetch(`${API_BASE_URL}/companies/advanced-stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  // ========== ADMIN ==========
  getAdminStats: (token) => fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  getAllApplications: (token) => fetch(`${API_BASE_URL}/admin/applications`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
};