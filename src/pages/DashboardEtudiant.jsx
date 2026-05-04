import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  User, Briefcase, Send, Heart, Star, Settings, FileText, Bell, Phone,
  LogOut, MapPin, Clock, DollarSign, Upload, Camera, Save,
  X, CheckCircle, AlertCircle, Key, Download, FilePlus, Edit, Building2, Search,
  Filter, SlidersHorizontal, Plus, Trash2, Calendar, XCircle, Mail, HelpCircle, 
  MessageCircle, TrendingUp, Users
} from "lucide-react";
import { api } from '../api';

// ============================================
// DONNÉES DE TEST (fallback si API échoue)
// ============================================
const fallbackOffers = [
  {
    id: 1,
    titre: "Développeur Full Stack React/Node.js",
    entreprise: "Tech Solutions Algérie",
    lieu: "Alger",
    type: "Stage PFE",
    duree: "6 mois",
    salaire: "25 000 DA",
    description: "Nous recherchons un stagiaire passionné pour développer des applications web modernes.",
    competences: ["React", "Node.js", "MongoDB", "JavaScript"]
  },
  {
    id: 2,
    titre: "Assistant Marketing Digital",
    entreprise: "Digital Agency DZ",
    lieu: "Oran",
    type: "Stage",
    duree: "3 mois",
    salaire: "Non rémunéré",
    description: "Gestion des réseaux sociaux, création de contenu et SEO.",
    competences: ["SEO", "Social Media", "Content Creation"]
  },
  {
    id: 3,
    titre: "Data Analyst",
    entreprise: "Data Corp",
    lieu: "Constantine",
    type: "Stage PFE",
    duree: "6 mois",
    salaire: "30 000 DA",
    description: "Analyse de données et création de rapports.",
    competences: ["Python", "SQL", "Power BI"]
  }
];

