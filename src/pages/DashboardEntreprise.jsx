import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Briefcase, Users, BarChart3, Building, TrendingUp, Calendar,
  LogOut, Plus, Trash2, User, Key, Save, Edit2, X, CheckCircle, Clock,
  FileText, Upload, Download, FilePlus, Eye, Phone, MapPin, Mail, Search,
  Award, AlertCircle, Check, XCircle, HelpCircle,
  MessageCircle, BookOpen, ExternalLink, DollarSign, Star, Camera, Globe,
  PieChart, Tag
} from "lucide-react";

// ============================================
// COMPOSANT DASHBOARD ENTREPRISE (AVEC MODE SOMBRE SYNCHRONISÉ)
// ============================================
export function DashboardEntreprise({ 
  entreprise, 
  offres = [], 
  candidatures = [], 
  onAjouterOffre, 
  onSupprimerOffre, 
  onLogout, 
  onUpdateProfil, 
  onChangePassword,
  onAccepterCandidat,
  onRefuserCandidat,
  onSaveEvaluation,
  darkMode  // ← Reçoit darkMode de App.jsx
}) {
  // Theme colors basé sur darkMode (pas de state local)
  const theme = {
    bg: darkMode ? '#111827' : '#f3f4f6',
    text: darkMode ? '#f3f4f6' : '#1f2937',
    textLight: darkMode ? '#9ca3af' : '#4b5563',
    card: darkMode ? '#1f2937' : '#ffffff',
    cardAlt: darkMode ? '#374151' : '#f9fafb',
    sidebar: darkMode ? '#111827' : '#111827',
    border: darkMode ? '#374151' : '#e5e7eb',
    inputBg: darkMode ? '#374151' : '#ffffff',
    inputBorder: darkMode ? '#4b5563' : '#d1d5db',
  };

  // États principaux
  const [activeMenu, setActiveMenu] = useState("profil");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  
  // États pour les évaluations
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);
  const [evaluation, setEvaluation] = useState({
    ponctualite: 15,
    qualiteTravail: 15,
    autonomie: 15,
    espritEquipe: 15,
    note: 4,
    commentaire: "",
    progression: ""
  });
  
  // État local des candidatures
  const [localCandidatures, setLocalCandidatures] = useState(candidatures);
  
  useEffect(() => {
    setLocalCandidatures(candidatures);
  }, [candidatures]);
  
  // États pour le profil
  const [isEditing, setIsEditing] = useState(false);
  const [entrepriseProfil, setEntrepriseProfil] = useState({
    nom: entreprise?.nom || "",
    email: entreprise?.email || "",
    secteur: entreprise?.secteur || "",
    description: entreprise?.description || "",
    telephone: entreprise?.telephone || "+213 5XX XX XX XX",
    adresse: entreprise?.adresse || "Alger, Algérie",
    siteWeb: entreprise?.siteWeb || "",
    nbEmployes: entreprise?.nbEmployes || ""
  });
  const [logoPreview, setLogoPreview] = useState(entreprise?.logo || null);
  
  // États pour le mot de passe
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // États pour nouvelle offre
  const [newOffre, setNewOffre] = useState({ 
    titre: "", lieu: "Alger", duree: "6 mois", type: "Stage PFE", 
    salaire: "", description: "", dateCreation: "", dateFin: "", periode: ""
  });
  const [competenceInput, setCompetenceInput] = useState("");

  // ============================================
  // DONNÉES CALCULÉES
  // ============================================
  const mesOffres = useMemo(() => {
    if (!offres || !entreprise) return [];
    return offres.filter(o => o.entrepriseId === entreprise?.id);
  }, [offres, entreprise]);
  
  const mesCandidatures = useMemo(() => {
    if (!localCandidatures || !mesOffres.length) return [];
    const offresIds = mesOffres.map(o => o.id);
    return localCandidatures.filter(c => offresIds.includes(c.offreId));
  }, [localCandidatures, mesOffres]);

  const offresActives = useMemo(() => {
    return mesOffres.filter(o => {
      if (!o.dateFin) return true;
      return new Date(o.dateFin) > new Date();
    }).length;
  }, [mesOffres]);
  
  const candidaturesEnAttente = useMemo(() => mesCandidatures.filter(c => c.statut === "en_attente").length, [mesCandidatures]);
  const candidaturesAcceptees = useMemo(() => mesCandidatures.filter(c => c.statut === "acceptee").length, [mesCandidatures]);
  const candidaturesRefusees = useMemo(() => mesCandidatures.filter(c => c.statut === "refusee").length, [mesCandidatures]);
  const tauxAcceptation = useMemo(() => mesCandidatures.length > 0 ? Math.round((candidaturesAcceptees / mesCandidatures.length) * 100) : 0, [mesCandidatures, candidaturesAcceptees]);

  const candidaturesFiltrees = useMemo(() => {
    let filtered = [...mesCandidatures];
    if (filterStatut !== "Tous") {
      filtered = filtered.filter(c => c.statut === filterStatut);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        (c.etudiantNom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.offreTitre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [mesCandidatures, filterStatut, searchTerm]);

  const stagiairesEvalues = useMemo(() => {
    return mesCandidatures.filter(c => c.statut === "acceptee" && c.evaluation);
  }, [mesCandidatures]);

  // ============================================
  // FONCTIONS
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const handleInputChange = useCallback((e) => {
    setEntrepriseProfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(() => {
    if (onUpdateProfil) onUpdateProfil(entrepriseProfil);
    setIsEditing(false);
    showNotification('success', "✅ Profil mis à jour avec succès");
  }, [entrepriseProfil, onUpdateProfil, showNotification]);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Logo mis à jour");
    } else {
      showNotification('error', "❌ Image invalide ou trop volumineuse (max 5MB)");
    }
  }, [showNotification]);

  const handleAddOffre = useCallback(() => {
    if (!newOffre.titre || !newOffre.salaire || !newOffre.dateCreation || !newOffre.dateFin) {
      showNotification('error', "❌ Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const offreToAdd = {
      id: Date.now(),
      ...newOffre,
      entreprise: entrepriseProfil.nom,
      entrepriseId: entreprise?.id,
      datePublication: new Date().toLocaleDateString('fr-FR'),
      statut: "active",
      competences: competenceInput.split(",").map(c => c.trim()).filter(c => c)
    };
    if (onAjouterOffre) onAjouterOffre(offreToAdd);
    setShowAddModal(false);
    setNewOffre({ titre: "", lieu: "Alger", duree: "6 mois", type: "Stage PFE", salaire: "", description: "", dateCreation: "", dateFin: "", periode: "" });
    setCompetenceInput("");
    showNotification('success', "✅ Offre publiée avec succès");
  }, [newOffre, competenceInput, entrepriseProfil.nom, entreprise?.id, onAjouterOffre, showNotification]);

  const handleViewCV = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setShowCvModal(true);
  }, []);

  const updateCandidatureStatut = useCallback((candidatureId, newStatut) => {
    setLocalCandidatures(prev => 
      prev.map(c => 
        c.id === candidatureId ? { ...c, statut: newStatut } : c
      )
    );
  }, []);

  const updateCandidatureEvaluation = useCallback((candidatureId, evaluationData) => {
    setLocalCandidatures(prev => 
      prev.map(c => 
        c.id === candidatureId ? { ...c, evaluation: evaluationData } : c
      )
    );
  }, []);

  const handleAccepterCandidat = useCallback(async (candidature) => {
    try {
      if (onAccepterCandidat) {
        await onAccepterCandidat(candidature.id);
      }
      updateCandidatureStatut(candidature.id, "acceptee");
      showNotification('success', `✅ Candidature de ${candidature.etudiantNom} acceptée !`);
      setShowCvModal(false);
    } catch (error) {
      showNotification('error', "❌ Erreur lors de l'acceptation");
    }
  }, [onAccepterCandidat, updateCandidatureStatut, showNotification]);

  const handleRefuserCandidat = useCallback(async (candidature) => {
    try {
      if (onRefuserCandidat) {
        await onRefuserCandidat(candidature.id);
      }
      updateCandidatureStatut(candidature.id, "refusee");
      showNotification('success', `❌ Candidature de ${candidature.etudiantNom} refusée.`);
      setShowCvModal(false);
    } catch (error) {
      showNotification('error', "❌ Erreur lors du refus");
    }
  }, [onRefuserCandidat, updateCandidatureStatut, showNotification]);

  const handleSaveEvaluation = useCallback(() => {
    if (selectedStagiaire) {
      const evaluationData = {
        ...evaluation,
        dateEvaluation: new Date().toLocaleDateString('fr-FR'),
        evaluateur: entrepriseProfil.nom
      };
      
      updateCandidatureEvaluation(selectedStagiaire.id, evaluationData);
      
      if (onSaveEvaluation) {
        onSaveEvaluation(selectedStagiaire.id, evaluationData);
      }
      
      showNotification('success', `✅ Évaluation de ${selectedStagiaire.etudiantNom} enregistrée avec succès`);
      setShowEvaluationModal(false);
    }
  }, [evaluation, selectedStagiaire, updateCandidatureEvaluation, onSaveEvaluation, showNotification, entrepriseProfil.nom]);

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
    
    if (passwordData.ancienMotDePasse !== entreprise?.password && passwordData.ancienMotDePasse !== "entreprise123") {
      showNotification('error', "❌ Ancien mot de passe incorrect");
      return;
    }
    
    if (onChangePassword) onChangePassword(passwordData.nouveauMotDePasse);
    setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
    showNotification('success', "✅ Mot de passe changé");
  }, [passwordData, entreprise, onChangePassword, showNotification]);

  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "offres", label: "Mes offres", icon: <Briefcase size={18} /> },
    { id: "candidatures", label: "Candidatures reçues", icon: <Users size={18} /> },
    { id: "stagiaires", label: "Stagiaires évalués", icon: <Award size={18} /> },
    { id: "statistiques", label: "Statistiques", icon: <BarChart3 size={18} /> },
    { id: "changePassword", label: "Modifier mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <HelpCircle size={18} /> },
  ];

  const getMenuTitle = (id) => {
    const titles = {
      profil: 'Mon profil', 
      offres: 'Mes offres de stage',
      candidatures: 'Candidatures reçues', 
      stagiaires: 'Stagiaires évalués',
      statistiques: 'Tableau de bord',
      changePassword: 'Changer le mot de passe',
      aide: 'Conditions & Aide'
    };
    return titles[id] || 'Dashboard';
  };

  if (!entreprise) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.bg }}>
        <div className="text-center"><div className="spinner mx-auto"></div><p className="mt-4" style={{ color: theme.text }}>Chargement...</p></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: theme.bg, color: theme.text }}>

      {/* NOTIFICATION */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* MODAL CV */}
      {showCvModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="sticky top-0 border-b px-6 py-4 flex justify-between items-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h3 className="text-xl font-bold" style={{ color: theme.text }}>CV de {selectedCandidature.etudiantNom}</h3>
              <button onClick={() => setShowCvModal(false)} className="p-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} style={{ color: theme.text }} /></button>
            </div>
            <div className="p-6">
              <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.cardAlt }}>
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}><User size={16} className="text-emerald-600" /> Informations personnelles</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Nom complet:</span> <span className="font-medium" style={{ color: theme.text }}>{selectedCandidature.etudiantNom}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span style={{ color: theme.text }}>{selectedCandidature.email}</span></div>
                  <div><span className="text-gray-500">Téléphone:</span> <span style={{ color: theme.text }}>{selectedCandidature.telephone || "Non renseigné"}</span></div>
                  <div><span className="text-gray-500">Postulé le:</span> <span style={{ color: theme.text }}>{selectedCandidature.date}</span></div>
                </div>
              </div>
              
              <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.cardAlt }}>
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}><Briefcase size={16} className="text-emerald-600" /> Candidature pour</h4>
                <p><span className="text-gray-500">Offre:</span> <span className="font-medium" style={{ color: theme.text }}>{selectedCandidature.offreTitre}</span></p>
                <div className="mt-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedCandidature.statut === "acceptee" ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" : 
                    selectedCandidature.statut === "refusee" ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300" : 
                    "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                  }`}>
                    {selectedCandidature.statut === "acceptee" ? "Acceptée" : selectedCandidature.statut === "refusee" ? "Refusée" : "En attente"}
                  </span>
                </div>
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: theme.cardAlt }}>
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}><FileText size={16} className="text-emerald-600" /> CV du candidat</h4>
                {selectedCandidature.cvContent ? (
                  <pre className="text-sm whitespace-pre-wrap p-4 rounded-lg max-h-96 overflow-y-auto border" style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}>
                    {selectedCandidature.cvContent}
                  </pre>
                ) : (
                  <div className="text-center py-8 rounded-lg" style={{ backgroundColor: theme.card }}>
                    <FileText size={48} className="mx-auto mb-2" style={{ color: theme.textLight }} />
                    <p style={{ color: theme.textLight }}>Aucun CV disponible</p>
                  </div>
                )}
              </div>
            </div>
            
            {selectedCandidature.statut === "en_attente" && (
              <div className="border-t p-6 flex gap-3" style={{ borderColor: theme.border }}>
                <button 
                  onClick={() => handleAccepterCandidat(selectedCandidature)} 
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Accepter la candidature
                </button>
                <button 
                  onClick={() => handleRefuserCandidat(selectedCandidature)} 
                  className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Refuser la candidature
                </button>
              </div>
            )}
            
            {selectedCandidature.statut !== "en_attente" && (
              <div className="border-t p-6" style={{ borderColor: theme.border }}>
                <button onClick={() => setShowCvModal(false)} className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition">
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL ÉVALUATION CANDIDAT */}
      {showEvaluationModal && selectedStagiaire && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="sticky top-0 border-b px-6 py-4 flex justify-between items-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                <Star size={24} className="text-yellow-500" />
                Évaluation de {selectedStagiaire.etudiantNom}
              </h3>
              <button onClick={() => setShowEvaluationModal(false)} className="p-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="rounded-xl p-4" style={{ backgroundColor: theme.cardAlt }}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Stagiaire:</span>
                    <p className="font-semibold" style={{ color: theme.text }}>{selectedStagiaire.etudiantNom}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Offre:</span>
                    <p className="font-semibold" style={{ color: theme.text }}>{selectedStagiaire.offreTitre}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Période:</span>
                    <p style={{ color: theme.text }}>{selectedStagiaire.periode || "Non spécifiée"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date évaluation:</span>
                    <p style={{ color: theme.text }}>{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="font-semibold flex items-center gap-2" style={{ color: theme.text }}>
                  <Award size={18} className="text-emerald-500" />
                  Grille d'évaluation (sur 20 points)
                </h4>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium flex items-center gap-2" style={{ color: theme.text }}>
                      <Clock size={16} className="text-blue-500" /> Ponctualité
                    </label>
                    <span className="text-emerald-600 font-bold">{evaluation.ponctualite}/20</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={evaluation.ponctualite}
                    onChange={(e) => setEvaluation({...evaluation, ponctualite: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: theme.border }}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium flex items-center gap-2" style={{ color: theme.text }}>
                      <FileText size={16} className="text-purple-500" /> Qualité du travail
                    </label>
                    <span className="text-emerald-600 font-bold">{evaluation.qualiteTravail}/20</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={evaluation.qualiteTravail}
                    onChange={(e) => setEvaluation({...evaluation, qualiteTravail: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: theme.border }}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium flex items-center gap-2" style={{ color: theme.text }}>
                      <User size={16} className="text-orange-500" /> Autonomie
                    </label>
                    <span className="text-emerald-600 font-bold">{evaluation.autonomie}/20</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={evaluation.autonomie}
                    onChange={(e) => setEvaluation({...evaluation, autonomie: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: theme.border }}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium flex items-center gap-2" style={{ color: theme.text }}>
                      <Users size={16} className="text-green-500" /> Esprit d'équipe
                    </label>
                    <span className="text-emerald-600 font-bold">{evaluation.espritEquipe}/20</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={evaluation.espritEquipe}
                    onChange={(e) => setEvaluation({...evaluation, espritEquipe: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: theme.border }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t" style={{ borderColor: theme.border }}>
                <div>
                  <label className="font-medium block mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                    <Star size={16} className="text-yellow-500" /> Note globale (sur 5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(note => (
                      <button
                        key={note}
                        onClick={() => setEvaluation({...evaluation, note})}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          evaluation.note >= note 
                            ? 'bg-yellow-400 text-white shadow-md' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-medium block mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                    <TrendingUp size={16} className="text-blue-500" /> Progression observée
                  </label>
                  <select 
                    value={evaluation.progression} 
                    onChange={(e) => setEvaluation({...evaluation, progression: e.target.value})}
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  >
                    <option value="">Sélectionner une progression</option>
                    <option value="excellente">📈 Excellente - Dépassé les objectifs</option>
                    <option value="bonne">📈 Bonne - Progression notable</option>
                    <option value="moyenne">📊 Moyenne - Conforme aux attentes</option>
                    <option value="faible">📉 Faible - Peu de progression</option>
                    <option value="aucune">⏸️ Aucune - Stagnation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium block mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <FileText size={16} className="text-gray-500" /> Commentaire détaillé
                </label>
                <textarea 
                  rows="4"
                  value={evaluation.commentaire}
                  onChange={(e) => setEvaluation({...evaluation, commentaire: e.target.value})}
                  placeholder="Points forts, points à améliorer, recommandations..."
                  className="w-full p-3 border rounded-xl resize-none"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                />
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: theme.cardAlt }}>
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}>
                  <PieChart size={16} className="text-emerald-500" />
                  Résumé de l'évaluation
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Moyenne:</span>
                    <p className="font-bold text-emerald-600">
                      {Math.round((evaluation.ponctualite + evaluation.qualiteTravail + evaluation.autonomie + evaluation.espritEquipe) / 4)}/20
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Note finale:</span>
                    <p className="font-bold text-yellow-600">{evaluation.note}/5 ⭐</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex gap-3" style={{ borderColor: theme.border }}>
              <button 
                onClick={handleSaveEvaluation} 
                className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-2"
              >
                <Save size={18} /> Enregistrer l'évaluation
              </button>
              <button 
                onClick={() => setShowEvaluationModal(false)} 
                className="flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.cardAlt, color: theme.text }}
              >
                <X size={18} /> Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 flex-shrink-0" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-6 border-b" style={{ borderColor: '#374151' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
              {logoPreview ? <img src={logoPreview} className="w-10 h-10 rounded-xl object-cover" alt="logo" /> : <TrendingUp size={20} />}
            </div>
            <div><h1 className="text-xl font-bold text-white">Stag.io</h1><p className="text-emerald-400 text-xs">Espace Entreprise</p></div>
          </div>
          <div className="mt-4 pt-3 border-t" style={{ borderColor: '#374151' }}>
            <p className="text-sm font-medium text-white">{entrepriseProfil.nom}</p>
            <p className="text-emerald-400 text-xs">{entrepriseProfil.secteur || "Entreprise"}</p>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveMenu(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${activeMenu === item.id ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}>
              {item.icon}<span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-3 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"><LogOut size={18} /><span className="text-sm font-medium">Déconnexion</span></button>
        </nav>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10" style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}` }}>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>{getMenuTitle(activeMenu)}</h2>
          <div className="flex items-center gap-3">
            {logoPreview ? <img src={logoPreview} alt="Logo" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400" /> : <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.cardAlt }}><Building size={18} style={{ color: theme.textLight }} /></div>}
            <span className="font-medium" style={{ color: theme.text }}>{entrepriseProfil.nom}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* PROFIL */}
          {activeMenu === "profil" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: theme.card }}>
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      {logoPreview ? <img src={logoPreview} alt="Logo" className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white" /> : <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl">🏢</div>}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600"><Camera size={14} className="text-white" /><input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} /></label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      {!isEditing ? (
                        <><h3 className="text-2xl font-bold" style={{ color: theme.text }}>{entrepriseProfil.nom}</h3><p className="text-emerald-600 font-medium">{entrepriseProfil.secteur}</p><p style={{ color: theme.textLight }}>{entrepriseProfil.email}</p></>
                      ) : (
                        <div className="space-y-2"><input type="text" name="nom" value={entrepriseProfil.nom} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /><input type="text" name="secteur" value={entrepriseProfil.secteur} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /><input type="email" name="email" value={entrepriseProfil.email} onChange={handleInputChange} className="p-2 border rounded-lg w-full" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /></div>
                      )}
                    </div>
                    {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Edit2 size={16} /> Modifier</button> : <div className="flex gap-2"><button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Enregistrer</button><button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2"><X size={16} /> Annuler</button></div>}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}>
                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}><Building size={18} className="text-emerald-500" /> Informations de l'entreprise</h4>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: "Téléphone", name: "telephone", value: entrepriseProfil.telephone, icon: <Phone size={14} /> },
                    { label: "Adresse", name: "adresse", value: entrepriseProfil.adresse, icon: <MapPin size={14} /> },
                    { label: "Site web", name: "siteWeb", value: entrepriseProfil.siteWeb, icon: <Globe size={14} /> },
                    { label: "Nombre d'employés", name: "nbEmployes", value: entrepriseProfil.nbEmployes, icon: <Users size={14} /> }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-sm flex items-center gap-1 mb-1" style={{ color: theme.textLight }}>{field.icon} {field.label}</label>
                      {!isEditing ? <p style={{ color: theme.text }}>{field.value || "Non renseigné"}</p> : <input type="text" name={field.name} value={entrepriseProfil[field.name]} onChange={handleInputChange} className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-sm mb-1 block" style={{ color: theme.textLight }}>Description</label>
                    {!isEditing ? <p className="p-2 rounded-lg" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{entrepriseProfil.description || "Aucune description"}</p> : <textarea name="description" value={entrepriseProfil.description} onChange={handleInputChange} rows="3" className="w-full p-2 border rounded-lg" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}></textarea>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OFFRES */}
          {activeMenu === "offres" && (
            <div>
              <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Mes offres de stage</h3>
                <button onClick={() => setShowAddModal(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-emerald-600 flex items-center gap-2"><Plus size={16} /> Publier une offre</button>
              </div>
              <div className="space-y-4">
                {mesOffres && mesOffres.length > 0 ? mesOffres.map(offre => (
                  <div key={offre.id} className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">{offre.type || 'Stage'}</span>
                            {offre.dateFin && new Date(offre.dateFin) > new Date() ? 
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">Active</span> : 
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">Expirée</span>
                            }
                          </div>
                          <h4 className="font-bold text-lg" style={{ color: theme.text }}>{offre.titre}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm" style={{ color: theme.textLight }}>
                            <span className="flex items-center gap-1"><MapPin size={14} /> {offre.lieu}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {offre.duree}</span>
                            <span className="text-emerald-600 font-medium"><DollarSign size={14} /> {offre.salaire}</span>
                          </div>
                          <div className="flex gap-4 mt-2 text-xs" style={{ color: theme.textLight }}>
                            <span className="flex items-center gap-1"><Calendar size={12} /> Début: {offre.dateCreation}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> Fin: {offre.dateFin}</span>
                          </div>
                          {offre.description && <p className="text-sm mt-2 line-clamp-2" style={{ color: theme.textLight }}>{offre.description}</p>}
                          {offre.competences && offre.competences.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {offre.competences.slice(0, 3).map((s, i) => <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.cardAlt, color: theme.textLight }}>{s}</span>)}
                            </div>
                          )}
                        </div>
                        <button onClick={() => onSupprimerOffre && onSupprimerOffre(offre.id)} className="text-rose-400 hover:text-rose-600 p-2 transition"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                    <Briefcase size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                    <p style={{ color: theme.textLight }}>Aucune offre publiée</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-3 text-emerald-600 hover:text-emerald-700">Publier ma première offre →</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CANDIDATURES */}
          {activeMenu === "candidatures" && (
            <div>
              <div className="flex flex-wrap gap-4 mb-5 items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Candidatures reçues</h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textLight }} />
                    <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 border rounded-xl text-sm w-64" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                  </div>
                  <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 border rounded-xl text-sm" style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}>
                    <option value="Tous">Tous</option>
                    <option value="en_attente">En attente</option>
                    <option value="acceptee">Acceptée</option>
                    <option value="refusee">Refusée</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {candidaturesFiltrees.length > 0 ? candidaturesFiltrees.map(c => (
                  <div key={c.id} className={`rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 ${
                    c.statut === "acceptee" ? "border-emerald-400" : c.statut === "refusee" ? "border-rose-400" : "border-yellow-400"
                  }`} style={{ backgroundColor: theme.card }}>
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold" style={{ color: theme.text }}>{c.etudiantNom || "Candidat"}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            c.statut === "acceptee" ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" : 
                            c.statut === "refusee" ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300" : 
                            "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          }`}>
                            {c.statut === "acceptee" ? "Acceptée" : c.statut === "refusee" ? "Refusée" : "En attente"}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: theme.textLight }}>{c.offreTitre || "Offre"}</p>
                        <p className="text-sm flex items-center gap-1 mt-1" style={{ color: theme.textLight }}><Mail size={12} /> {c.email || "Email non renseigné"}</p>
                        <p className="text-xs mt-1" style={{ color: theme.textLight }}>Postulé le {c.date || new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleViewCV(c)} className="px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>
                          <Eye size={14} /> Voir CV
                        </button>
                        {c.statut === "en_attente" && (
                          <>
                            <button 
                              onClick={() => handleAccepterCandidat(c)} 
                              className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-600 transition flex items-center gap-1"
                            >
                              <Check size={14} /> Accepter
                            </button>
                            <button 
                              onClick={() => handleRefuserCandidat(c)} 
                              className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-rose-600 transition flex items-center gap-1"
                            >
                              <XCircle size={14} /> Refuser
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                    <Users size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                    <p style={{ color: theme.textLight }}>Aucune candidature reçue</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGIAIRES ÉVALUÉS */}
          {activeMenu === "stagiaires" && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Stagiaires évalués</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textLight }} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un stagiaire..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-9 pr-3 py-2 border rounded-xl text-sm w-64" 
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                {mesCandidatures.filter(c => c.statut === "acceptee").length > 0 ? (
                  mesCandidatures
                    .filter(c => c.statut === "acceptee")
                    .filter(c => searchTerm === "" || c.etudiantNom?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(stagiaire => {
                      const estEvalue = stagiaire.evaluation !== undefined;
                      return (
                        <div key={stagiaire.id} className="rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                          <div className="flex justify-between items-start flex-wrap gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold" style={{ color: theme.text }}>{stagiaire.etudiantNom}</h4>
                                {estEvalue ? (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                                    <Star size={12} className="inline mr-1" /> Évalué
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                                    <Clock size={12} className="inline mr-1" /> En attente
                                  </span>
                                )}
                              </div>
                              <p className="text-sm" style={{ color: theme.textLight }}>{stagiaire.offreTitre}</p>
                              <p className="text-xs flex items-center gap-1 mt-1" style={{ color: theme.textLight }}>
                                <Mail size={12} /> {stagiaire.email}
                              </p>
                              {estEvalue && stagiaire.evaluation && (
                                <div className="flex items-center gap-3 mt-2">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={14} className={i < stagiaire.evaluation.note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                                    ))}
                                  </div>
                                  <span className="text-xs font-medium text-emerald-600">
                                    Moy: {Math.round((stagiaire.evaluation.ponctualite + stagiaire.evaluation.qualiteTravail + 
                                      stagiaire.evaluation.autonomie + stagiaire.evaluation.espritEquipe) / 4)}/20
                                  </span>
                                  {stagiaire.evaluation.dateEvaluation && (
                                    <span className="text-xs text-gray-400">📅 {stagiaire.evaluation.dateEvaluation}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedStagiaire(stagiaire);
                                if (stagiaire.evaluation) {
                                  setEvaluation(stagiaire.evaluation);
                                } else {
                                  setEvaluation({
                                    ponctualite: 15,
                                    qualiteTravail: 15,
                                    autonomie: 15,
                                    espritEquipe: 15,
                                    note: 4,
                                    commentaire: "",
                                    progression: ""
                                  });
                                }
                                setShowEvaluationModal(true);
                              }} 
                              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                                estEvalue 
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              }`}
                            >
                              {estEvalue ? <Edit2 size={16} /> : <Star size={16} />}
                              {estEvalue ? "Modifier l'évaluation" : "Évaluer"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                    <Award size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                    <p style={{ color: theme.textLight }}>Aucun stagiaire accepté pour le moment</p>
                    <p className="text-sm mt-2" style={{ color: theme.textLight }}>Les stagiaires apparaîtront ici une fois leurs candidatures acceptées</p>
                  </div>
                )}
              </div>

              {/* Section des évaluations récentes */}
              {stagiairesEvalues.length > 0 && (
                <div className="mt-8 rounded-xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                    <TrendingUp size={18} className="text-emerald-500" />
                    Évaluations récentes
                  </h4>
                  <div className="space-y-3">
                    {stagiairesEvalues.slice(0, 3).map(stagiaire => (
                      <div key={stagiaire.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                        <div>
                          <p className="font-medium" style={{ color: theme.text }}>{stagiaire.etudiantNom}</p>
                          <p className="text-xs" style={{ color: theme.textLight }}>{stagiaire.offreTitre}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < stagiaire.evaluation.note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                          <p className="text-xs text-emerald-600 font-medium">
                            Note: {Math.round((stagiaire.evaluation.ponctualite + stagiaire.evaluation.qualiteTravail + 
                              stagiaire.evaluation.autonomie + stagiaire.evaluation.espritEquipe) / 4)}/20
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATISTIQUES - Version raccourcie car le code est long */}
          {activeMenu === "statistiques" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <div><p className="text-sm" style={{ color: theme.textLight }}>Total offres</p><p className="text-3xl font-bold" style={{ color: theme.text }}>{mesOffres.length}</p></div>
                </div>
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <div><p className="text-sm" style={{ color: theme.textLight }}>Offres actives</p><p className="text-3xl font-bold text-green-600">{offresActives}</p></div>
                </div>
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <div><p className="text-sm" style={{ color: theme.textLight }}>Total candidatures</p><p className="text-3xl font-bold" style={{ color: theme.text }}>{mesCandidatures.length}</p></div>
                </div>
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <div><p className="text-sm" style={{ color: theme.textLight }}>Taux d'acceptation</p><p className="text-3xl font-bold text-emerald-600">{tauxAcceptation}%</p></div>
                </div>
              </div>
            </div>
          )}
      
          {/* MOT DE PASSE */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto">
              <div className="rounded-2xl shadow-sm p-8" style={{ backgroundColor: theme.card }}>
                <div className="text-center mb-6"><div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.cardAlt }}><Key size={40} className="text-emerald-500" /></div><h3 className="text-2xl font-bold" style={{ color: theme.text }}>Changer le mot de passe</h3><p className="text-sm mt-2" style={{ color: theme.textLight }}>Sécurisez votre compte</p></div>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Ancien mot de passe</label><input type="password" name="ancienMotDePasse" value={passwordData.ancienMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Entrez votre mot de passe actuel" />{passwordErrors.ancienMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.ancienMotDePasse}</p>}</div>
                  <div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Nouveau mot de passe</label><input type="password" name="nouveauMotDePasse" value={passwordData.nouveauMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Minimum 6 caractères" />{passwordErrors.nouveauMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.nouveauMotDePasse}</p>}</div>
                  <div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Confirmer</label><input type="password" name="confirmerMotDePasse" value={passwordData.confirmerMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Retapez votre nouveau mot de passe" />{passwordErrors.confirmerMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmerMotDePasse}</p>}</div>
                  <div className="flex gap-3 pt-4"><button onClick={handleSubmitPasswordChange} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Changer</button><button onClick={() => { setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" }); setPasswordErrors({}); }} className="flex-1 py-3 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Réinitialiser</button></div>
                </div>
              </div>
            </div>
          )}

          {/* AIDE */}
          {activeMenu === "aide" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: theme.text }}><HelpCircle size={24} className="text-emerald-500" /> Centre d'aide</h3>
                <p className="text-sm mb-6" style={{ color: theme.textLight }}>Retrouvez ici toutes les informations nécessaires pour utiliser la plateforme</p>
                <div className="space-y-4">
                  <div className="border-b pb-4" style={{ borderColor: theme.border }}>
                    <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: theme.text }}><BookOpen size={16} className="text-emerald-500" /> Comment publier une offre ?</h4>
                    <p className="text-sm" style={{ color: theme.textLight }}>1. Allez dans la section "Mes offres"<br />2. Cliquez sur "Publier une offre"<br />3. Remplissez tous les champs<br />4. Cliquez sur "Publier"</p>
                  </div>
                  <div className="rounded-xl p-4 border-l-4 border-emerald-500" style={{ backgroundColor: theme.cardAlt }}>
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-2"><ExternalLink size={16} /> Support technique</h4>
                    <p className="text-sm" style={{ color: theme.textLight }}>support@stageflow.dz</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL AJOUTER OFFRE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.card }}>
            <div className="sticky top-0 border-b px-6 py-4 flex justify-between items-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}><h3 className="font-bold text-lg" style={{ color: theme.text }}>📢 Publier une offre</h3><button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} style={{ color: theme.text }} /></button></div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Titre du poste *" value={newOffre.titre} onChange={(e) => setNewOffre({...newOffre, titre: e.target.value})} className="w-full p-2 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
              <div className="grid grid-cols-2 gap-3"><input type="date" placeholder="Date début *" value={newOffre.dateCreation} onChange={(e) => setNewOffre({...newOffre, dateCreation: e.target.value})} className="p-2 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /><input type="date" placeholder="Date fin *" value={newOffre.dateFin} onChange={(e) => setNewOffre({...newOffre, dateFin: e.target.value})} className="p-2 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /></div>
              <textarea placeholder="Description détaillée *" rows="5" value={newOffre.description} onChange={(e) => setNewOffre({...newOffre, description: e.target.value})} className="w-full p-2 border rounded-xl resize-none" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}></textarea>
              <div className="flex gap-3 pt-2"><button onClick={handleAddOffre} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600">Publier</button><button onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Annuler</button></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .spinner { border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #10b981; width: 40px; height: 40px; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}