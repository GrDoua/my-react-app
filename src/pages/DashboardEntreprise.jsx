import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Briefcase, Users, BarChart3, Building, TrendingUp, Calendar,
  LogOut, Plus, Trash2, User, Key, Save, Edit2, X, CheckCircle, Clock,
  FileText, Upload, Download, FilePlus, Eye, Phone, MapPin, Mail, Search,
  Award, AlertCircle, Check, XCircle, HelpCircle,
  MessageCircle, BookOpen, ExternalLink, DollarSign, Star, Camera, Globe,
  Tag,PieChart
} from "lucide-react";
import { api } from '../api';

// Listes pour les selects
const typesStage = [
  "Stage PFE",
  "Stage d'été",
  "Stage ouvrier",
  "Stage d'initiation",
  "Stage professionnel",
  "Stage de perfectionnement"
];

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", 
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", 
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", 
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", 
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", 
  "Ghardaïa", "Relizane"
];

// ============================================
// COMPOSANT DASHBOARD ENTREPRISE
// ============================================
export function DashboardEntreprise({ 
  entreprise, 
  onLogout, 
  darkMode
}) {
  // Token pour les appels API
  const token = localStorage.getItem('token');
  
  // Theme colors basé sur darkMode
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
  const [loading, setLoading] = useState(true);
  
  // États pour modification offre
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editCompetenceInput, setEditCompetenceInput] = useState('');
  
  // Données API
  const [mesOffres, setMesOffres] = useState([]);
  const [mesCandidatures, setMesCandidatures] = useState([]);
  
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
  
  // États pour le profil
  const [isEditing, setIsEditing] = useState(false);
  const [entrepriseProfil, setEntrepriseProfil] = useState({
    nom: entreprise?.nom || "",
    email: entreprise?.email || "",
    secteur: entreprise?.secteur || "",
    description: entreprise?.description || "",
    telephone: entreprise?.telephone || "",
    adresse: entreprise?.adresse || "",
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
    titre: "", 
    lieu: "", 
    wilaya: "",
    duree: "6 mois", 
    type: "Stage PFE", 
    salaire: "", 
    description: "", 
    dateCreation: "", 
    dateFin: "", 
    niveauRequis: "Débutant",
    nombrePlaces: 1,
    horaires: "Temps plein",
    avantages: ""
  });
  const [competenceInput, setCompetenceInput] = useState("");

  // État pour le formulaire de modification
  const [editForm, setEditForm] = useState({
    titre: '',
    description: '',
    lieu: '',
    wilaya: '',
    type: 'Stage PFE',
    duree: '',
    salaire: '',
    competences: [],
    dateDebut: '',
    dateFin: '',
    niveauRequis: 'Débutant',
    nombrePlaces: 1,
    horaires: 'Temps plein',
    avantages: []
  });

  // ============================================
  // CHARGEMENT DES DONNÉES DEPUIS L'API
  // ============================================

  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);
  
  // Helper function to check token
  const checkToken = useCallback(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      showNotification('error', "Session expirée, veuillez vous reconnecter");
      setTimeout(() => onLogout(), 2000);
      return false;
    }
    return true;
  }, [onLogout, showNotification]);

  const fetchCompanyOffers = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      console.error("❌ Pas de token pour fetchCompanyOffers");
      return;
    }
    
    try {
      console.log("📡 Appel API: getCompanyOffers");
      const response = await api.getCompanyOffers(currentToken);
      const data = await response.json();
      console.log("📡 Response getCompanyOffers:", data);
      
      if (response.ok) {
        setMesOffres(data.offers || []);
      } else {
        console.error("❌ Erreur API getCompanyOffers:", data);
        if (response.status === 401) {
          showNotification('error', "Session expirée, reconnectez-vous");
          setTimeout(() => onLogout(), 2000);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement offres:', error);
      showNotification('error', "Erreur de connexion au serveur");
    }
  }, [onLogout, showNotification]);

  const fetchCompanyApplications = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      console.error("❌ Pas de token pour fetchCompanyApplications");
      setLoading(false);
      return;
    }
    
    try {
      console.log("📡 Appel API: getCompanyApplications");
      const response = await api.getCompanyApplications(currentToken);
      const data = await response.json();
      console.log("📡 Response getCompanyApplications:", data);
      
      if (response.ok) {
        setMesCandidatures(data.applications || []);
      } else {
        console.error("❌ Erreur API getCompanyApplications:", data);
        if (response.status === 401) {
          showNotification('error', "Session expirée, reconnectez-vous");
          setTimeout(() => onLogout(), 2000);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement candidatures:', error);
      showNotification('error', "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }, [onLogout, showNotification]);

  const fetchCompanyProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    
    try {
      console.log("📡 Appel API: getCompanyProfile");
      const response = await api.getCompanyProfile(currentToken);
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("✅ Profil chargé:", data.company);
        
        setEntrepriseProfil({
          nom: data.company.nom || "",
          email: data.company.email || "",
          secteur: data.company.secteur || "",
          description: data.company.description || "",
          telephone: data.company.telephone || "",
          adresse: data.company.adresse || "",
          siteWeb: data.company.siteWeb || "",
          nbEmployes: data.company.nbEmployes || ""
        });
        
        if (data.company.logoPath) {
          const logoUrl = `http://localhost:5004/uploads/companyLogos/${data.company.logoPath}`;
          setLogoPreview(logoUrl);
        } else {
          setLogoPreview(null);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
    }
  }, []);

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      console.error("❌ Aucun token trouvé!");
      showNotification('error', "Veuillez vous reconnecter");
      setTimeout(() => onLogout(), 2000);
      return;
    }
    
    console.log("✅ Token trouvé:", currentToken.substring(0, 20) + "...");
    fetchCompanyOffers();
    fetchCompanyApplications();
    fetchCompanyProfile();
  }, []);

  // ============================================
  // DONNÉES CALCULÉES
  // ============================================
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
  // FONCTIONS CRUD OFFRES
  // ============================================

  // Fonction pour publier une offre
  const handleAddOffre = useCallback(async () => {
    if (!checkToken()) return;
    
    if (!newOffre.titre || !newOffre.description || !newOffre.lieu || !newOffre.wilaya) {
      showNotification('error', "❌ Veuillez remplir tous les champs obligatoires (titre, description, lieu, wilaya)");
      return;
    }
    
    try {
      const currentToken = localStorage.getItem('token');
      const offreData = {
        titre: newOffre.titre,
        description: newOffre.description,
        lieu: newOffre.lieu,
        wilaya: newOffre.wilaya,
        type: newOffre.type,
        duree: newOffre.duree,
        salaire: newOffre.salaire || "Non spécifié",
        competences: competenceInput.split(",").map(c => c.trim()).filter(c => c),
        dateDebut: newOffre.dateCreation,
        dateFin: newOffre.dateFin,
        niveauRequis: newOffre.niveauRequis,
        nombrePlaces: parseInt(newOffre.nombrePlaces) || 1,
        horaires: newOffre.horaires,
        avantages: newOffre.avantages ? newOffre.avantages.split(",").map(a => a.trim()) : []
      };
      
      console.log("📤 Envoi des données:", offreData);
      
      const response = await api.createOffer(currentToken, offreData);
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', "✅ Offre publiée avec succès");
        setShowAddModal(false);
        setNewOffre({ 
          titre: "", lieu: "", wilaya: "", duree: "6 mois", type: "Stage PFE", 
          salaire: "", description: "", dateCreation: "", dateFin: "",
          niveauRequis: "Débutant", nombrePlaces: 1, horaires: "Temps plein", avantages: ""
        });
        setCompetenceInput("");
        fetchCompanyOffers();
      } else {
        showNotification('error', data.message || "❌ Erreur lors de la publication");
      }
    } catch (error) {
      console.error('Erreur création offre:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [newOffre, competenceInput, showNotification, checkToken, fetchCompanyOffers]);

  // Fonction pour ouvrir modal de modification
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setEditForm({
      titre: offer.titre || '',
      description: offer.description || '',
      lieu: offer.lieu || '',
      wilaya: offer.wilaya || '',
      type: offer.type || 'Stage PFE',
      duree: offer.duree || '',
      salaire: offer.salaire || '',
      competences: offer.competences || [],
      dateDebut: offer.dateDebut ? offer.dateDebut.split('T')[0] : '',
      dateFin: offer.dateFin ? offer.dateFin.split('T')[0] : '',
      niveauRequis: offer.niveauRequis || 'Débutant',
      nombrePlaces: offer.nombrePlaces || 1,
      horaires: offer.horaires || 'Temps plein',
      avantages: offer.avantages || []
    });
    setEditCompetenceInput((offer.competences || []).join(', '));
    setShowEditModal(true);
  };

  // Fonction pour sauvegarder modification
  const handleSaveEdit = useCallback(async () => {
    if (!checkToken()) return;
    
    if (!editForm.titre || !editForm.description || !editForm.lieu || !editForm.wilaya) {
      showNotification('error', "❌ Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      const currentToken = localStorage.getItem('token');
      const offreData = {
        titre: editForm.titre,
        description: editForm.description,
        lieu: editForm.lieu,
        wilaya: editForm.wilaya,
        type: editForm.type,
        duree: editForm.duree,
        salaire: editForm.salaire || "Non spécifié",
        competences: editCompetenceInput.split(",").map(c => c.trim()).filter(c => c),
        dateDebut: editForm.dateDebut,
        dateFin: editForm.dateFin,
        niveauRequis: editForm.niveauRequis,
        nombrePlaces: parseInt(editForm.nombrePlaces) || 1,
        horaires: editForm.horaires,
        avantages: editForm.avantages
      };
      
      const response = await api.updateOffer(currentToken, editingOffer.id, offreData);
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', "✅ Offre modifiée avec succès");
        setShowEditModal(false);
        setEditingOffer(null);
        fetchCompanyOffers();
      } else {
        showNotification('error', data.message || "❌ Erreur lors de la modification");
      }
    } catch (error) {
      console.error('Erreur modification:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [editForm, editCompetenceInput, editingOffer, showNotification, checkToken, fetchCompanyOffers]);

  // Supprimer une offre
  const handleSupprimerOffre = useCallback(async (offreId) => {
    if (!checkToken()) return;
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    
    try {
      const currentToken = localStorage.getItem('token');
      const response = await api.deleteOffer(currentToken, offreId);
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', "✅ Offre supprimée avec succès");
        fetchCompanyOffers();
      } else {
        showNotification('error', data.message || "❌ Erreur lors de la suppression");
      }
    } catch (error) {
      console.error('Erreur suppression offre:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification, checkToken, fetchCompanyOffers]);

  // ============================================
  // AUTRES FONCTIONS
  // ============================================

  const handleInputChange = useCallback((e) => {
    setEntrepriseProfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(async () => {
    if (!checkToken()) return;
    
    try {
      const response = await api.updateCompanyProfile(token, entrepriseProfil);
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', "✅ Profil mis à jour avec succès");
        setIsEditing(false);
        fetchCompanyProfile();
      } else {
        showNotification('error', data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [entrepriseProfil, token, showNotification, checkToken, fetchCompanyProfile]);

  const handleLogoUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showNotification('error', "❌ Veuillez sélectionner une image");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', "❌ Image trop volumineuse (max 5MB)");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('http://localhost:5004/api/companies/upload-logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', "✅ Logo mis à jour avec succès");
        await fetchCompanyProfile();
      } else {
        showNotification('error', data.message || "❌ Erreur lors de l'upload");
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification, fetchCompanyProfile]);

  const handleViewCV = useCallback((candidature) => {
    setSelectedCandidature(candidature);
    setShowCvModal(true);
  }, []);

  const handleAccepterCandidat = useCallback(async (candidature) => {
    if (!checkToken()) return;
    
    try {
      const response = await api.updateApplicationStatus(candidature.id, token, "acceptee");
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', `✅ Candidature de ${candidature.etudiantNom} acceptée !`);
        fetchCompanyApplications();
        setShowCvModal(false);
      } else {
        showNotification('error', data.message || "❌ Erreur lors de l'acceptation");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification, checkToken, fetchCompanyApplications]);

  const handleRefuserCandidat = useCallback(async (candidature) => {
    if (!checkToken()) return;
    
    try {
      const response = await api.updateApplicationStatus(candidature.id, token, "refusee");
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', `❌ Candidature de ${candidature.etudiantNom} refusée.`);
        fetchCompanyApplications();
        setShowCvModal(false);
      } else {
        showNotification('error', data.message || "❌ Erreur lors du refus");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [token, showNotification, checkToken, fetchCompanyApplications]);

  const handleSaveEvaluation = useCallback(async () => {
    if (!checkToken()) return;
    
    if (!selectedStagiaire) {
      showNotification('error', "❌ Aucun stagiaire sélectionné");
      return;
    }
    
    const studentId = selectedStagiaire.studentId || selectedStagiaire.etudiantId;
    
    if (!studentId) {
      showNotification('error', "❌ Impossible d'identifier l'étudiant");
      console.error("Student ID manquant dans:", selectedStagiaire);
      return;
    }
    
    const evaluationData = {
      studentId: studentId,
      candidatureId: selectedStagiaire.id,
      offreTitre: selectedStagiaire.offreTitre || selectedStagiaire.titre,
      entrepriseNom: entrepriseProfil.nom || "Entreprise",
      ponctualite: parseInt(evaluation.ponctualite) || 0,
      qualiteTravail: parseInt(evaluation.qualiteTravail) || 0,
      autonomie: parseInt(evaluation.autonomie) || 0,
      espritEquipe: parseInt(evaluation.espritEquipe) || 0,
      note: parseInt(evaluation.note) || 0,
      commentaire: evaluation.commentaire || "",
      progression: evaluation.progression || "moyenne",
      dateEvaluation: new Date().toISOString()
    };
    
    console.log("📤 Envoi évaluation:", evaluationData);
    
    try {
      const response = await api.saveEvaluation(token, selectedStagiaire.id, evaluationData);
      const data = await response.json();
      
      if (response.ok) {
        setMesCandidatures(prev => 
          prev.map(c => 
            c.id === selectedStagiaire.id 
              ? { ...c, evaluation: evaluationData, hasEvaluation: true, evaluatedAt: new Date().toISOString() } 
              : c
          )
        );
        
        showNotification('success', `✅ Évaluation de ${selectedStagiaire.etudiantNom} enregistrée avec succès`);
        setShowEvaluationModal(false);
        await fetchCompanyApplications();
      } else {
        showNotification('error', data.message || data.error || "❌ Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      showNotification('error', "❌ Erreur de connexion au serveur");
    }
  }, [evaluation, selectedStagiaire, entrepriseProfil.nom, token, showNotification, checkToken, fetchCompanyApplications]);

  const handlePasswordChange = useCallback((e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }, []);

  const handleSubmitPasswordChange = useCallback(async () => {
    if (!checkToken()) return;
    
    const errors = {};
    if (!passwordData.ancienMotDePasse) errors.ancienMotDePasse = "Champ requis";
    if (!passwordData.nouveauMotDePasse) errors.nouveauMotDePasse = "Champ requis";
    else if (passwordData.nouveauMotDePasse.length < 6) errors.nouveauMotDePasse = "Minimum 6 caractères";
    if (passwordData.nouveauMotDePasse !== passwordData.confirmerMotDePasse) errors.confirmerMotDePasse = "Les mots de passe ne correspondent pas";
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    try {
      const response = await api.changePassword(token, {
        ancienMotDePasse: passwordData.ancienMotDePasse,
        nouveauMotDePasse: passwordData.nouveauMotDePasse
      });
      const data = await response.json();
      
      if (response.ok) {
        showNotification('success', "✅ Mot de passe changé");
        setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
      } else {
        showNotification('error', data.message || "❌ Ancien mot de passe incorrect");
      }
    } catch (error) {
      console.error(error);
      showNotification('error', "❌ Erreur de connexion");
    }
  }, [passwordData, token, showNotification, checkToken]);

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

      {/* MODAL ÉVALUATION */}
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
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Building size={30} className="text-white" />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-white font-semibold text-base">
              {entrepriseProfil.nom || "Entreprise"}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              <p className="text-emerald-400 text-xs font-medium">
                {entrepriseProfil.secteur || "Entreprise"}
              </p>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveMenu(item.id)} 
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                ${activeMenu === item.id 
                  ? "bg-gray-800 text-white border-l-2 border-emerald-400" 
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                }
              `}
            >
              <div className={`transition-transform duration-200 group-hover:scale-105 ${activeMenu === item.id ? "text-emerald-400" : ""}`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {activeMenu === item.id && (
                <div className="ml-auto w-1 h-4 bg-emerald-400 rounded-full"></div>
              )}
            </button>
          ))}
          
          <div className="h-px bg-gray-700 my-3"></div>
          
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut size={18} className="group-hover:scale-105 transition-transform" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
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
                            <span className="flex items-center gap-1"><MapPin size={14} /> {offre.lieu} {offre.wilaya ? `(${offre.wilaya})` : ''}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {offre.duree}</span>
                            <span className="text-emerald-600 font-medium"><DollarSign size={14} /> {offre.salaire}</span>
                          </div>
                          <div className="flex gap-4 mt-2 text-xs" style={{ color: theme.textLight }}>
                            <span className="flex items-center gap-1"><Calendar size={12} /> Début: {offre.dateDebut ? new Date(offre.dateDebut).toLocaleDateString() : "Non spécifiée"}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> Fin: {offre.dateFin ? new Date(offre.dateFin).toLocaleDateString() : "Non spécifiée"}</span>
                          </div>
                          {offre.description && <p className="text-sm mt-2 line-clamp-2" style={{ color: theme.textLight }}>{offre.description}</p>}
                          {offre.competences && offre.competences.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {offre.competences.slice(0, 3).map((s, i) => <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.cardAlt, color: theme.textLight }}>{s}</span>)}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditOffer(offre)} className="text-blue-400 hover:text-blue-600 p-2 transition">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleSupprimerOffre(offre.id)} className="text-rose-400 hover:text-rose-600 p-2 transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
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
                        <p className="text-xs mt-1" style={{ color: theme.textLight }}>Postulé le {c.date ? new Date(c.date).toLocaleDateString() : new Date().toLocaleDateString()}</p>
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
                                    <span className="text-xs text-gray-400">📅 {new Date(stagiaire.evaluation.dateEvaluation).toLocaleDateString()}</span>
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

          {/* STATISTIQUES */}
          {activeMenu === "statistiques" && (
            <div className="space-y-6">
              {/* Cartes KPI principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total offres</p>
                  <p className="text-3xl font-bold" style={{ color: theme.text }}>{mesOffres.length}</p>
                  <p className="text-xs text-emerald-500 mt-2">+{offresActives} actives</p>
                </div>
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-blue-400" style={{ backgroundColor: theme.card }}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total candidatures</p>
                  <p className="text-3xl font-bold" style={{ color: theme.text }}>{mesCandidatures.length}</p>
                  <p className="text-xs text-blue-500 mt-2">{candidaturesEnAttente} en attente</p>
                </div>
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Taux d'acceptation</p>
                  <p className="text-3xl font-bold text-emerald-600">{tauxAcceptation}%</p>
                  <p className="text-xs text-gray-500 mt-2">{candidaturesAcceptees} acceptés</p>
                </div>
                <div className="rounded-xl p-5 shadow-sm border-l-4 border-purple-400" style={{ backgroundColor: theme.card }}>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Délai réponse moyen</p>
                  <p className="text-3xl font-bold text-purple-600">3.5j</p>
                  <p className="text-xs text-gray-500 mt-2">Temps de traitement</p>
                </div>
              </div>

              {/* Évolution des candidatures */}
              <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                  <TrendingUp size={18} className="text-emerald-500" />
                  Évolution des candidatures
                </h3>
                <div className="space-y-4">
                  {(() => {
                    const moisMap = new Map();
                    const moisCourts = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
                    
                    mesCandidatures.forEach(c => {
                      const dateValue = c.createdAt || c.date;
                      if (!dateValue) return;
                      
                      const date = new Date(dateValue);
                      if (isNaN(date.getTime())) return;
                      
                      const key = `${moisCourts[date.getMonth()]} ${date.getFullYear()}`;
                      if (!moisMap.has(key)) {
                        moisMap.set(key, { mois: key, total: 0, acceptees: 0 });
                      }
                      const data = moisMap.get(key);
                      data.total++;
                      if (c.statut === 'acceptee') data.acceptees++;
                    });
                    
                    const data = Array.from(moisMap.values()).slice(-6);
                    const maxTotal = Math.max(...data.map(d => d.total), 1);
                    
                    return data.length > 0 ? data.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium" style={{ color: theme.text }}>{item.mois}</span>
                          <div className="flex gap-3">
                            <span className="text-xs text-emerald-600">{item.acceptees} acceptés</span>
                            <span className="text-xs text-gray-500">{item.total} total</span>
                          </div>
                        </div>
                        <div className="flex gap-1 h-8">
                          <div 
                            className="bg-emerald-500 rounded-l-lg flex items-center justify-end px-2 text-white text-xs font-semibold"
                            style={{ width: `${(item.total / maxTotal) * 100}%` }}
                          >
                            {item.total}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        Aucune candidature trouvée
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Top offres */}
              <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                  <Award size={18} className="text-yellow-500" />
                  Top offres les plus demandées
                </h3>
                <div className="space-y-3">
                  {mesOffres.length > 0 ? (
                    mesOffres.slice(0, 5).map((offre, index) => {
                      const candidaturesCount = mesCandidatures.filter(c => c.offerId === offre.id).length;
                      return (
                        <div key={offre.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                            <div>
                              <p className="font-medium" style={{ color: theme.text }}>{offre.titre}</p>
                              <p className="text-xs" style={{ color: theme.textLight }}>{offre.type || 'Stage'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">{candidaturesCount}</p>
                            <p className="text-xs text-gray-500">candidatures</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucune offre publiée
                    </div>
                  )}
                </div>
              </div>

              {/* Répartition par statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                    <PieChart size={18} className="text-emerald-500" />
                    Répartition des candidatures
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: theme.textLight }}>Acceptés</span>
                        <span className="text-sm font-semibold text-emerald-600">{candidaturesAcceptees}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${mesCandidatures.length > 0 ? (candidaturesAcceptees / mesCandidatures.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: theme.textLight }}>Refusés</span>
                        <span className="text-sm font-semibold text-rose-600">{candidaturesRefusees}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${mesCandidatures.length > 0 ? (candidaturesRefusees / mesCandidatures.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: theme.textLight }}>En attente</span>
                        <span className="text-sm font-semibold text-yellow-600">{candidaturesEnAttente}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${mesCandidatures.length > 0 ? (candidaturesEnAttente / mesCandidatures.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: theme.card }}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                    <BarChart3 size={18} className="text-emerald-500" />
                    Performance globale
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: theme.textLight }}>Taux de conversion</span>
                        <span className="text-sm font-semibold text-emerald-600">{tauxAcceptation}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${tauxAcceptation}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: theme.textLight }}>Taux de réponse</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {mesCandidatures.length > 0 ? Math.round(((candidaturesAcceptees + candidaturesRefusees) / mesCandidatures.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${mesCandidatures.length > 0 ? ((candidaturesAcceptees + candidaturesRefusees) / mesCandidatures.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: theme.textLight }}>Offres pourvues</span>
                        <span className="text-sm font-semibold text-purple-600">
                          {mesOffres.filter(o => mesCandidatures.some(c => c.offerId === o.id && c.statut === 'acceptee')).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${mesOffres.length > 0 ? (mesOffres.filter(o => mesCandidatures.some(c => c.offerId === o.id && c.statut === 'acceptee')).length / mesOffres.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
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
                    <p className="text-sm" style={{ color: theme.textLight }}>support@stag.io</p>
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
            <div className="sticky top-0 border-b px-6 py-4 flex justify-between items-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h3 className="font-bold text-lg" style={{ color: theme.text }}>📢 Publier une nouvelle offre</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Titre du poste <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Développeur Full Stack, Designer UI/UX, ..." 
                  value={newOffre.titre} 
                  onChange={(e) => setNewOffre({...newOffre, titre: e.target.value})} 
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              {/* Lieu + Wilaya */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Lieu précis <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Hydra, Sidi Yahia, ..." 
                    value={newOffre.lieu} 
                    onChange={(e) => setNewOffre({...newOffre, lieu: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Wilaya <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={newOffre.wilaya} 
                    onChange={(e) => setNewOffre({...newOffre, wilaya: e.target.value})}
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  >
                    <option value="">Sélectionner une wilaya</option>
                    {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              
              {/* Durée + Salaire */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Durée <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: 3 mois, 6 mois" 
                    value={newOffre.duree} 
                    onChange={(e) => setNewOffre({...newOffre, duree: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Salaire <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: 30 000 DA, Négociable" 
                    value={newOffre.salaire} 
                    onChange={(e) => setNewOffre({...newOffre, salaire: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
              </div>
              
              {/* Type de stage */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Type de stage <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newOffre.type} 
                  onChange={(e) => setNewOffre({...newOffre, type: e.target.value})}
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                >
                  {typesStage.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Date de début <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={newOffre.dateCreation} 
                    onChange={(e) => setNewOffre({...newOffre, dateCreation: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Date de fin <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={newOffre.dateFin} 
                    onChange={(e) => setNewOffre({...newOffre, dateFin: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
              </div>
              
              {/* Compétences */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Compétences requises <span className="text-gray-400 text-xs">(optionnel - séparées par des virgules)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: React, Node.js, Python, ..." 
                  value={competenceInput} 
                  onChange={(e) => setCompetenceInput(e.target.value)} 
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              {/* Niveau requis + Nombre places */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Niveau requis
                  </label>
                  <select 
                    value={newOffre.niveauRequis} 
                    onChange={(e) => setNewOffre({...newOffre, niveauRequis: e.target.value})}
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Nombre de places
                  </label>
                  <input 
                    type="number" 
                    value={newOffre.nombrePlaces} 
                    onChange={(e) => setNewOffre({...newOffre, nombrePlaces: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
              </div>
              
              {/* Horaires */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Horaires
                </label>
                <select 
                  value={newOffre.horaires} 
                  onChange={(e) => setNewOffre({...newOffre, horaires: e.target.value})}
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                >
                  <option value="Temps plein">Temps plein</option>
                  <option value="Mi-temps">Mi-temps</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Description détaillée <span className="text-red-500">*</span>
                </label>
                <textarea 
                  placeholder="Décrivez les missions, l'environnement de travail, les avantages..." 
                  rows="5" 
                  value={newOffre.description} 
                  onChange={(e) => setNewOffre({...newOffre, description: e.target.value})} 
                  className="w-full p-2 border rounded-xl resize-none"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              {/* Avantages */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Avantages <span className="text-gray-400 text-xs">(optionnel - séparés par des virgules)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Tickets restaurant, Transport, Télétravail, ..." 
                  value={newOffre.avantages} 
                  onChange={(e) => setNewOffre({...newOffre, avantages: e.target.value})} 
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: theme.border }}>
                <button 
                  onClick={handleAddOffre} 
                  className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-all"
                >
                  Publier l'offre
                </button>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: theme.cardAlt, color: theme.text }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER OFFRE */}
      {showEditModal && editingOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.card }}>
            <div className="sticky top-0 border-b px-6 py-4 flex justify-between items-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h3 className="font-bold text-lg" style={{ color: theme.text }}>✏️ Modifier l'offre</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Titre du poste <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={editForm.titre} 
                  onChange={(e) => setEditForm({...editForm, titre: e.target.value})} 
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              {/* Lieu + Wilaya */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Lieu précis <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={editForm.lieu} 
                    onChange={(e) => setEditForm({...editForm, lieu: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Wilaya <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={editForm.wilaya} 
                    onChange={(e) => setEditForm({...editForm, wilaya: e.target.value})}
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  >
                    <option value="">Sélectionner une wilaya</option>
                    {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              
              {/* Durée + Salaire */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Durée <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={editForm.duree} 
                    onChange={(e) => setEditForm({...editForm, duree: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Salaire <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={editForm.salaire} 
                    onChange={(e) => setEditForm({...editForm, salaire: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
              </div>
              
              {/* Type de stage */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Type de stage <span className="text-red-500">*</span>
                </label>
                <select 
                  value={editForm.type} 
                  onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                >
                  {typesStage.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Date de début <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={editForm.dateDebut} 
                    onChange={(e) => setEditForm({...editForm, dateDebut: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Date de fin <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={editForm.dateFin} 
                    onChange={(e) => setEditForm({...editForm, dateFin: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
              </div>
              
              {/* Compétences */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Compétences requises <span className="text-gray-400 text-xs">(optionnel - séparées par des virgules)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: React, Node.js, Python, ..." 
                  value={editCompetenceInput} 
                  onChange={(e) => setEditCompetenceInput(e.target.value)} 
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              {/* Niveau requis + Nombre places */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Niveau requis
                  </label>
                  <select 
                    value={editForm.niveauRequis} 
                    onChange={(e) => setEditForm({...editForm, niveauRequis: e.target.value})}
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                    Nombre de places
                  </label>
                  <input 
                    type="number" 
                    value={editForm.nombrePlaces} 
                    onChange={(e) => setEditForm({...editForm, nombrePlaces: e.target.value})} 
                    className="w-full p-2 border rounded-xl"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                  />
                </div>
              </div>
              
              {/* Horaires */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Horaires
                </label>
                <select 
                  value={editForm.horaires} 
                  onChange={(e) => setEditForm({...editForm, horaires: e.target.value})}
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                >
                  <option value="Temps plein">Temps plein</option>
                  <option value="Mi-temps">Mi-temps</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Description détaillée <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows="5" 
                  value={editForm.description} 
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})} 
                  className="w-full p-2 border rounded-xl resize-none"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              {/* Avantages */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Avantages <span className="text-gray-400 text-xs">(optionnel - séparés par des virgules)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Tickets restaurant, Transport, Télétravail, ..." 
                  value={editForm.avantages.join(', ')} 
                  onChange={(e) => setEditForm({...editForm, avantages: e.target.value.split(',').map(a => a.trim())})} 
                  className="w-full p-2 border rounded-xl"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} 
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: theme.border }}>
                <button 
                  onClick={handleSaveEdit} 
                  className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-all"
                >
                  Enregistrer les modifications
                </button>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: theme.cardAlt, color: theme.text }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .spinner { border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #10b981; width: 40px; height: 40px; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}