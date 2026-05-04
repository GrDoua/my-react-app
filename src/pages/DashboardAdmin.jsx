import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChart3, Briefcase, Building, Users, GraduationCap, TrendingUp,
  User, LogOut, Check, X, CheckCircle, Camera, Save, Edit2, Key,
  Eye, Phone, Mail, MapPin, Calendar, Clock, Award, AlertCircle,
  Search, Filter, Trash2, FileText, MessageCircle, HelpCircle, BookOpen,
  ExternalLink, DollarSign, Star, Upload, Download, FilePlus, Send,
  PieChart, Activity, ArrowUp, ArrowDown, MoreHorizontal, Zap,
  Target, Calendar as CalendarIcon, Clock as ClockIcon
} from "lucide-react";
import { api } from '../api';

// ============================================
// COMPOSANT DASHBOARD ADMIN
// ============================================
export function DashboardAdmin({ 
  offres: offresProps = [], 
  entreprises: entreprisesProps = [], 
  candidatures: candidaturesProps = [], 
  onDeleteOffre, 
  onUpdateCandidature, 
  onLogout, 
  onUpdateProfil, 
  onChangePassword,
  darkMode,
  token
}) {
  // États principaux
  const [activeMenu, setActiveMenu] = useState("profil");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(true);
  
  // États pour les données réelles
  const [offres, setOffres] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [stats, setStats] = useState(null);
  
  // États pour le profil
  const [isEditing, setIsEditing] = useState(false);
  const [chefProfil, setChefProfil] = useState({
    nom: "",
    titre: "",
    email: "",
    telephone: "",
    bureau: "",
    bio: ""
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [adminId, setAdminId] = useState(null);

  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // États pour les conventions
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showConventionModal, setShowConventionModal] = useState(false);
  const [conventionFile, setConventionFile] = useState(null);
  const [conventionName, setConventionName] = useState("");
  
  // États pour visualiser la convention
  const [showViewConventionModal, setShowViewConventionModal] = useState(false);
  const [selectedConventionCandidature, setSelectedConventionCandidature] = useState(null);
  const [conventionPdfUrl, setConventionPdfUrl] = useState(null);

  // États pour les graphiques
  const [selectedPeriode, setSelectedPeriode] = useState("mois");
  
  // État pour suivre les conventions déjà générées
  const [generatedConventions, setGeneratedConventions] = useState({});

  // Thème basé sur darkMode
  const theme = {
    bg: darkMode ? '#111827' : '#f3f4f6',
    text: darkMode ? '#f3f4f6' : '#1f2937',
    textLight: darkMode ? '#9ca3af' : '#4b5563',
    card: darkMode ? '#1f2937' : '#ffffff',
    cardAlt: darkMode ? '#374151' : '#f9fafb',
    sidebar: darkMode ? '#111827' : '#111827',
    border: darkMode ? '#374151' : '#e5e5e5',
    inputBg: darkMode ? '#374151' : '#ffffff',
  };

  // ============================================
  // NOTIFICATION
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ============================================
  // CHARGEMENT ÉTAT CONVENTIONS DEPUIS LOCALSTORAGE
  // ============================================
  useEffect(() => {
    const saved = localStorage.getItem('generatedConventions');
    if (saved) {
      setGeneratedConventions(JSON.parse(saved));
    }
  }, []);

  // ============================================
  // CHARGEMENT DES DONNÉES
  // ============================================
  const fetchAdminProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.getAdminProfile(token);
      const data = await response.json();
      if (data.success && data.admin) {
        setAdminId(data.admin.id);
        setChefProfil({
          nom: data.admin.fullName || "",
          titre: data.admin.titre || "",
          email: data.admin.email || "",
          telephone: data.admin.telephone || "",
          bureau: data.admin.bureau || "",
          bio: data.admin.bio || ""
        });
        if (data.admin.photoPath) {
          setPhotoPreview(`http://localhost:5004/uploads/admin-photos/${data.admin.photoPath}`);
        }
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  }, [token]);

  const fetchAdminStats = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.getAdminStats(token);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  }, [token]);

  const fetchAllApplications = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.getAllApplications(token);
      const data = await response.json();
      if (data.success) {
        setCandidatures(data.applications || []);
      }
    } catch (error) {
      console.error("Erreur chargement candidatures:", error);
    }
  }, [token]);

  const fetchAllCompanies = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.getAllCompanies(token);
      const data = await response.json();
      if (data.success) {
        setEntreprises(data.companies || []);
      }
    } catch (error) {
      console.error("Erreur chargement entreprises:", error);
    }
  }, [token]);

  const fetchAllOffers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.getOffres();
      const data = await response.json();
      if (response.ok) {
        setOffres(data.offers || []);
      }
    } catch (error) {
      console.error("Erreur chargement offres:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      Promise.all([
        fetchAdminProfile(),
        fetchAdminStats(),
        fetchAllApplications(),
        fetchAllCompanies(),
        fetchAllOffers()
      ]).finally(() => setLoading(false));
    }
  }, [token, fetchAdminProfile, fetchAdminStats, fetchAllApplications, fetchAllCompanies, fetchAllOffers]);

  // ============================================
  // STATISTIQUES CALCULÉES
  // ============================================
  const calculatedStats = useMemo(() => {
    const totalOffres = offres?.length || 0;
    const totalEntreprises = entreprises?.length || 0;
    const totalCandidatures = candidatures?.length || 0;
    const offresActives = offres?.filter(o => o.statut === "active" || o.estActive === true).length || 0;
    const candidaturesEnAttente = candidatures?.filter(c => c.statut === "en_attente").length || 0;
    const candidaturesAcceptees = candidatures?.filter(c => c.statut === "acceptee").length || 0;
    const candidaturesRefusees = candidatures?.filter(c => c.statut === "refusee").length || 0;
    const tauxAcceptation = totalCandidatures > 0 ? Math.round((candidaturesAcceptees / totalCandidatures) * 100) : 0;
    const tauxRefus = totalCandidatures > 0 ? Math.round((candidaturesRefusees / totalCandidatures) * 100) : 0;
    const tauxAttente = totalCandidatures > 0 ? Math.round((candidaturesEnAttente / totalCandidatures) * 100) : 0;

    return {
      totalOffres,
      totalEntreprises,
      totalCandidatures,
      offresActives,
      offresExpirees: totalOffres - offresActives,
      candidaturesEnAttente,
      candidaturesAcceptees,
      candidaturesRefusees,
      tauxAcceptation,
      tauxRefus,
      tauxAttente,
      evolutionOffres: stats?.offers?.evolution || 12,
      evolutionCandidatures: stats?.applications?.evolution || 23
    };
  }, [offres, entreprises, candidatures, stats]);

  // Données pour les graphiques (mockées pour l'instant, à remplacer par des vraies données)
  const graphData = {
    mois: { offres: [12, 15, 18, 22, 28, 35, 42, 48, 52, 58, 62, 68], candidatures: [8, 12, 18, 25, 35, 48, 62, 78, 95, 112, 128, 145] },
    semaine: { offres: [8, 12, 15, 18, 22, 25, 28], candidatures: [5, 8, 12, 18, 25, 32, 40] },
    annee: { offres: [120, 145, 168, 192, 215], candidatures: [85, 110, 145, 185, 230] }
  };

  const currentData = graphData[selectedPeriode];

  // Filtrer les candidatures
  const candidaturesFiltrees = useMemo(() => {
    let filtered = [...candidatures];
    filtered = filtered.filter(c => c.statut !== "acceptee");
    if (filterStatut !== "Tous") filtered = filtered.filter(c => c.statut === filterStatut);
    if (searchTerm) filtered = filtered.filter(c => 
      (c.etudiantNom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.offreTitre || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered;
  }, [candidatures, filterStatut, searchTerm]);

  const candidaturesAcceptees = useMemo(() => {
    return candidatures.filter(c => c.statut === "acceptee");
  }, [candidatures]);

  // ============================================
  // GESTION DU PROFIL
  // ============================================
  const handleInputChange = useCallback((e) => {
    setChefProfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.updateAdminProfile(token, {
        fullName: chefProfil.nom,
        titre: chefProfil.titre,
        email: chefProfil.email,
        telephone: chefProfil.telephone,
        bureau: chefProfil.bureau,
        bio: chefProfil.bio
      });
      const data = await response.json();
      if (response.ok) {
        showNotification('success', "✅ Profil mis à jour");
        setIsEditing(false);
        fetchAdminProfile();
      } else {
        showNotification('error', data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "Erreur de connexion");
    }
  }, [chefProfil, token, showNotification, fetchAdminProfile]);

  const handlePhotoUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      showNotification('error', "❌ Format image requis");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', "❌ Image trop volumineuse (max 5MB)");
      return;
    }
    
    try {
      const response = await api.uploadAdminPhoto(token, file);
      const data = await response.json();
      if (response.ok) {
        const photoUrl = data.photoUrl.startsWith('http') ? data.photoUrl : `http://localhost:5004${data.photoUrl}`;
        setPhotoPreview(photoUrl);
        showNotification('success', "✅ Photo mise à jour");
        fetchAdminProfile();
      } else {
        showNotification('error', data.message || "❌ Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification, fetchAdminProfile]);

  // ============================================
  // GESTION DES CANDIDATURES
  // ============================================
  const handleAccepterCandidature = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setShowConventionModal(true);
  }, []);

  const handleRefuserCandidature = useCallback(async (candidatureId) => {
    if (!token) return;
    try {
      const response = await api.updateApplicationStatus(candidatureId, token, "refusee");
      const data = await response.json();
      if (response.ok) {
        showNotification('warning', "❌ Candidature refusée");
        fetchAllApplications();
      } else {
        showNotification('error', data.message || "Erreur lors du refus");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "Erreur de connexion");
    }
  }, [token, showNotification, fetchAllApplications]);

  const handleUploadConvention = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= 5 * 1024 * 1024) {
        setConventionFile(file);
        setConventionName(file.name);
        showNotification('success', "✅ Convention chargée");
      } else showNotification('error', "❌ Fichier trop volumineux (max 5MB)");
    } else showNotification('error', "❌ Format PDF uniquement");
  }, [showNotification]);

  // Fonction pour générer la convention avec vérification
  const handleGenerateConvention = useCallback(async (candidature) => {
    if (!token) return;
    
    // Vérifier si déjà générée
    if (generatedConventions[candidature.id]) {
      showNotification('warning', "⚠️ Convention déjà générée précédemment");
      return;
    }
    
    try {
      showNotification('info', "📄 Génération de la convention en cours...");
      
      const response = await api.generateConvention(token, candidature.id);
      
      if (response.ok) {
        // Récupérer le blob PDF
        const blob = await response.blob();
        
        // Créer une URL pour le blob
        const url = window.URL.createObjectURL(blob);
        
        // Créer un lien pour télécharger
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Convention_${candidature.etudiantNom}_${candidature.entrepriseNom}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        // Nettoyer
        link.remove();
        window.URL.revokeObjectURL(url);
        
        // Sauvegarder l'état dans localStorage
        const newState = { ...generatedConventions, [candidature.id]: true };
        setGeneratedConventions(newState);
        localStorage.setItem('generatedConventions', JSON.stringify(newState));
        
        showNotification('success', "✅ Convention générée et téléchargée avec succès !");
        
        // Rafraîchir la liste pour voir la convention
        fetchAllApplications();
      } else {
        const error = await response.json();
        showNotification('error', error.message || "❌ Erreur lors de la génération");
      }
    } catch (error) {
      console.error("Erreur génération convention:", error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification, fetchAllApplications, generatedConventions]);

  const handleConfirmAcceptation = useCallback(async () => {
    if (!conventionFile) {
      showNotification('error', "❌ Veuillez télécharger la convention");
      return;
    }
    if (!token || !selectedCandidature) return;
    
    try {
      const response = await api.updateApplicationStatus(selectedCandidature.id, token, "acceptee");
      const data = await response.json();
      if (response.ok) {
        showNotification('success', `✅ Candidature acceptée - Convention: ${conventionName}`);
        fetchAllApplications();
      } else {
        showNotification('error', data.message || "Erreur lors de l'acceptation");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "Erreur de connexion");
    }
    
    setShowConventionModal(false);
    setSelectedCandidature(null);
    setConventionFile(null);
    setConventionName("");
  }, [conventionFile, selectedCandidature, token, showNotification, fetchAllApplications]);

  // Fonction pour visualiser la convention
  const handleViewConvention = useCallback((candidature) => {
    setSelectedConventionCandidature(candidature);
    if (candidature.conventionUrl) {
      setConventionPdfUrl(candidature.conventionUrl);
    } else {
      setConventionPdfUrl(null);
    }
    setShowViewConventionModal(true);
  }, []);

  // ============================================
  // GESTION DU MOT DE PASSE
  // ============================================
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
    
    if (!token) return;
    
    try {
      const response = await api.changeAdminPassword(token, {
        ancienMotDePasse: passwordData.ancienMotDePasse,
        nouveauMotDePasse: passwordData.nouveauMotDePasse
      });
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', "✅ Mot de passe changé avec succès");
        setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
        setPasswordErrors({});
      } else {
        showNotification('error', data.message || "❌ Ancien mot de passe incorrect");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [passwordData, token, showNotification]);

  // ============================================
  // MENU ITEMS
  // ============================================
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "statistiques", label: "Tableau de bord", icon: <BarChart3 size={18} /> },
    { id: "conventions", label: "Conventions", icon: <FileText size={18} /> },
    { id: "changePassword", label: "Changer mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <HelpCircle size={18} /> },
  ];

  const getMenuTitle = (id) => {
    const titles = {
      profil: 'Mon profil', 
      statistiques: 'Tableau de bord',
      conventions: 'Conventions de stage',
      changePassword: 'Changer le mot de passe',
      aide: 'Conditions & Aide'
    };
    return titles[id] || 'Dashboard';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.bg }}>
        <div className="text-center">
          <div className="spinner mx-auto"></div>
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
          <div className={`${notification.type === 'success' ? 'bg-emerald-500' : notification.type === 'warning' ? 'bg-amber-500' : 'bg-rose-500'} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* MODAL CONVENTION POUR ACCEPTATION */}
      {showConventionModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
              <h3 className="text-xl font-bold" style={{ color: theme.text }}>Accepter la candidature</h3>
              <button onClick={() => setShowConventionModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} style={{ color: theme.text }} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                <p className="font-medium" style={{ color: theme.text }}>{selectedCandidature.etudiantNom}</p>
                <p className="text-sm" style={{ color: theme.textLight }}>{selectedCandidature.offreTitre}</p>
                <p className="text-xs mt-1" style={{ color: theme.textLight }}>📧 {selectedCandidature.email}</p>
              </div>
              <div className="border-2 border-dashed rounded-xl p-5 text-center hover:border-emerald-400 transition" style={{ borderColor: theme.border }}>
                <Upload size={40} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                <p className="mb-2" style={{ color: theme.text }}>Télécharger la convention de stage</p>
                <p className="text-xs mb-3" style={{ color: theme.textLight }}>Format PDF uniquement (max 5MB)</p>
                <label className="bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-600 inline-flex items-center gap-2 text-sm">
                  <Upload size={14} /> Choisir un fichier
                  <input type="file" accept=".pdf" className="hidden" onChange={handleUploadConvention} />
                </label>
                {conventionName && (
                  <div className="mt-3 p-2 rounded-lg flex items-center justify-between" style={{ backgroundColor: theme.cardAlt }}>
                    <div className="flex items-center gap-2"><FileText size={16} className="text-emerald-500" /><span className="text-sm" style={{ color: theme.text }}>{conventionName}</span></div>
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                )}
              </div>
              <p className="text-xs mt-3 text-center" style={{ color: theme.textLight }}>La candidature sera déplacée vers la section Conventions</p>
            </div>
            <div className="p-6 border-t flex gap-3" style={{ borderColor: theme.border }}>
              <button onClick={handleConfirmAcceptation} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"><Check size={16} /> Accepter la candidature</button>
              <button onClick={() => setShowConventionModal(false)} className="flex-1 py-2 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VISUALISATION CONVENTION */}
      {showViewConventionModal && selectedConventionCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-3xl w-full shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                <FileText size={24} className="text-emerald-500" />
                Convention de stage
              </h3>
              <button onClick={() => setShowViewConventionModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                <p className="font-medium" style={{ color: theme.text }}>{selectedConventionCandidature.etudiantNom}</p>
                <p className="text-sm" style={{ color: theme.textLight }}>{selectedConventionCandidature.offreTitre}</p>
                <p className="text-xs mt-1" style={{ color: theme.textLight }}>📧 {selectedConventionCandidature.email}</p>
              </div>
              
              <div className="border rounded-xl p-6 text-center" style={{ borderColor: theme.border, backgroundColor: theme.cardAlt }}>
                {conventionPdfUrl ? (
                  <div>
                    <iframe 
                      src={conventionPdfUrl} 
                      className="w-full h-96 rounded-lg mb-3"
                      title="Convention PDF"
                    />
                    <a 
                      href={conventionPdfUrl} 
                      download="convention.pdf"
                      className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
                    >
                      <Download size={16} /> Télécharger la convention
                    </a>
                  </div>
                ) : (
                  <div>
                    <FileText size={64} className="mx-auto mb-3 text-emerald-500" />
                    <p className="text-lg font-medium mb-2" style={{ color: theme.text }}>Aucune convention disponible</p>
                    <p className="text-sm" style={{ color: theme.textLight }}>
                      Veuillez accepter la candidature avec une convention
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t flex justify-end" style={{ borderColor: theme.border }}>
              <button onClick={() => setShowViewConventionModal(false)} className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 flex-shrink-0" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-md">
              {photoPreview ? (
                <img src={photoPreview} alt="Admin" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {chefProfil.nom?.charAt(0) || 'A'}
                </span>
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white tracking-tight">{chefProfil.nom || "Administrateur"}</p>
            <p className="text-emerald-400 text-xs font-medium mt-1">{chefProfil.titre || "Administrateur"}</p>
          </div>
        </div>
        
        <nav className="p-4">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveMenu(item.id)} 
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all duration-200
                ${activeMenu === item.id 
                  ? "bg-gray-800 text-white border-l-2 border-emerald-400" 
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                }
              `}
            >
              <div className={`${activeMenu === item.id ? "text-emerald-400" : ""}`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.id === "conventions" && candidaturesAcceptees.length > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {candidaturesAcceptees.length}
                </span>
              )}
            </button>
          ))}
          
          <div className="h-px bg-gray-700 my-3"></div>
          
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </nav>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10" style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}` }}>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>{getMenuTitle(activeMenu)}</h2>
          <div className="flex items-center gap-3">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.cardAlt }}>
                <User size={18} style={{ color: theme.textLight }} />
              </div>
            )}
            <span className="font-medium" style={{ color: theme.text }}>{chefProfil.nom || "Admin"}</span>
          </div>
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
                        <img src={photoPreview} alt="Photo" className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white" />
                      ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <User size={40} className="text-gray-400" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600">
                        <Camera size={14} className="text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      {!isEditing ? (
                        <>
                          <h3 className="text-2xl font-bold" style={{ color: theme.text }}>{chefProfil.nom || "Administrateur"}</h3>
                          <p className="text-emerald-600 font-medium">{chefProfil.titre || "Administrateur"}</p>
                          <p className="text-sm" style={{ color: theme.textLight }}>{chefProfil.email || "admin@stagio.com"}</p>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <input type="text" name="nom" value={chefProfil.nom} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Nom complet" />
                          <input type="text" name="titre" value={chefProfil.titre} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Titre" />
                          <input type="email" name="email" value={chefProfil.email} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Email" />
                        </div>
                      )}
                    </div>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                        <Edit2 size={16} /> Modifier
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
              <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}>
                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                  <User size={18} className="text-emerald-500" /> Informations professionnelles
                </h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm flex items-center gap-1 mb-1" style={{ color: theme.textLight }}>
                      <Phone size={14} /> Téléphone
                    </label>
                    {!isEditing ? (
                      <p style={{ color: theme.text }}>{chefProfil.telephone || "Non renseigné"}</p>
                    ) : (
                      <input type="tel" name="telephone" value={chefProfil.telephone} onChange={handleInputChange} className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                    )}
                  </div>
                  <div>
                    <label className="text-sm flex items-center gap-1 mb-1" style={{ color: theme.textLight }}>
                      <MapPin size={14} /> Bureau
                    </label>
                    {!isEditing ? (
                      <p style={{ color: theme.text }}>{chefProfil.bureau || "Non renseigné"}</p>
                    ) : (
                      <input type="text" name="bureau" value={chefProfil.bureau} onChange={handleInputChange} className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm mb-1 block" style={{ color: theme.textLight }}>Bio</label>
                    {!isEditing ? (
                      <p className="p-2 rounded-lg" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{chefProfil.bio || "Aucune bio"}</p>
                    ) : (
                      <textarea name="bio" value={chefProfil.bio} onChange={handleInputChange} rows="3" className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATISTIQUES */}
          {activeMenu === "statistiques" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: theme.text }}>Tableau de bord</h3>
                  <p className="text-sm" style={{ color: theme.textLight }}>Bienvenue, {chefProfil.nom || "Administrateur"} 👋</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedPeriode("semaine")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "semaine" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>Semaine</button>
                  <button onClick={() => setSelectedPeriode("mois")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "mois" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>Mois</button>
                  <button onClick={() => setSelectedPeriode("annee")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "annee" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>Année</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm" style={{ color: theme.textLight }}>Total Offres</p>
                      <p className="text-3xl font-bold" style={{ color: theme.text }}>{calculatedStats.totalOffres}</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +{calculatedStats.evolutionOffres}%</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                      <Briefcase size={24} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-blue-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm" style={{ color: theme.textLight }}>Entreprises</p>
                      <p className="text-3xl font-bold" style={{ color: theme.text }}>{calculatedStats.totalEntreprises}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                      <Building size={24} className="text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-purple-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm" style={{ color: theme.textLight }}>Candidatures actives</p>
                      <p className="text-3xl font-bold" style={{ color: theme.text }}>{calculatedStats.candidaturesEnAttente}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-orange-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm" style={{ color: theme.textLight }}>Conventions</p>
                      <p className="text-3xl font-bold text-emerald-600">{calculatedStats.candidaturesAcceptees}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold" style={{ color: theme.text }}>📈 Évolution des offres et candidatures</h4>
                    <Activity size={18} className="text-gray-400" />
                  </div>
                  <div className="h-64 relative">
                    <div className="absolute inset-0 flex items-end gap-2 pt-6">
                      {currentData.offres.map((value, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col gap-1">
                            <div className="bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600" style={{ height: `${(value / Math.max(...currentData.offres)) * 180}px` }}></div>
                            <div className="bg-blue-400 rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${(currentData.candidatures[idx] / Math.max(...currentData.candidatures)) * 120}px` }}></div>
                          </div>
                          <span className="text-xs mt-2" style={{ color: theme.textLight }}>{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded"></div><span className="text-xs" style={{ color: theme.textLight }}>Offres</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded"></div><span className="text-xs" style={{ color: theme.textLight }}>Candidatures</span></div>
                  </div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                  <h4 className="font-semibold mb-4" style={{ color: theme.text }}>🎯 Répartition des candidatures</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: theme.textLight }}>Acceptées</span>
                        <span className="font-semibold text-emerald-600">{calculatedStats.tauxAcceptation}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${calculatedStats.tauxAcceptation}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: theme.textLight }}>En attente</span>
                        <span className="font-semibold text-yellow-600">{calculatedStats.tauxAttente}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${calculatedStats.tauxAttente}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: theme.textLight }}>Refusées</span>
                        <span className="font-semibold text-rose-600">{calculatedStats.tauxRefus}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${calculatedStats.tauxRefus}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONVENTIONS AVEC BOUTON DÉSACTIVABLE */}
          {activeMenu === "conventions" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold" style={{ color: theme.text }}>Conventions de stage</h3>
                <p className="text-sm" style={{ color: theme.textLight }}>
                  {candidaturesAcceptees.length} convention{candidaturesAcceptees.length > 1 ? 's' : ''} disponible{candidaturesAcceptees.length > 1 ? 's' : ''}
                </p>
              </div>

              {candidaturesAcceptees.length === 0 ? (
                <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                  <FileText size={48} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium" style={{ color: theme.text }}>Aucune convention disponible</p>
                  <p className="text-sm mt-2" style={{ color: theme.textLight }}>Les conventions apparaîtront ici après acceptation des candidatures</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {candidaturesAcceptees.map(candidature => (
                    <div key={candidature.id} className="rounded-xl p-5 shadow-sm border-l-4 border-emerald-400 hover:shadow-md transition" style={{ backgroundColor: theme.card }}>
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div className="flex-1">
                          {/* En-tête avec nom et statut */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                              <span className="text-base font-bold text-emerald-600">
                                {candidature.etudiantNom?.charAt(0) || 'E'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg" style={{ color: theme.text }}>{candidature.etudiantNom || "Étudiant"}</h4>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
                                Acceptée
                              </span>
                            </div>
                          </div>

                          {/* Détails de l'offre et entreprise */}
                          <div className="ml-12 space-y-1">
                            <p className="text-sm flex items-center gap-2" style={{ color: theme.text }}>
                              <Briefcase size={14} className="text-emerald-500" />
                              <span className="font-medium">Offre:</span>
                              <span style={{ color: theme.textLight }}>{candidature.offreTitre || "Non spécifié"}</span>
                            </p>
                            
                            <p className="text-sm flex items-center gap-2" style={{ color: theme.text }}>
                              <Building size={14} className="text-blue-500" />
                              <span className="font-medium">Entreprise:</span>
                              <span style={{ color: theme.textLight }}>{candidature.entrepriseNom || candidature.entreprise || "Non spécifiée"}</span>
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <p className="text-xs flex items-center gap-2" style={{ color: theme.textLight }}>
                                <Mail size={12} className="text-gray-400" />
                                <span>{candidature.email || "Email non renseigné"}</span>
                              </p>
                              
                              <p className="text-xs flex items-center gap-2" style={{ color: theme.textLight }}>
                                <Phone size={12} className="text-gray-400" />
                                <span>{candidature.telephone || "Téléphone non renseigné"}</span>
                              </p>
                              
                              <p className="text-xs flex items-center gap-2" style={{ color: theme.textLight }}>
                                <Calendar size={12} className="text-gray-400" />
                                <span>Postulé le: {candidature.date ? new Date(candidature.date).toLocaleDateString('fr-FR') : "Date inconnue"}</span>
                              </p>
                              
                              {candidature.periode && (
                                <p className="text-xs flex items-center gap-2" style={{ color: theme.textLight }}>
                                  <Clock size={12} className="text-gray-400" />
                                  <span>Période: {candidature.periode}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Bouton Générer convention - Désactivé après clic */}
                        <div className="flex gap-2 items-center">
                          <button 
                            onClick={() => handleGenerateConvention(candidature)} 
                            disabled={generatedConventions[candidature.id]}
                            className={`
                              px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition
                              ${generatedConventions[candidature.id] 
                                ? 'bg-gray-500 cursor-not-allowed opacity-60' 
                                : 'bg-emerald-500 hover:bg-emerald-600'
                              } text-white
                            `}
                          >
                            <FileText size={16} /> 
                            {generatedConventions[candidature.id] ? 'Déjà générée' : 'Générer convention'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CHANGER MOT DE PASSE */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto">
              <div className="rounded-2xl shadow-sm p-8" style={{ backgroundColor: theme.card }}>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.cardAlt }}>
                    <Key size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: theme.text }}>Changer le mot de passe</h3>
                  <p className="text-sm mt-2" style={{ color: theme.textLight }}>Sécurisez votre compte</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Ancien mot de passe</label>
                    <input type="password" name="ancienMotDePasse" value={passwordData.ancienMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Entrez votre mot de passe actuel" />
                    {passwordErrors.ancienMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.ancienMotDePasse}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Nouveau mot de passe</label>
                    <input type="password" name="nouveauMotDePasse" value={passwordData.nouveauMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Minimum 6 caractères" />
                    {passwordErrors.nouveauMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.nouveauMotDePasse}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Confirmer</label>
                    <input type="password" name="confirmerMotDePasse" value={passwordData.confirmerMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Retapez votre nouveau mot de passe" />
                    {passwordErrors.confirmerMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmerMotDePasse}</p>}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={handleSubmitPasswordChange} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Changer</button>
                    <button onClick={() => { setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" }); setPasswordErrors({}); }} className="flex-1 py-3 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Réinitialiser</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AIDE */}
          {activeMenu === "aide" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <HelpCircle size={24} className="text-emerald-500" /> Centre d'aide
                </h3>
                <p className="text-sm mb-6" style={{ color: theme.textLight }}>Retrouvez ici toutes les informations nécessaires pour utiliser la plateforme</p>
                <div className="space-y-4">
                  <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                    <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}>
                      <BookOpen size={16} className="text-emerald-500" /> Rôle de l'administrateur
                    </h4>
                    <p className="text-sm" style={{ color: theme.textLight }}>En tant qu'administrateur, vous pouvez gérer les candidatures (accepter avec convention, refuser), et superviser l'ensemble du processus.</p>
                  </div>
                  <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                    <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}>
                      <FileText size={16} className="text-emerald-500" /> Comment gérer les conventions ?
                    </h4>
                    <p className="text-sm" style={{ color: theme.textLight }}>1. Acceptez une candidature avec le bouton "Accepter + Convention"<br />2. Téléchargez la convention PDF<br />3. La candidature disparaît de la section "Candidatures"<br />4. Elle apparaît dans la section "Conventions"<br />5. Cliquez sur "Générer convention" pour créer et télécharger la convention</p>
                  </div>
                  <div className="rounded-xl p-4 border-l-4 border-emerald-500" style={{ backgroundColor: theme.cardAlt }}>
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-2">
                      <ExternalLink size={16} /> Support technique
                    </h4>
                    <p className="text-sm" style={{ color: theme.textLight }}>support@stage.io</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          border: 3px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          border-top-color: #10b981;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes slide-in { 
          from { opacity: 0; transform: translateX(100%); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}