// ============================================
// COMPOSANT AUTOCOMPLETE WILAYA
// ============================================
function AutocompleteWilaya({ value, onChange, placeholder, darkMode }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
    'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
  ];

  const handleChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.length > 0) {
      const filtered = wilayas.filter(wilaya => 
        wilaya.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectWilaya = (wilaya) => {
    onChange(wilaya);
    setShowSuggestions(false);
  };

  const inputBg = darkMode ? '#374151' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const borderColor = darkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => value && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 border rounded-xl shadow-lg max-h-60 overflow-y-auto"
             style={{ backgroundColor: inputBg, borderColor: borderColor }}>
          {suggestions.map((wilaya, index) => (
            <div
              key={index}
              onClick={() => selectWilaya(wilaya)}
              className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer text-sm flex items-center gap-2"
              style={{ color: textColor }}
            >
              <MapPin size={14} className="text-emerald-500" />
              {wilaya}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPOSANT LIST SECTION
// ============================================
const ListSection = ({ title, items, onAdd, onRemove, newValue, setNewValue, placeholder, darkMode }) => {
  const themeList = {
    textLight: darkMode ? '#9ca3af' : '#4b5563',
    text: darkMode ? '#f3f4f6' : '#1f2937',
    inputBg: darkMode ? '#374151' : '#ffffff',
    border: darkMode ? '#374151' : '#e5e7eb',
    cardAlt: darkMode ? '#374151' : '#f9fafb',
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: themeList.textLight }}>{title}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          style={{ backgroundColor: themeList.inputBg, color: themeList.text, borderColor: themeList.border }}
        />
        <button
          type="button"
          onClick={() => {
            if (newValue.trim()) {
              onAdd();
            }
          }}
          className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-1"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>
      {items && items.length > 0 ? (
        <ul className="space-y-1 mt-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: themeList.cardAlt }}>
              <span className="text-sm flex items-center gap-2" style={{ color: themeList.text }}>
                <span className="text-emerald-500">•</span> {item}
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-rose-500 hover:text-rose-600 transition"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm p-2 rounded-lg" style={{ color: themeList.textLight, backgroundColor: themeList.cardAlt }}>Aucun élément ajouté</p>
      )}
    </div>
  );
};

// ============================================
// COMPOSANT PRINCIPAL DASHBOARD ETUDIANT
// ============================================
export function DashboardEtudiant({ etudiant, onLogout, onUpdateProfil, onChangePassword, darkMode = false }) {
  
  // États pour les données API
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  
  // États pour la modale de confirmation de suppression
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [candidatureToDelete, setCandidatureToDelete] = useState(null);
  
  // États pour les évaluations reçues
  const [mesEvaluations, setMesEvaluations] = useState([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);
  
  // État pour suivre les conventions déjà téléchargées
  const [downloadedConventions, setDownloadedConventions] = useState({});
  
  // Thème basé sur darkMode
  const theme = {
    bg: darkMode ? '#111827' : '#f3f4f6',
    text: darkMode ? '#f3f4f6' : '#1f2937',
    textLight: darkMode ? '#9ca3af' : '#4b5563',
    card: darkMode ? '#1f2937' : '#ffffff',
    cardAlt: darkMode ? '#374151' : '#f9fafb',
    sidebar: darkMode ? '#111827' : '#111827',
    border: darkMode ? '#374151' : '#e5e7eb',
    inputBg: darkMode ? '#374151' : '#ffffff',
  };

  // ============================================
  // ÉTATS
  // ============================================
  const [activeMenu, setActiveMenu] = useState("offres");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({ 
    search: '', 
    type: '', 
    ville: '', 
    duree: '', 
    salaireMin: '', 
    salaireMax: '' 
  });
  const [tempFilters, setTempFilters] = useState({
    type: '', ville: '', duree: '', salaireMin: '', salaireMax: ''
  });
  const [favoris, setFavoris] = useState({});
  const [showCvModal, setShowCvModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // États pour le profil
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    nom: etudiant?.nom || "", 
    prenom: etudiant?.prenom || "", 
    email: etudiant?.email || "",
    matricule: etudiant?.matricule || "",
    filiere: etudiant?.filiere || "",
    universite: etudiant?.universite || "", 
    niveau: etudiant?.niveau || "",
    telephone: etudiant?.telephone || "",
    adresse: etudiant?.adresse || "", 
    bio: etudiant?.bio || "",
    competences: etudiant?.competences?.join(", ") || ""
  });
  
  // États pour le CV
  const [uploadedCv, setUploadedCv] = useState(null);
  const [isCvEditing, setIsCvEditing] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [formations, setFormations] = useState([]);
  const [langues, setLangues] = useState([]);
  const [centresInteret, setCentresInteret] = useState([]);
  const [newExperience, setNewExperience] = useState("");
  const [newFormation, setNewFormation] = useState("");
  const [newLangue, setNewLangue] = useState("");
  const [newCentreInteret, setNewCentreInteret] = useState("");

  // États pour le mot de passe
  const [passwordData, setPasswordData] = useState({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
  const [passwordErrors, setPasswordErrors] = useState({});

  // ============================================
  // CHARGEMENT ÉTAT CONVENTIONS DEPUIS LOCALSTORAGE
  // ============================================
  useEffect(() => {
    const saved = localStorage.getItem('downloadedConventions');
    if (saved) {
      setDownloadedConventions(JSON.parse(saved));
    }
  }, []);

  // ============================================
  // FONCTIONS
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const fetchStudentProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    
    try {
      const response = await api.getStudentProfile(currentToken);
      const data = await response.json();
      
      if (response.ok && data.success) {
        const student = data.student;
        
        setFormData({
          nom: student.nom || "",
          prenom: student.prenom || "",
          email: student.email || "",
          matricule: student.matricule || "",
          filiere: student.filiere || "",
          universite: student.universite || "",
          niveau: student.niveau || "",
          telephone: student.telephone || "",
          adresse: student.adresse || "",
          bio: student.bio || "",
          competences: Array.isArray(student.competences) ? student.competences.join(", ") : ""
        });
        
        if (student.cvPath) {
          setUploadedCv({
            name: student.cvName || student.cvPath,
            url: `http://localhost:5004/uploads/cvs/${student.cvPath}`
          });
        } else {
          setUploadedCv(null);
        }
        
        if (student.photoPath) {
          setPhotoPreview(`http://localhost:5004/uploads/student-photos/${student.photoPath}`);
        }
        
        if (student.favorites) {
          const favs = {};
          student.favorites.forEach(id => { favs[id] = true; });
          setFavoris(favs);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.getFavorites(token);
      const data = await response.json();
      if (response.ok && data.favorites) {
        const favs = {};
        data.favorites.forEach(fav => {
          favs[fav.offerId] = true;
        });
        setFavoris(favs);
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    }
  }, [token]);

  const addToFavorites = useCallback(async (offerId) => {
    if (!token) {
      showNotification('error', "❌ Connectez-vous pour ajouter aux favoris");
      return;
    }
    try {
      const response = await api.addFavorite(token, offerId);
      if (response.ok) {
        setFavoris(prev => ({ ...prev, [offerId]: true }));
        showNotification('success', "❤️ Ajouté aux favoris");
      } else {
        const data = await response.json();
        showNotification('error', data.message || "❌ Erreur");
      }
    } catch (error) {
      console.error('Erreur ajout favori:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification]);

  const removeFromFavorites = useCallback(async (offerId) => {
    if (!token) return;
    try {
      const response = await api.removeFavorite(token, offerId);
      if (response.ok) {
        setFavoris(prev => ({ ...prev, [offerId]: false }));
        showNotification('success', "💔 Retiré des favoris");
      } else {
        const data = await response.json();
        showNotification('error', data.message || "❌ Erreur");
      }
    } catch (error) {
      console.error('Erreur suppression favori:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification]);

  const toggleFavori = useCallback((offerId) => {
    if (favoris[offerId]) {
      removeFromFavorites(offerId);
    } else {
      addToFavorites(offerId);
    }
  }, [favoris, addToFavorites, removeFromFavorites]);

  // Charger les évaluations de l'étudiant
  const fetchMesEvaluations = useCallback(async () => {
    if (!token) return;
    
    setLoadingEvaluations(true);
    try {
      const response = await fetch('http://localhost:5004/api/students/evaluations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMesEvaluations(data.evaluations || []);
      } else {
        console.error('Erreur API:', data);
        setMesEvaluations([]);
      }
    } catch (error) {
      console.error('Erreur chargement évaluations:', error);
      setMesEvaluations([]);
    } finally {
      setLoadingEvaluations(false);
    }
  }, [token]);

  const handleDeleteCV = useCallback(async () => {
    if (!confirm("Voulez-vous vraiment supprimer votre CV ?")) return;
    
    if (token) {
      try {
        const response = await api.deleteCV(token);
        const data = await response.json();
        
        if (response.ok) {
          setUploadedCv(null);
          showNotification('success', "✅ CV supprimé avec succès");
          await fetchStudentProfile();
        } else {
          showNotification('error', data.message || "❌ Erreur lors de la suppression");
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
        showNotification('error', "❌ Erreur de connexion");
      }
    }
  }, [token, showNotification, fetchStudentProfile]);

  const handleSaveProfil = useCallback(async () => {
    const updatedData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      matricule: formData.matricule,
      filiere: formData.filiere,
      universite: formData.universite,
      niveau: formData.niveau,
      telephone: formData.telephone,
      adresse: formData.adresse,
      bio: formData.bio,
      competences: formData.competences.split(",").map(c => c.trim()).filter(c => c)
    };
    
    if (token) {
      try {
        const response = await api.updateProfile(token, updatedData);
        const data = await response.json();
        if (response.ok) {
          showNotification('success', "✅ Profil mis à jour");
          setIsEditing(false);
          await fetchStudentProfile();
          if (onUpdateProfil) onUpdateProfil(updatedData);
        } else {
          showNotification('error', data.message || "Erreur lors de la mise à jour");
        }
      } catch (error) {
        console.error(error);
        showNotification('error', "Erreur de connexion");
      }
    } else {
      showNotification('success', "✅ Profil mis à jour (mode démo)");
      setIsEditing(false);
      if (onUpdateProfil) onUpdateProfil(updatedData);
    }
  }, [formData, token, showNotification, onUpdateProfil, fetchStudentProfile]);

  const handleCVUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', "❌ Fichier trop volumineux (max 10MB)");
      return;
    }
    
    if (token) {
      try {
        const response = await api.uploadCV(token, file);
        const data = await response.json();
        
        if (response.ok) {
          await fetchStudentProfile();
          showNotification('success', `✅ CV uploadé: ${file.name}`);
        } else {
          showNotification('error', data.message || "❌ Erreur upload");
        }
      } catch (error) {
        console.error('Erreur:', error);
        showNotification('error', "❌ Erreur de connexion");
      }
    }
    
    e.target.value = '';
  }, [token, showNotification, fetchStudentProfile]);

  const getCurrentCv = useCallback(() => {
    const competencesArray = formData.competences 
      ? formData.competences.split(",").map(c => c.trim()).filter(c => c)
      : [];
      
    return {
      nom: formData.nom || etudiant?.nom || "",
      prenom: formData.prenom || etudiant?.prenom || "",
      email: formData.email || etudiant?.email || "",
      telephone: formData.telephone || etudiant?.telephone || "",
      adresse: formData.adresse || etudiant?.adresse || "",
      universite: formData.universite || etudiant?.universite || "",
      filiere: formData.filiere || etudiant?.filiere || "",
      niveau: formData.niveau || etudiant?.niveau || "",
      competences: competencesArray,
      experiences: experiences,
      formations: formations,
      langues: langues,
      centresInteret: centresInteret
    };
  }, [formData, etudiant, experiences, formations, langues, centresInteret]);

  // Gestion des listes du CV
  const addExperience = () => {
    if (newExperience.trim()) {
      setExperiences([...experiences, newExperience.trim()]);
      setNewExperience("");
    }
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addFormation = () => {
    if (newFormation.trim()) {
      setFormations([...formations, newFormation.trim()]);
      setNewFormation("");
    }
  };

  const removeFormation = (index) => {
    setFormations(formations.filter((_, i) => i !== index));
  };

  const addLangue = () => {
    if (newLangue.trim()) {
      setLangues([...langues, newLangue.trim()]);
      setNewLangue("");
    }
  };

  const removeLangue = (index) => {
    setLangues(langues.filter((_, i) => i !== index));
  };

  const addCentreInteret = () => {
    if (newCentreInteret.trim()) {
      setCentresInteret([...centresInteret, newCentreInteret.trim()]);
      setNewCentreInteret("");
    }
  };

  const removeCentreInteret = (index) => {
    setCentresInteret(centresInteret.filter((_, i) => i !== index));
  };

  const handleGenerateCVFromProfile = useCallback(async () => {
    const cv = getCurrentCv();
    try {
      const response = await api.generateCV(token, {
        nom: cv.nom,
        prenom: cv.prenom,
        email: cv.email,
        telephone: cv.telephone,
        adresse: cv.adresse,
        universite: cv.universite,
        filiere: cv.filiere,
        niveau: cv.niveau,
        competences: cv.competences,
        experiences: experiences,
        formations: formations,
        langues: langues,
        centresInteret: centresInteret
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV_${cv.nom}_${cv.prenom}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showNotification('success', "✅ CV généré avec succès");
        setIsCvEditing(false);
      } else {
        const error = await response.json();
        showNotification('error', error.message || "❌ Erreur lors de la génération");
      }
    } catch (error) {
      console.error('Erreur génération:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, getCurrentCv, experiences, formations, langues, centresInteret, showNotification]);

  const handleDownloadCV = useCallback(async () => {
    if (!token) {
      showNotification('error', "❌ Vous n'êtes pas connecté");
      return;
    }
    
    try {
      const response = await api.downloadCV(token);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV_${formData.nom || 'etudiant'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showNotification('success', "✅ CV téléchargé avec succès");
      } else {
        const error = await response.json();
        showNotification('error', error.message || "❌ Aucun CV trouvé");
      }
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, formData.nom, showNotification]);

  const handlePostuler = useCallback((offre) => {
    setSelectedOffre(offre);
    setShowCvModal(true);
  }, []);

  const handleConfirmPostuler = useCallback(async () => {
    if (!selectedOffre) return;
    
    if (token) {
      try {
        const response = await api.applyToOffer(selectedOffre.id, token, "Candidature envoyée");
        const data = await response.json();
        if (response.ok) {
          showNotification('success', `✅ Candidature envoyée pour ${selectedOffre.titre}`);
          const refreshResponse = await api.getMyApplications(token);
          const refreshData = await refreshResponse.json();
          if (refreshResponse.ok) {
            setCandidatures(refreshData.applications || []);
          }
        } else {
          showNotification('error', data.message || "❌ Erreur lors de l'envoi");
        }
      } catch (error) {
        console.error('Erreur candidature:', error);
        showNotification('error', "❌ Erreur de connexion");
      }
    } else {
      showNotification('success', `✅ Candidature envoyée pour ${selectedOffre.titre} (mode démo)`);
    }
    
    setShowCvModal(false);
    setSelectedOffre(null);
  }, [selectedOffre, token, showNotification]);

  // Ouvrir la modale de confirmation avant suppression
  const openDeleteConfirmation = useCallback((candidature) => {
    setCandidatureToDelete(candidature);
    setShowConfirmDeleteModal(true);
  }, []);

  // Fonction pour supprimer après confirmation
  const handleDeleteCandidature = useCallback(async () => {
    if (!candidatureToDelete) return;
    
    if (token) {
      try {
        const response = await api.deleteApplication(token, candidatureToDelete.id);
        
        if (response.ok) {
          setCandidatures(prev => prev.filter(c => c.id !== candidatureToDelete.id));
          showNotification('success', `🗑️ Candidature supprimée avec succès`);
        } else {
          const data = await response.json();
          showNotification('error', data.message || "❌ Erreur lors de la suppression");
        }
      } catch (error) {
        console.error('Erreur suppression candidature:', error);
        showNotification('error', "❌ Erreur de connexion");
      }
    } else {
      setCandidatures(prev => prev.filter(c => c.id !== candidatureToDelete.id));
      showNotification('success', `🗑️ Candidature supprimée (mode démo)`);
    }
    
    setShowConfirmDeleteModal(false);
    setCandidatureToDelete(null);
  }, [token, candidatureToDelete, showNotification]);

  const handlePhotoUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showNotification('error', "❌ Format non supporté (image seulement)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', "❌ Image trop volumineuse (max 5MB)");
      return;
    }
    
    const cleanName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.]/g, '_');
    
    const cleanedFile = new File([file], cleanName, { type: file.type });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(cleanedFile);
    
    if (token) {
      try {
        const response = await api.uploadStudentPhoto(token, cleanedFile);
        
        if (response.ok) {
          const data = await response.json();
          showNotification('success', "✅ Photo de profil mise à jour");
          if (data.photoUrl) {
            const fullUrl = data.photoUrl;
            setPhotoPreview(fullUrl);
            localStorage.setItem('studentPhoto', fullUrl);
          }
        } else {
          const error = await response.json();
          showNotification('error', error.message || "Erreur lors de l'upload");
        }
      } catch (error) {
        console.error('Upload error:', error);
        showNotification('error', "❌ Erreur de connexion");
      }
    }
  }, [token, showNotification]);

  // ========== TÉLÉCHARGER LA CONVENTION AVEC VÉRIFICATION ==========
  const handleDownloadConvention = useCallback(async (candidatureId) => {
    if (!token) {
      showNotification('error', "❌ Vous devez être connecté");
      return;
    }
    
    // Vérifier si déjà téléchargé
    if (downloadedConventions[candidatureId]) {
      showNotification('warning', "⚠️ Convention déjà téléchargée précédemment");
      return;
    }
    
    try {
      showNotification('info', "📄 Téléchargement de la convention...");
      
      const response = await api.downloadConvention(token, candidatureId);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `convention_stage_${candidatureId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Sauvegarder l'état dans localStorage
        const newState = { ...downloadedConventions, [candidatureId]: true };
        setDownloadedConventions(newState);
        localStorage.setItem('downloadedConventions', JSON.stringify(newState));
        
        showNotification('success', "✅ Convention téléchargée avec succès");
      } else {
        const error = await response.json();
        showNotification('error', error.message || "❌ Convention non disponible");
      }
    } catch (error) {
      console.error('Erreur téléchargement convention:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification, downloadedConventions]);

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }, []);

  const handleSubmitPasswordChange = useCallback(async () => {
    const errors = {};
    if (!passwordData.ancienMotDePasse) errors.ancienMotDePasse = "Champ requis";
    if (!passwordData.nouveauMotDePasse) errors.nouveauMotDePasse = "Champ requis";
    else if (passwordData.nouveauMotDePasse.length < 6) errors.nouveauMotDePasse = "Minimum 6 caractères";
    if (passwordData.nouveauMotDePasse !== passwordData.confirmerMotDePasse) errors.confirmerMotDePasse = "Les mots de passe ne correspondent pas";
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    if (token) {
      try {
        const response = await api.changePassword(token, {
          ancienMotDePasse: passwordData.ancienMotDePasse,
          nouveauMotDePasse: passwordData.nouveauMotDePasse
        });
        const data = await response.json();
        if (response.ok) {
          showNotification('success', "✅ Mot de passe changé");
          setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
          if (onChangePassword) onChangePassword(passwordData.nouveauMotDePasse);
        } else {
          showNotification('error', data.message || "Erreur lors du changement");
        }
      } catch (error) {
        console.error(error);
        showNotification('error', "Erreur de connexion");
      }
    } else {
      if (passwordData.ancienMotDePasse !== "123456") {
        showNotification('error', "❌ Ancien mot de passe incorrect");
        return;
      }
      showNotification('success', "✅ Mot de passe changé (mode démo)");
      setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
      if (onChangePassword) onChangePassword(passwordData.nouveauMotDePasse);
    }
  }, [passwordData, token, showNotification, onChangePassword]);

  // Filtrage des offres
  const offresDisponibles = useMemo(() => {
    return offres.length > 0 ? offres : fallbackOffers;
  }, [offres]);

  const offresFiltrees = useMemo(() => {
    const data = offresDisponibles;
    if (!data) return [];

    return data.filter(offre => {
      const matchSearch = !filters.search || 
        offre.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        offre.entreprise?.toLowerCase().includes(filters.search.toLowerCase()) ||
        offre.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchType = !filters.type || 
        offre.type?.toLowerCase().includes(filters.type.toLowerCase());
      
      const matchVille = !filters.ville || 
        offre.lieu?.toLowerCase().includes(filters.ville.toLowerCase());
      
      const matchDuree = !filters.duree || 
        offre.duree?.toLowerCase().includes(filters.duree.toLowerCase());
      
      let matchSalaire = true;
      const salaireOffre = offre.salaire || '';
      const montantOffre = parseInt(salaireOffre.replace(/[^0-9]/g, ''));
      
      if (!isNaN(montantOffre)) {
        if (filters.salaireMin && filters.salaireMin !== '0') {
          const salaireMin = parseInt(filters.salaireMin);
          if (!isNaN(salaireMin) && montantOffre < salaireMin) matchSalaire = false;
        }
        if (filters.salaireMax && filters.salaireMax !== '0' && matchSalaire) {
          const salaireMax = parseInt(filters.salaireMax);
          if (!isNaN(salaireMax) && montantOffre > salaireMax) matchSalaire = false;
        }
      }
      
      return matchSearch && matchType && matchVille && matchDuree && matchSalaire;
    });
  }, [offresDisponibles, filters]);

  const offresFavoris = useMemo(() => offresDisponibles.filter(o => favoris[o.id]), [offresDisponibles, favoris]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type) count++;
    if (filters.ville) count++;
    if (filters.duree) count++;
    if (filters.salaireMin && filters.salaireMin !== '0') count++;
    if (filters.salaireMax && filters.salaireMax !== '0') count++;
    return count;
  }, [filters]);

  // Gestion des filtres
  const openFilterModal = () => {
    setTempFilters({
      type: filters.type,
      ville: filters.ville,
      duree: filters.duree,
      salaireMin: filters.salaireMin,
      salaireMax: filters.salaireMax
    });
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setFilters({
      ...filters,
      type: tempFilters.type,
      ville: tempFilters.ville,
      duree: tempFilters.duree,
      salaireMin: tempFilters.salaireMin,
      salaireMax: tempFilters.salaireMax
    });
    setShowFilterModal(false);
    showNotification('success', "✅ Filtres appliqués");
  };

  const resetFilters = () => {
    setFilters({ 
      search: '', 
      type: '', 
      ville: '', 
      duree: '', 
      salaireMin: '', 
      salaireMax: '' 
    });
    setTempFilters({ 
      type: '', 
      ville: '', 
      duree: '', 
      salaireMin: '', 
      salaireMax: '' 
    });
    showNotification('success', "✅ Filtres réinitialisés");
  };

  // ============================================
  // USEEFFECT
  // ============================================
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.getOffres();
        const data = await response.json();
        
        if (response.ok) {
          if (data.offers && Array.isArray(data.offers)) {
            setOffres(data.offers);
          } else if (data.offres && Array.isArray(data.offres)) {
            setOffres(data.offres);
          } else {
            setOffres(fallbackOffers);
          }
        } else {
          setOffres(fallbackOffers);
        }
      } catch (error) {
        console.error('Erreur chargement offres:', error);
        setOffres(fallbackOffers);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchCandidatures = async () => {
      if (!token) return;
      try {
        const response = await api.getMyApplications(token);
        const data = await response.json();
        if (response.ok) {
          setCandidatures(data.applications || []);
        }
      } catch (error) {
        console.error('Erreur chargement candidatures:', error);
      }
    };
    
    fetchOffers();
    fetchCandidatures();
    fetchStudentProfile();
    fetchFavorites();
    fetchMesEvaluations();
  }, [token, fetchStudentProfile, fetchFavorites, fetchMesEvaluations]);

  // Menu items
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "offres", label: "Liste des offres", icon: <Briefcase size={18} /> },
    { id: "mesCandidatures", label: "Mes candidatures", icon: <Send size={18} /> },
    { id: "favoris", label: "Mes favoris", icon: <Heart size={18} /> },
    { id: "mesEvaluations", label: "Mes évaluations", icon: <Star size={18} /> },
    { id: "changePassword", label: "Changer mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <HelpCircle size={18} /> },
  ];

  const getMenuTitle = (id) => {
    const titles = { 
      profil: 'Mon Profil', 
      offres: 'Offres de Stage', 
      mesCandidatures: 'Mes Candidatures', 
      favoris: 'Mes Favoris', 
      mesEvaluations: 'Mes Évaluations',
      changePassword: 'Changer le Mot de Passe',
      aide: 'Conditions & Aide'
    };
    return titles[id] || 'Dashboard';
  };

  if (loading && offres.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.bg }}>
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4" style={{ color: theme.text }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen fade-in font-sans" style={{ backgroundColor: theme.bg, color: theme.text }}>
      
      {/* NOTIFICATION */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* MODALE DES FILTRES */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="border-b px-6 py-4 flex justify-between items-center" style={{ borderColor: theme.border }}>
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                <Filter size={20} className="text-emerald-500" />
                Filtres de recherche
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="p-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <Briefcase size={16} className="text-emerald-500" />
                  Type de stage
                </label>
                <select
                  value={tempFilters.type}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                >
                  <option value="">Tous les types</option>
                  <option value="PFE">Stage PFE</option>
                  <option value="Stage">Stage classique</option>
                  <option value="Alternance">Alternance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <MapPin size={16} className="text-emerald-500" />
                  Wilaya
                </label>
                <AutocompleteWilaya
                  value={tempFilters.ville}
                  onChange={(value) => setTempFilters(prev => ({ ...prev, ville: value }))}
                  placeholder="Sélectionnez une wilaya..."
                  darkMode={darkMode}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <Clock size={16} className="text-emerald-500" />
                  Durée du stage
                </label>
                <select
                  value={tempFilters.duree}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, duree: e.target.value }))}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                >
                  <option value="">Toutes durées</option>
                  <option value="1-3 mois">1 - 3 mois</option>
                  <option value="3-6 mois">3 - 6 mois</option>
                  <option value="6-12 mois">6 - 12 mois</option>
                  <option value="12+ mois">Plus de 12 mois</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <DollarSign size={16} className="text-emerald-500" />
                  Salaire (DA)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={tempFilters.salaireMin}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, salaireMin: e.target.value }))}
                    placeholder="Minimum"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  />
                  <input
                    type="number"
                    value={tempFilters.salaireMax}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, salaireMax: e.target.value }))}
                    placeholder="Maximum"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t p-6 flex gap-3" style={{ borderColor: theme.border }}>
              <button onClick={applyFilters} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Appliquer
              </button>
              <button 
                onClick={() => setTempFilters({ type: '', ville: '', duree: '', salaireMin: '', salaireMax: '' })} 
                className="flex-1 py-3 rounded-xl font-semibold transition hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.cardAlt, color: theme.text }}
              >
                <X size={18} /> Effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CV */}
      {showCvModal && selectedOffre && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
              <h3 className="text-lg font-bold" style={{ color: theme.text }}>Postuler: {selectedOffre.titre}</h3>
              <button onClick={() => { setShowCvModal(false); setSelectedOffre(null); setUploadedCv(null); }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed rounded-xl p-4 text-center">
                <Upload size={40} className="mx-auto mb-2" style={{ color: theme.textLight }} />
                <label className="bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer inline-block hover:bg-emerald-600 transition">
                  Choisir un CV
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCVUpload} />
                </label>
                {uploadedCv && <p className="mt-2 text-sm">📄 {uploadedCv.name}</p>}
              </div>
              <div className="text-center my-3 text-xs" style={{ color: theme.textLight }}>OU</div>
              <button onClick={handleGenerateCVFromProfile} className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition">
                Utiliser mon CV du profil
              </button>
            </div>
            <div className="p-6 flex gap-3 border-t" style={{ borderColor: theme.border }}>
              <button onClick={handleConfirmPostuler} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition">
                Confirmer
              </button>
              <button onClick={() => { setShowCvModal(false); setSelectedOffre(null); setUploadedCv(null); }} className="flex-1 py-2 rounded-xl transition" style={{ backgroundColor: theme.cardAlt }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 flex-shrink-0" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-6 border-b" style={{ borderColor: '#374151' }}>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {(formData.prenom?.charAt(0) || 'U')}{(formData.nom?.charAt(0) || '')}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors shadow-md">
                <Camera size={12} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">{formData.prenom} {formData.nom}</p>
            <p className="text-emerald-400 text-xs">{formData.filiere}</p>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveMenu(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition ${activeMenu === item.id ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/50"}`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 mt-3 transition">
            <LogOut size={18} />
            <span className="text-sm">Déconnexion</span>
          </button>
        </nav>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        <div className="shadow-sm px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}` }}>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>{getMenuTitle(activeMenu)}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* MON PROFIL */}
          {activeMenu === "profil" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: theme.card }}>
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Photo" className="w-24 h-24 rounded-full border-4 border-white object-cover" />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <User size={40} className="text-gray-400" /> 
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors shadow-md">
                        <Camera size={14} className="text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: theme.text }}>{formData.nom} {formData.prenom}</h3>
                      <p style={{ color: theme.textLight }}>{formData.email}</p>
                      <p className="text-sm" style={{ color: theme.textLight }}>Matricule: {formData.matricule || "Non renseigné"}</p>
                    </div>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 flex items-center gap-2">
                        <Settings size={16} /> Modifier
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                          <Save size={16} /> Enregistrer
                        </button>
                        <button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2">
                          <X size={16} /> Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: theme.card }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Informations personnelles</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: "Nom", name: "nom", value: formData.nom },
                    { label: "Prénom", name: "prenom", value: formData.prenom },
                    { label: "Email", name: "email", value: formData.email },
                    { label: "Filière", name: "filiere", value: formData.filiere },
                    { label: "Université", name: "universite", value: formData.universite },
                    { label: "Niveau", name: "niveau", value: formData.niveau },
                    { label: "Téléphone", name: "telephone", value: formData.telephone },
                    { label: "Adresse", name: "adresse", value: formData.adresse }
                  ].map(field => (
                    <div key={field.name}>
                      <label className="text-sm block mb-1" style={{ color: theme.textLight }}>{field.label}</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name={field.name} 
                          value={formData[field.name]} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                          style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                        />
                      ) : (
                        <p className="p-2 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                          {field.value || "Non renseigné"}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-sm block mb-1" style={{ color: theme.textLight }}>Compétences (séparées par des virgules)</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="competences" 
                        value={formData.competences} 
                        onChange={handleInputChange} 
                        placeholder="React, Python, Java, ..." 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                        style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2 p-2 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                        {formData.competences ? formData.competences.split(",").map((c, i) => c.trim() && (
                          <span key={i} className="px-2 py-1 rounded-full text-sm" style={{ backgroundColor: theme.card }}>
                            {c.trim()}
                          </span>
                        )) : <span style={{ color: theme.textLight }}>Aucune compétence</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION CV */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: theme.card }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Curriculum Vitae (CV)</h3>
                  <button onClick={() => setIsCvEditing(!isCvEditing)} className="text-emerald-500 text-sm hover:underline">
                    {isCvEditing ? "Fermer" : "Personnaliser +"}
                  </button>
                </div>
                {isCvEditing && (
                  <div className="space-y-4 mb-4">
                    <ListSection 
                      title="Expériences professionnelles" 
                      items={experiences} 
                      onAdd={addExperience} 
                      onRemove={removeExperience} 
                      newValue={newExperience} 
                      setNewValue={setNewExperience} 
                      placeholder="Ex: Stage chez ABC Entreprise" 
                      darkMode={darkMode} 
                    />
                    
                    <ListSection 
                      title="Formations" 
                      items={formations} 
                      onAdd={addFormation} 
                      onRemove={removeFormation} 
                      newValue={newFormation} 
                      setNewValue={setNewFormation} 
                      placeholder="Ex: Master en Informatique" 
                      darkMode={darkMode} 
                    />
                    
                    <ListSection 
                      title="Langues" 
                      items={langues} 
                      onAdd={addLangue} 
                      onRemove={removeLangue} 
                      newValue={newLangue} 
                      setNewValue={setNewLangue} 
                      placeholder="Ex: Anglais (Courant), Français" 
                      darkMode={darkMode} 
                    />
                    
                    <ListSection 
                      title="Centres d'intérêt" 
                      items={centresInteret} 
                      onAdd={addCentreInteret} 
                      onRemove={removeCentreInteret} 
                      newValue={newCentreInteret} 
                      setNewValue={setNewCentreInteret} 
                      placeholder="Ex: Sport, Lecture" 
                      darkMode={darkMode} 
                    />
                  </div>
                )}
                <div className="flex gap-3 flex-wrap">
                  <button onClick={handleGenerateCVFromProfile} className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition">
                    Générer CV
                  </button>
                  <label className="bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                    Upload CV
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCVUpload} />
                  </label>
                  {uploadedCv && (
                    <button onClick={handleDeleteCV} className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition flex items-center gap-2">
                      <Trash2 size={16} /> Supprimer CV
                    </button>
                  )}
                </div>
                {uploadedCv && (
                  <div className="mt-3 flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                    <p className="text-sm text-emerald-500 flex items-center gap-2">
                      <FileText size={16} /> ✓ CV: {uploadedCv.name}
                    </p>
                    <button onClick={handleDownloadCV} className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1">
                      <Download size={14} /> Télécharger
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LISTE DES OFFRES */}
          {activeMenu === "offres" && (
            <div className="space-y-5">
              <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.card }}>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textLight }} />
                    <input 
                      type="text" 
                      placeholder="Rechercher par titre, entreprise, description..." 
                      value={filters.search} 
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} 
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                      style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                    />
                  </div>
                  <button 
                    onClick={openFilterModal} 
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${activeFiltersCount > 0 ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    <SlidersHorizontal size={16} />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <span className="bg-white text-emerald-600 text-xs rounded-full px-1.5 py-0.5 ml-1">{activeFiltersCount}</span>
                    )}
                  </button>
                  {activeFiltersCount > 0 && (
                    <button onClick={resetFilters} className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition flex items-center gap-2">
                      <X size={16} /> Réinitialiser
                    </button>
                  )}
                </div>

                {activeFiltersCount > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {filters.type && <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center gap-1"><Briefcase size={10} /> {filters.type}</span>}
                    {filters.ville && <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-1"><MapPin size={10} /> {filters.ville}</span>}
                    {filters.duree && <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center gap-1"><Clock size={10} /> {filters.duree}</span>}
                  </div>
                )}
              </div>
              
              <div className="text-sm" style={{ color: theme.textLight }}>{offresFiltrees.length} offre(s) trouvée(s)</div>
              
              {offresFiltrees.length > 0 ? (
                offresFiltrees.map(offre => (
                  <div key={offre.id} className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">{offre.type || 'Stage'}</span>
                            {offre.salaire && offre.salaire !== 'Non rémunéré' && offre.salaire !== 'Non spécifié' && (
                              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full flex items-center gap-1">
                                <DollarSign size={12} /> {offre.salaire}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-1" style={{ color: theme.text }}>{offre.titre}</h3>
                          <div className="flex items-center gap-2 mb-3" style={{ color: theme.textLight }}>
                            <Building2 size={16} />
                            <span className="text-sm">{offre.entreprise}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 mb-3 text-sm" style={{ color: theme.textLight }}>
                            <span className="flex items-center gap-1"><MapPin size={14} /> {offre.lieu || 'Non spécifié'}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {offre.duree || 'Non spécifiée'}</span>
                          </div>
                          {offre.description && (
                            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                              <p className="text-sm leading-relaxed" style={{ color: theme.text }}>{offre.description}</p>
                            </div>
                          )}
                          {offre.competences && offre.competences.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs mb-2" style={{ color: theme.textLight }}>Compétences requises :</p>
                              <div className="flex flex-wrap gap-2">
                                {offre.competences.slice(0, 4).map((s, i) => <span key={i} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: theme.cardAlt, color: theme.textLight }}>{s}</span>)}
                                {offre.competences.length > 4 && <span className="text-xs" style={{ color: theme.textLight }}>+{offre.competences.length - 4}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-3 ml-4">
                          <button 
                            onClick={() => toggleFavori(offre.id)} 
                            className={`p-2 rounded-full transition-all ${favoris[offre.id] ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-500"}`}
                          >
                            <Heart size={20} fill={favoris[offre.id] ? "white" : "none"} />
                          </button>
                          <button onClick={() => handlePostuler(offre)} className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium">
                            Postuler
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                  <Briefcase size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                  <p style={{ color: theme.textLight }}>Aucune offre ne correspond à vos critères</p>
                  <button onClick={resetFilters} className="mt-3 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">Réinitialiser les filtres →</button>
                </div>
              )}
            </div>
          )}
          
          {/* MODALE DE CONFIRMATION SUPPRESSION */}
          {showConfirmDeleteModal && candidatureToDelete && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="rounded-2xl max-w-md w-full shadow-2xl transform animate-scale-up" style={{ backgroundColor: theme.card }}>
                <div className="border-b px-6 py-4 flex items-center gap-3" style={{ borderColor: theme.border }}>
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <Trash2 size={22} className="text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: theme.text }}>
                    Confirmer la suppression
                  </h3>
                </div>
                
                <div className="p-6">
                  <p className="text-center mb-4" style={{ color: theme.text }}>
                    Êtes-vous sûr de vouloir supprimer votre candidature pour :
                  </p>
                  <p className="text-center font-bold text-lg mb-2" style={{ color: theme.text }}>
                    "{candidatureToDelete.offreTitre}"
                  </p>
                  <p className="text-center text-sm mb-4" style={{ color: theme.textLight }}>
                    chez <strong>{candidatureToDelete.entrepriseNom || 'Entreprise'}</strong>
                  </p>
                  
                  <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: theme.cardAlt }}>
                    <p className="text-sm flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertCircle size={18} />
                      Cette action est irréversible !
                    </p>
                  </div>
                  
                  <p className="text-xs text-center" style={{ color: theme.textLight }}>
                    Postulé le : {new Date(candidatureToDelete.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div className="border-t p-5 flex gap-3" style={{ borderColor: theme.border }}>
                  <button
                    onClick={() => {
                      setShowConfirmDeleteModal(false);
                      setCandidatureToDelete(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:opacity-80"
                    style={{ backgroundColor: theme.cardAlt, color: theme.text }}
                  >
                    <X size={18} />
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteCandidature}
                    className="flex-1 bg-rose-500 text-white py-2.5 rounded-xl font-semibold hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Confirmer la suppression
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MES CANDIDATURES - Version avec bouton Voir convention désactivé après téléchargement */}
          {activeMenu === "mesCandidatures" && (
            <div className="space-y-3">
              {candidatures.length > 0 ? candidatures.map(c => (
                <div key={c.id} className="rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-bold text-lg" style={{ color: theme.text }}>{c.offreTitre}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          c.statut === "acceptee" ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" : 
                          c.statut === "refusee" ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300" : 
                          "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        }`}>
                          {c.statut === "acceptee" ? "✅ Acceptée" : c.statut === "refusee" ? "❌ Refusée" : "⏳ En attente"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2" style={{ color: theme.textLight }}>
                        <Building2 size={16} />
                        <span className="text-sm font-medium">{c.entrepriseNom || c.entreprise || 'Entreprise'}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-3 text-sm" style={{ color: theme.textLight }}>
                        {c.lieu && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> {c.lieu}
                          </span>
                        )}
                        {c.type && (
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} /> {c.type}
                          </span>
                        )}
                        {c.duree && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {c.duree}
                          </span>
                        )}
                        {c.salaire && c.salaire !== 'Non spécifié' && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <DollarSign size={14} /> {c.salaire}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs" style={{ color: theme.textLight }}>
                        <Calendar size={12} className="inline mr-1" /> 
                        Postulé le {new Date(c.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        {c.statut === "en_attente" && (
                          <div className="flex items-center gap-1 text-yellow-600 text-sm">
                            <Clock size={14} /> En cours de traitement
                          </div>
                        )}
                        {c.statut === "acceptee" && (
                          <div className="flex items-center gap-1 text-emerald-600 text-sm">
                            <CheckCircle size={14} /> Félicitations !
                          </div>
                        )}
                        {c.statut === "refusee" && (
                          <div className="flex items-center gap-1 text-rose-600 text-sm">
                            <XCircle size={14} /> Non retenu
                          </div>
                        )}
                      </div>
                      
                      {/* Bouton Voir Convention pour les candidatures acceptées - Désactivé après téléchargement */}
                      {c.statut === "acceptee" && (
                        <button
                          onClick={() => handleDownloadConvention(c.id)}
                          disabled={downloadedConventions[c.id]}
                          className={`mt-2 px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 shadow-sm ${
                            downloadedConventions[c.id] 
                              ? 'bg-gray-500 cursor-not-allowed opacity-60' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                        >
                          <FileText size={14} />
                          {downloadedConventions[c.id] ? 'Déjà téléchargée' : 'Voir convention'}
                        </button>
                      )}
                      
                      {/* Bouton Supprimer pour les candidatures en attente */}
                      {c.statut === "en_attente" && (
                        <button
                          onClick={() => openDeleteConfirmation(c)}
                          className="mt-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <Trash2 size={14} />
                          Supprimer candidature
                        </button>
                      )}
                      
                      {c.statut !== "en_attente" && c.statut !== "acceptee" && (
                        <p className="text-xs mt-2 px-2 py-1 rounded-lg" style={{ backgroundColor: theme.cardAlt, color: theme.textLight }}>
                          ✗ Candidature refusée
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                  <Send size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                  <p style={{ color: theme.textLight }}>Aucune candidature</p>
                  <button onClick={() => setActiveMenu("offres")} className="mt-3 text-emerald-600 hover:text-emerald-700">Découvrir des offres →</button>
                </div>
              )}
            </div>
          )}
          
          {/* MES FAVORIS */}
          {activeMenu === "favoris" && (
            <div className="space-y-3">
              {offresFavoris.length > 0 ? offresFavoris.map(offre => (
                <div key={offre.id} className="rounded-xl p-4 shadow-sm border-l-4 border-rose-400" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold" style={{ color: theme.text }}>{offre.titre}</h4>
                      <p style={{ color: theme.textLight }}>{offre.entreprise}</p>
                      <div className="flex gap-3 mt-1 text-xs" style={{ color: theme.textLight }}>
                        <span><MapPin size={12} className="inline" /> {offre.lieu}</span>
                        <span><Clock size={12} className="inline" /> {offre.duree}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button onClick={() => toggleFavori(offre.id)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600">
                        <Heart size={18} fill="white" />
                      </button>
                      <button onClick={() => handlePostuler(offre)} className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-600">
                        Postuler
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                  <Heart size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                  <p style={{ color: theme.textLight }}>Aucun favori</p>
                  <button onClick={() => setActiveMenu("offres")} className="mt-3 text-emerald-600 hover:text-emerald-700">Découvrir des offres →</button>
                </div>
              )}
            </div>
          )}

          {/* MES ÉVALUATIONS */}
          {activeMenu === "mesEvaluations" && (
            <div className="space-y-4">
              <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.card }}>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <Star size={20} className="text-yellow-500" />
                  Mes évaluations de stage
                </h3>
                <p className="text-sm" style={{ color: theme.textLight }}>
                  Voici les évaluations faites par les entreprises où vous avez effectué votre stage.
                </p>
              </div>

              {loadingEvaluations ? (
                <div className="text-center py-12">
                  <div className="spinner mx-auto"></div>
                  <p className="mt-4" style={{ color: theme.textLight }}>Chargement des évaluations...</p>
                </div>
              ) : mesEvaluations.length > 0 ? (
                mesEvaluations.map((evalData, index) => (
                  <div key={index} className="rounded-xl shadow-sm overflow-hidden border" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                    {/* En-tête */}
                    <div className="p-5 border-b" style={{ borderColor: theme.border, backgroundColor: theme.cardAlt }}>
                      <div className="flex justify-between items-start flex-wrap gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 size={18} className="text-emerald-500" />
                            <span className="font-semibold" style={{ color: theme.text }}>{evalData.entreprise_nom || 'Entreprise'}</span>
                          </div>
                          <h4 className="font-bold text-lg" style={{ color: theme.text }}>{evalData.offre_titre}</h4>
                          <p className="text-xs mt-1" style={{ color: theme.textLight }}>
                            <Calendar size={12} className="inline mr-1" />
                            Évalué le : {new Date(evalData.date_evaluation || evalData.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                size={20} 
                                className={star <= evalData.note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className="text-2xl font-bold text-yellow-500 ml-2">{evalData.note}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Corps */}
                    <div className="p-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                          <Clock size={20} className="mx-auto mb-1 text-blue-500" />
                          <p className="text-xs font-medium" style={{ color: theme.textLight }}>Ponctualité</p>
                          <p className="text-xl font-bold text-blue-600">{evalData.ponctualite}/20</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                          <FileText size={20} className="mx-auto mb-1 text-purple-500" />
                          <p className="text-xs font-medium" style={{ color: theme.textLight }}>Qualité travail</p>
                          <p className="text-xl font-bold text-purple-600">{evalData.qualite_travail}/20</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                          <User size={20} className="mx-auto mb-1 text-orange-500" />
                          <p className="text-xs font-medium" style={{ color: theme.textLight }}>Autonomie</p>
                          <p className="text-xl font-bold text-orange-600">{evalData.autonomie}/20</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                          <Users size={20} className="mx-auto mb-1 text-green-500" />
                          <p className="text-xs font-medium" style={{ color: theme.textLight }}>Esprit d'équipe</p>
                          <p className="text-xl font-bold text-green-600">{evalData.esprit_equipe}/20</p>
                        </div>
                      </div>

                      {/* Moyenne */}
                      <div className="rounded-xl p-4 mb-4 text-center" style={{ backgroundColor: theme.cardAlt }}>
                        <p className="text-sm font-medium mb-1" style={{ color: theme.textLight }}>Moyenne générale</p>
                        <p className="text-3xl font-bold text-emerald-600">
                          {Math.round((evalData.ponctualite + evalData.qualite_travail + evalData.autonomie + evalData.esprit_equipe) / 4)}/20
                        </p>
                      </div>

                      {/* Progression */}
                      {evalData.progression && (
                        <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-blue-500" />
                            <span className="font-medium" style={{ color: theme.text }}>Progression observée</span>
                          </div>
                          <p className="text-sm" style={{ color: theme.textLight }}>
                            {evalData.progression === 'excellente' && '📈 Excellente - A dépassé les objectifs'}
                            {evalData.progression === 'bonne' && '📈 Bonne - Progression notable'}
                            {evalData.progression === 'moyenne' && '📊 Moyenne - Conforme aux attentes'}
                            {evalData.progression === 'faible' && '📉 Faible - Peu de progression'}
                            {evalData.progression === 'aucune' && '⏸️ Aucune - Stagnation'}
                            {!['excellente', 'bonne', 'moyenne', 'faible', 'aucune'].includes(evalData.progression) && evalData.progression}
                          </p>
                        </div>
                      )}

                      {/* Commentaire */}
                      {evalData.commentaire && (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle size={16} className="text-emerald-500" />
                            <span className="font-medium" style={{ color: theme.text }}>Commentaire de l'entreprise</span>
                          </div>
                          <p className="text-sm italic" style={{ color: theme.textLight }}>
                            "{evalData.commentaire}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                  <Star size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                  <p style={{ color: theme.textLight }}>Aucune évaluation reçue pour le moment</p>
                  <p className="text-sm mt-2" style={{ color: theme.textLight }}>
                    Les évaluations apparaîtront ici une fois que vous aurez effectué un stage accepté par une entreprise.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CHANGER MOT DE PASSE */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto">
              <div className="rounded-2xl p-8" style={{ backgroundColor: theme.card }}>
                <h3 className="text-xl font-bold mb-4">Changer le mot de passe</h3>
                <div className="space-y-4">
                  <input 
                    type="password" 
                    name="ancienMotDePasse" 
                    value={passwordData.ancienMotDePasse} 
                    onChange={handlePasswordChange} 
                    placeholder="Ancien mot de passe" 
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                  <input 
                    type="password" 
                    name="nouveauMotDePasse" 
                    value={passwordData.nouveauMotDePasse} 
                    onChange={handlePasswordChange} 
                    placeholder="Nouveau mot de passe (min 6 caractères)" 
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                  <input 
                    type="password" 
                    name="confirmerMotDePasse" 
                    value={passwordData.confirmerMotDePasse} 
                    onChange={handlePasswordChange} 
                    placeholder="Confirmer" 
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                  {passwordErrors.confirmerMotDePasse && <p className="text-rose-500 text-sm">{passwordErrors.confirmerMotDePasse}</p>}
                  <button onClick={handleSubmitPasswordChange} className="w-full bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 transition font-semibold">
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONS & AIDE */}
          {activeMenu === "aide" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl p-6 shadow-sm text-center" style={{ backgroundColor: theme.card }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.cardAlt }}>
                  <HelpCircle size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Centre d'aide & Conditions</h3>
                <p className="text-sm" style={{ color: theme.textLight }}>
                  Retrouvez toutes les informations nécessaires pour utiliser la plateforme
                </p>
              </div>

              <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                  <MessageCircle size={20} className="text-emerald-500" />
                  Foire Aux Questions (FAQ)
                </h3>
                
                <div className="space-y-4">
                  <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                    <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}>
                      <Briefcase size={16} className="text-emerald-500" />
                      Comment postuler à une offre ?
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: theme.textLight }}>
                      1. Parcourez la liste des offres dans la section "Liste des offres"<br />
                      2. Cliquez sur "Postuler" sur l'offre qui vous intéresse<br />
                      3. Téléchargez votre CV ou utilisez celui de votre profil<br />
                      4. Confirmez votre candidature
                    </p>
                  </div>

                  <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                    <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}>
                      <Heart size={16} className="text-rose-500" />
                      Comment ajouter une offre aux favoris ?
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: theme.textLight }}>
                      Cliquez sur l'icône ❤️ à côté de chaque offre pour l'ajouter à vos favoris. 
                      Retrouvez toutes vos offres favorites dans la section "Mes favoris".
                    </p>
                  </div>

                  <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                    <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}>
                      <FileText size={16} className="text-blue-500" />
                      Comment gérer mon CV ?
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: theme.textLight }}>
                      - Upload CV: Téléchargez votre CV au format PDF, DOC ou DOCX<br />
                      - Générer CV: Créez un CV automatiquement à partir de vos informations de profil<br />
                      - Supprimer CV: Retirez votre CV de la plateforme
                    </p>
                  </div>

                  <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                    <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}>
                      <Bell size={16} className="text-yellow-500" />
                      Comment suivre mes candidatures ?
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: theme.textLight }}>
                      Rendez-vous dans la section "Mes candidatures" pour suivre l'état de vos candidatures :
                      <br />• 🟡 En attente: Votre candidature est en cours d'examen
                      <br />• 🟢 Acceptée: Félicitations ! L'entreprise vous a accepté
                      <br />• 🔴 Refusée: Votre candidature n'a pas été retenue
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 shadow-sm text-center" style={{ backgroundColor: theme.cardAlt }}>
                <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2" style={{ color: theme.text }}>
                  <Mail size={20} className="text-emerald-500" />
                  Besoin d'aide supplémentaire ?
                </h3>
                <p className="text-sm mb-4" style={{ color: theme.textLight }}>
                  Notre équipe support est disponible pour répondre à vos questions
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: theme.card }}>
                    <Mail size={16} className="text-emerald-500" />
                    <span className="text-sm">support@stag.io</span>
                  </div>
                  <div className="p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: theme.card }}>
                    <Phone size={16} className="text-emerald-500" />
                    <span className="text-sm">+213 (0) 23 45 67 89</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in { 
          from { opacity: 0; transform: translateX(100%); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .spinner { 
          border: 3px solid rgba(0,0,0,0.1); 
          border-radius: 50%; 
          border-top-color: #10b981; 
          width: 40px; 
          height: 40px; 
          animation: spin 0.8s linear infinite; 
          margin: 0 auto; 
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}