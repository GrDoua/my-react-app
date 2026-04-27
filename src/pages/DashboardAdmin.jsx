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

// ============================================
// COMPOSANT DASHBOARD ADMIN AVEC MODE SOMBRE SYNCHRONISÉ
// ============================================
export function DashboardAdmin({ 
  offres = [], 
  entreprises = [], 
  candidatures = [], 
  onDeleteOffre, 
  onUpdateCandidature, 
  onLogout, 
  onUpdateProfil, 
  onChangePassword,
  darkMode  // ← Reçoit darkMode de App.jsx
}) {
  // États principaux
  const [activeMenu, setActiveMenu] = useState("profil");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // États pour le profil
  const [isEditing, setIsEditing] = useState(false);
  const [chefProfil, setChefProfil] = useState({
    nom: "Dr. Karim Benali",
    titre: "Chef du Département Informatique",
    email: "karim.benali@universite.dz",
    telephone: "+213 5XX XX XX XX",
    bureau: "Bâtiment A, Bureau 204",
    bio: "Professeur en informatique, responsable du département et des stages étudiants."
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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
  const [showSendConventionModal, setShowSendConventionModal] = useState(false);

  // États pour les graphiques
  const [selectedPeriode, setSelectedPeriode] = useState("mois");

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

  const stats = useMemo(() => ({
    totalOffres: offres?.length || 0,
    totalEntreprises: entreprises?.length || 0,
    totalCandidatures: candidatures?.length || 0,
    offresActives: offres?.filter(o => o.statut === "active").length || 0,
    offresExpirees: offres?.filter(o => o.statut === "expiree" || (o.dateFin && new Date(o.dateFin) < new Date())).length || 0,
    tauxAcceptation: candidatures?.length ? Math.round((candidatures.filter(c => c.statut === "acceptee").length / candidatures.length) * 100) : 0,
    tauxRefus: candidatures?.length ? Math.round((candidatures.filter(c => c.statut === "refusee").length / candidatures.length) * 100) : 0,
    tauxAttente: candidatures?.length ? Math.round((candidatures.filter(c => c.statut === "en_attente").length / candidatures.length) * 100) : 0,
    evolutionOffres: +12,
    evolutionCandidatures: +23,
  }), [offres, entreprises, candidatures]);

  const graphData = {
    mois: { offres: [12, 15, 18, 22, 28, 35, 42, 48, 52, 58, 62, 68], candidatures: [8, 12, 18, 25, 35, 48, 62, 78, 95, 112, 128, 145] },
    semaine: { offres: [8, 12, 15, 18, 22, 25, 28], candidatures: [5, 8, 12, 18, 25, 32, 40] },
    annee: { offres: [120, 145, 168, 192, 215], candidatures: [85, 110, 145, 185, 230] }
  };

  const currentData = graphData[selectedPeriode];

  const candidaturesFiltrees = useMemo(() => {
    let filtered = [...candidatures];
    if (filterStatut !== "Tous") filtered = filtered.filter(c => c.statut === filterStatut);
    if (searchTerm) filtered = filtered.filter(c => 
      (c.etudiantNom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.offreTitre || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered;
  }, [candidatures, filterStatut, searchTerm]);

  // ============================================
  // NOTIFICATION
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ============================================
  // GESTION DU PROFIL
  // ============================================
  const handleInputChange = useCallback((e) => {
    setChefProfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(() => {
    if (onUpdateProfil) onUpdateProfil(chefProfil);
    setIsEditing(false);
    showNotification('success', "✅ Profil mis à jour");
  }, [chefProfil, onUpdateProfil, showNotification]);

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Photo mise à jour");
    } else showNotification('error', "❌ Image invalide");
  }, [showNotification]);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Logo mis à jour");
    } else showNotification('error', "❌ Image invalide");
  }, [showNotification]);

  // ============================================
  // GESTION DES CANDIDATURES AVEC CONVENTIONS
  // ============================================
  const handleAccepterCandidature = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setShowConventionModal(true);
  }, []);

  const handleRefuserCandidature = useCallback((candidatureId) => {
    if (onUpdateCandidature) {
      onUpdateCandidature(candidatureId, "refusee");
      showNotification('warning', "❌ Candidature refusée");
    }
  }, [onUpdateCandidature, showNotification]);

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

  const handleConfirmAcceptation = useCallback(() => {
    if (!conventionFile) {
      showNotification('error', "❌ Veuillez télécharger la convention");
      return;
    }
    if (onUpdateCandidature) {
      onUpdateCandidature(selectedCandidature.id, "acceptee", { convention: conventionName });
      showNotification('success', `✅ Candidature acceptée - Convention: ${conventionName}`);
    }
    setShowConventionModal(false);
    setSelectedCandidature(null);
    setConventionFile(null);
    setConventionName("");
  }, [conventionFile, selectedCandidature, onUpdateCandidature, showNotification]);

  const handleSendConvention = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setConventionFile(null);
    setConventionName("");
    setShowSendConventionModal(true);
  }, []);

  const handleSendConventionToCandidat = useCallback(() => {
    if (!conventionFile) {
      showNotification('error', "❌ Veuillez sélectionner une convention");
      return;
    }
    showNotification('success', `📧 Convention envoyée à ${selectedCandidature.etudiantNom} (${selectedCandidature.email})`);
    setShowSendConventionModal(false);
    setSelectedCandidature(null);
    setConventionFile(null);
    setConventionName("");
  }, [conventionFile, selectedCandidature, showNotification]);

  // ============================================
  // GESTION DU MOT DE PASSE
  // ============================================
  const handlePasswordChange = useCallback((e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }, []);

  const handleSubmitPasswordChange = useCallback(() => {
    const errors = {};
    if (!passwordData.ancienMotDePasse) errors.ancienMotDePasse = "Champ requis";
    if (!passwordData.nouveauMotDePasse) errors.nouveauMotDePasse = "Champ requis";
    else if (passwordData.nouveauMotDePasse.length < 6) errors.nouveauMotDePasse = "Minimum 6 caractères";
    if (passwordData.nouveauMotDePasse !== passwordData.confirmerMotDePasse) errors.confirmerMotDePasse = "Les mots de passe ne correspondent pas";
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    if (passwordData.ancienMotDePasse !== "admin123") {
      showNotification('error', "❌ Ancien mot de passe incorrect");
      return;
    }
    
    if (onChangePassword) onChangePassword(passwordData.nouveauMotDePasse);
    setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
    showNotification('success', "✅ Mot de passe changé");
  }, [passwordData, onChangePassword, showNotification]);

  // ============================================
  // MENU ITEMS
  // ============================================
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "statistiques", label: "Tableau de bord", icon: <BarChart3 size={18} /> },
    { id: "candidatures", label: "Candidatures", icon: <Users size={18} /> },
    { id: "changePassword", label: "Changer mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <HelpCircle size={18} /> },
  ];

  const getMenuTitle = (id) => {
    const titles = {
      profil: 'Mon profil', statistiques: 'Tableau de bord',
      candidatures: 'Candidatures',
      changePassword: 'Changer le mot de passe',
      aide: 'Conditions & Aide'
    };
    return titles[id] || 'Dashboard';
  };

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
              <p className="text-xs mt-3 text-center" style={{ color: theme.textLight }}>La convention sera envoyée automatiquement à l'étudiant par email</p>
            </div>
            <div className="p-6 border-t flex gap-3" style={{ borderColor: theme.border }}>
              <button onClick={handleConfirmAcceptation} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"><Send size={16} /> Accepter & Envoyer</button>
              <button onClick={() => setShowConventionModal(false)} className="flex-1 py-2 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ENVOI CONVENTION À UN CANDIDAT ACCEPTÉ */}
      {showSendConventionModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-md w-full shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
              <h3 className="text-xl font-bold" style={{ color: theme.text }}>Envoyer une convention</h3>
              <button onClick={() => setShowSendConventionModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} style={{ color: theme.text }} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                <p className="font-medium" style={{ color: theme.text }}>{selectedCandidature.etudiantNom}</p>
                <p className="text-sm" style={{ color: theme.textLight }}>{selectedCandidature.offreTitre}</p>
                <p className="text-xs mt-1" style={{ color: theme.textLight }}>📧 {selectedCandidature.email}</p>
              </div>
              <div className="border-2 border-dashed rounded-xl p-5 text-center hover:border-emerald-400 transition" style={{ borderColor: theme.border }}>
                <Upload size={40} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                <p className="mb-2" style={{ color: theme.text }}>Sélectionner la convention (PDF)</p>
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
            </div>
            <div className="p-6 border-t flex gap-3" style={{ borderColor: theme.border }}>
              <button onClick={handleSendConventionToCandidat} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"><Send size={16} /> Envoyer la convention</button>
              <button onClick={() => setShowSendConventionModal(false)} className="flex-1 py-2 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
   <div className="w-72 flex-shrink-0" style={{ backgroundColor: theme.sidebar }}>
  <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
    {/* Avatar ou icône par défaut */}
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-md">
        <span className="text-2xl font-bold text-white">
          {chefProfil.nom?.charAt(0) || '👨'}
        </span>
      </div>
    </div>
    
    <div className="text-center">
      <p className="text-xl font-bold text-white tracking-tight">{chefProfil.nom}</p>
      <p className="text-emerald-400 text-xs font-medium mt-1">{chefProfil.titre}</p>
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
            {photoPreview ? <img src={photoPreview} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400" /> : <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.cardAlt }}><User size={18} style={{ color: theme.textLight }} /></div>}
            <span className="font-medium" style={{ color: theme.text }}>{chefProfil.nom}</span>
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
                      {photoPreview ? <img src={photoPreview} alt="Photo" className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white" /> : <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-600 flex items-center justify-center"><User size={40} className="text-gray-400" /></div>}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600"><Camera size={14} className="text-white" /><input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} /></label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div>{!isEditing ? (<><h3 className="text-2xl font-bold" style={{ color: theme.text }}>{chefProfil.nom}</h3><p className="text-emerald-600 font-medium">{chefProfil.titre}</p><p className="text-sm" style={{ color: theme.textLight }}>{chefProfil.email}</p></>) : (<div className="space-y-2"><input type="text" name="nom" value={chefProfil.nom} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /><input type="text" name="titre" value={chefProfil.titre} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /><input type="email" name="email" value={chefProfil.email} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /></div>)}</div>
                    {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Edit2 size={16} /> Modifier</button> : <div className="flex gap-2"><button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Enregistrer</button><button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2"><X size={16} /> Annuler</button></div>}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}>
                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}><User size={18} className="text-emerald-500" /> Informations professionnelles</h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <div><label className="text-sm flex items-center gap-1 mb-1" style={{ color: theme.textLight }}><Phone size={14} /> Téléphone</label>{!isEditing ? <p style={{ color: theme.text }}>{chefProfil.telephone}</p> : <input type="tel" name="telephone" value={chefProfil.telephone} onChange={handleInputChange} className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />}</div>
                  <div><label className="text-sm flex items-center gap-1 mb-1" style={{ color: theme.textLight }}><MapPin size={14} /> Bureau</label>{!isEditing ? <p style={{ color: theme.text }}>{chefProfil.bureau}</p> : <input type="text" name="bureau" value={chefProfil.bureau} onChange={handleInputChange} className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />}</div>
                  <div className="md:col-span-2"><label className="text-sm mb-1 block" style={{ color: theme.textLight }}>Bio</label>{!isEditing ? <p className="p-2 rounded-lg" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{chefProfil.bio}</p> : <textarea name="bio" value={chefProfil.bio} onChange={handleInputChange} rows="3" className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}></textarea>}</div>
                </div>
              </div>
            </div>
          )}

          {/* STATISTIQUES */}
          {activeMenu === "statistiques" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-2xl font-bold" style={{ color: theme.text }}>Tableau de bord</h3><p className="text-sm" style={{ color: theme.textLight }}>Bienvenue, {chefProfil.nom} 👋</p></div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedPeriode("semaine")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "semaine" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>Semaine</button>
                  <button onClick={() => setSelectedPeriode("mois")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "mois" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>Mois</button>
                  <button onClick={() => setSelectedPeriode("annee")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedPeriode === "annee" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>Année</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-emerald-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start"><div><p className="text-sm" style={{ color: theme.textLight }}>Total Offres</p><p className="text-3xl font-bold" style={{ color: theme.text }}>{stats.totalOffres}</p><p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +{stats.evolutionOffres}%</p></div><div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center"><Briefcase size={24} className="text-emerald-600" /></div></div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-blue-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start"><div><p className="text-sm" style={{ color: theme.textLight }}>Entreprises</p><p className="text-3xl font-bold" style={{ color: theme.text }}>{stats.totalEntreprises}</p><p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +5</p></div><div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center"><Building size={24} className="text-blue-600" /></div></div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-purple-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start"><div><p className="text-sm" style={{ color: theme.textLight }}>Candidatures</p><p className="text-3xl font-bold" style={{ color: theme.text }}>{stats.totalCandidatures}</p><p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUp size={12} /> +{stats.evolutionCandidatures}%</p></div><div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center"><Users size={24} className="text-purple-600" /></div></div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm hover:shadow-md transition border-l-4 border-orange-500" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start"><div><p className="text-sm" style={{ color: theme.textLight }}>Taux acceptation</p><p className="text-3xl font-bold text-emerald-600">{stats.tauxAcceptation}%</p></div><div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center"><TrendingUp size={24} className="text-orange-600" /></div></div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-center mb-4"><h4 className="font-semibold" style={{ color: theme.text }}>📈 Évolution des offres et candidatures</h4><Activity size={18} className="text-gray-400" /></div>
                  <div className="h-64 relative"><div className="absolute inset-0 flex items-end gap-2 pt-6">{currentData.offres.map((value, idx) => (<div key={idx} className="flex-1 flex flex-col items-center gap-1"><div className="w-full flex flex-col gap-1"><div className="bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600" style={{ height: `${(value / Math.max(...currentData.offres)) * 180}px` }}></div><div className="bg-blue-400 rounded-t-lg transition-all hover:bg-blue-500" style={{ height: `${(currentData.candidatures[idx] / Math.max(...currentData.candidatures)) * 120}px` }}></div></div><span className="text-xs mt-2" style={{ color: theme.textLight }}>{idx + 1}</span></div>))}</div></div>
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: theme.border }}><div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded"></div><span className="text-xs" style={{ color: theme.textLight }}>Offres</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded"></div><span className="text-xs" style={{ color: theme.textLight }}>Candidatures</span></div></div>
                </div>
                <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                  <h4 className="font-semibold mb-4" style={{ color: theme.text }}>🎯 Répartition des candidatures</h4>
                  <div className="space-y-4"><div><div className="flex justify-between text-sm mb-1"><span style={{ color: theme.textLight }}>Acceptées</span><span className="font-semibold text-emerald-600">{stats.tauxAcceptation}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${stats.tauxAcceptation}%`}}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span style={{ color: theme.textLight }}>En attente</span><span className="font-semibold text-yellow-600">{stats.tauxAttente}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{width: `${stats.tauxAttente}%`}}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span style={{ color: theme.textLight }}>Refusées</span><span className="font-semibold text-rose-600">{stats.tauxRefus}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full" style={{width: `${stats.tauxRefus}%`}}></div></div></div></div>
                </div>
              </div>
            </div>
          )}

          {/* CANDIDATURES */}
          {activeMenu === "candidatures" && (
            <div>
              <div className="flex flex-wrap gap-4 mb-5 items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Gestion des candidatures</h3>
                <div className="flex gap-3">
                  <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textLight }} /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border rounded-xl text-sm w-64" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /></div>
                  <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 border rounded-xl text-sm" style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}><option value="Tous">Tous</option><option value="en_attente">En attente</option><option value="acceptee">Acceptée</option><option value="refusee">Refusée</option></select>
                </div>
              </div>
              <div className="space-y-3">
                {candidaturesFiltrees.map(c => (
                  <div key={c.id} className={`rounded-xl p-4 shadow-sm border-l-4 ${c.statut === "acceptee" ? "border-emerald-400" : c.statut === "refusee" ? "border-rose-400" : "border-yellow-400"}`} style={{ backgroundColor: theme.card }}>
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold" style={{ color: theme.text }}>{c.etudiantNom}</h4>
                        <p className="text-sm" style={{ color: theme.textLight }}>{c.offreTitre}</p>
                        <p className="text-xs" style={{ color: theme.textLight }}>Postulé le {c.date}</p>
                        {c.convention && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600"><FileText size={12} /> Convention: {c.convention}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {c.statut === "acceptee" && (
                          <button onClick={() => handleSendConvention(c)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-600 flex items-center gap-1"><Send size={14} /> Convention</button>
                        )}
                        {c.statut === "en_attente" && (
                          <>
                            <button onClick={() => handleAccepterCandidature(c)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-600 flex items-center gap-1"><FileText size={14} /> Accepter + Convention</button>
                            <button onClick={() => handleRefuserCandidature(c.id)} className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-rose-600 flex items-center gap-1"><X size={14} /> Refuser</button>
                          </>
                        )}
                        {c.statut === "refusee" && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300">Refusée</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHANGER MOT DE PASSE */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto"><div className="rounded-2xl shadow-sm p-8" style={{ backgroundColor: theme.card }}><div className="text-center mb-6"><div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.cardAlt }}><Key size={40} className="text-emerald-500" /></div><h3 className="text-2xl font-bold" style={{ color: theme.text }}>Changer le mot de passe</h3><p className="text-sm mt-2" style={{ color: theme.textLight }}>Sécurisez votre compte</p></div><div className="space-y-4"><div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Ancien mot de passe</label><input type="password" name="ancienMotDePasse" value={passwordData.ancienMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Entrez votre mot de passe actuel" />{passwordErrors.ancienMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.ancienMotDePasse}</p>}</div><div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Nouveau mot de passe</label><input type="password" name="nouveauMotDePasse" value={passwordData.nouveauMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Minimum 6 caractères" />{passwordErrors.nouveauMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.nouveauMotDePasse}</p>}</div><div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Confirmer</label><input type="password" name="confirmerMotDePasse" value={passwordData.confirmerMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Retapez votre nouveau mot de passe" />{passwordErrors.confirmerMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmerMotDePasse}</p>}</div><div className="flex gap-3 pt-4"><button onClick={handleSubmitPasswordChange} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Changer</button><button onClick={() => { setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" }); setPasswordErrors({}); }} className="flex-1 py-3 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Réinitialiser</button></div></div></div></div>
          )}

          {/* AIDE */}
          {activeMenu === "aide" && (
            <div className="max-w-4xl mx-auto space-y-6"><div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}><h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: theme.text }}><HelpCircle size={24} className="text-emerald-500" /> Centre d'aide</h3><p className="text-sm mb-6" style={{ color: theme.textLight }}>Retrouvez ici toutes les informations nécessaires pour utiliser la plateforme</p><div className="space-y-4"><div className="border-b pb-4" style={{ borderColor: theme.border }}><h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}><BookOpen size={16} className="text-emerald-500" /> Rôle de l'administrateur</h4><p className="text-sm" style={{ color: theme.textLight }}>En tant qu'administrateur, vous pouvez gérer les candidatures (accepter avec convention, refuser), et superviser l'ensemble du processus.</p></div><div className="border-b pb-4" style={{ borderColor: theme.border }}><h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}><FileText size={16} className="text-emerald-500" /> Comment gérer les conventions ?</h4><p className="text-sm" style={{ color: theme.textLight }}>1. Acceptez une candidature avec le bouton "Accepter + Convention"<br />2. Téléchargez la convention PDF<br />3. La convention sera envoyée automatiquement à l'étudiant</p></div><div className="rounded-xl p-4 border-l-4 border-emerald-500" style={{ backgroundColor: theme.cardAlt }}><h4 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-2"><ExternalLink size={16} /> Support technique</h4><p className="text-sm" style={{ color: theme.textLight }}>support@stageflow.dz</p></div></div></div></div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}