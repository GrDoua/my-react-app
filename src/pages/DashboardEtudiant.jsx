import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  User, Briefcase, Send, Calendar, Heart, Star, Settings, FileText,
  TrendingUp, LogOut, MapPin, Clock, DollarSign, Upload, Camera, Save,
  X, CheckCircle, AlertCircle, Key, Download, FilePlus, Edit, Building2, Search,
  Trash2, Eye, ChevronDown, ChevronRight, Globe, Phone, Mail, MapPin as MapPinIcon,
  Filter, SlidersHorizontal, Moon, Sun
} from "lucide-react";

// ============================================
// DONNÉES DE TEST (remplace par ton import si besoin)
// ============================================
const offersData = [
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
    entreprise: "Consulting Group",
    lieu: "Constantine",
    type: "Alternance",
    duree: "12 mois",
    salaire: "35 000 DA",
    description: "Analyse de données, création de dashboards et reporting.",
    competences: ["Python", "SQL", "Power BI", "Excel"]
  },
  {
    id: 4,
    titre: "Designer UI/UX",
    entreprise: "Creative Studio",
    lieu: "Alger",
    type: "Stage",
    duree: "4 mois",
    salaire: "20 000 DA",
    description: "Design d'interfaces utilisateur et expérience utilisateur.",
    competences: ["Figma", "Adobe XD", "Photoshop", "UI/UX"]
  },
  {
    id: 5,
    titre: "DevOps Engineer",
    entreprise: "Cloud Solutions",
    lieu: "Oran",
    type: "Stage PFE",
    duree: "6 mois",
    salaire: "30 000 DA",
    description: "Mise en place de pipelines CI/CD et infrastructure cloud.",
    competences: ["Docker", "Kubernetes", "Jenkins", "AWS"]
  }
];

const TYPES_OPTIONS = ['Stage', 'Stage PFE', 'Alternance'];
const VILLES_OPTIONS = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Tizi Ouzou', 'Béjaïa'];
const DUREE_OPTIONS = [
  { value: 'court', label: '< 3 mois' },
  { value: 'moyen', label: '3 à 6 mois' },
  { value: 'long', label: '> 6 mois' }
];

// ============================================
// COMPOSANT DES FILTRES RADHOUM (SIDE LIST)
// ============================================
function RadhoumFilters({ filters, setFilters, activeFiltersCount, onReset, darkMode, theme }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`rounded-2xl shadow-sm border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 h-full overflow-y-auto sticky top-6`}
      style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      {/* En-tête */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-emerald-500" />
            <h3 className="font-semibold" style={{ color: theme.text }}>Filtres avancés</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{activeFiltersCount}</span>
            )}
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ color: theme.textLight }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-5">
          {/* Recherche */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textLight }}>🔍 Recherche</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textLight }} />
              <input
                type="text"
                placeholder="Titre, entreprise..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 transition-all"
                style={{ 
                  backgroundColor: theme.inputBg, 
                  color: theme.text,
                  borderColor: theme.border
                }}
              />
            </div>
          </div>

          {/* Type de stage */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textLight }}>📌 Type</label>
            <div className="space-y-1.5">
              {TYPES_OPTIONS.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={() => {
                      setFilters(prev => ({
                        ...prev,
                        types: prev.types.includes(type) ? prev.types.filter(t => t !== type) : [...prev.types, type]
                      }));
                    }}
                    className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm" style={{ color: theme.text }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Localisation */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textLight }}>📍 Localisation</label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {VILLES_OPTIONS.map(ville => (
                <label key={ville} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.villes.includes(ville)}
                    onChange={() => {
                      setFilters(prev => ({
                        ...prev,
                        villes: prev.villes.includes(ville) ? prev.villes.filter(v => v !== ville) : [...prev.villes, ville]
                      }));
                    }}
                    className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm" style={{ color: theme.text }}>{ville}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rémunération */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textLight }}>💰 Rémunération</label>
            <div className="flex gap-2">
              {[
                { value: null, label: 'Tous' },
                { value: true, label: 'Rémunéré' },
                { value: false, label: 'Non rémunéré' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setFilters(prev => ({ ...prev, remunere: opt.value }))}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.remunere === opt.value 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textLight }}>⏱️ Durée</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilters(prev => ({ ...prev, duree: '' }))}
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  filters.duree === '' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Toutes
              </button>
              {DUREE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilters(prev => ({ ...prev, duree: opt.value }))}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    filters.duree === opt.value ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compétences */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.textLight }}>⚙️ Compétences</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {filters.competences.map((comp, idx) => (
                <span key={idx} className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                  {comp}
                  <button onClick={() => setFilters(prev => ({ ...prev, competences: prev.competences.filter(c => c !== comp) }))} className="hover:text-emerald-900 dark:hover:text-emerald-100">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ajouter une compétence..."
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400"
              style={{ 
                backgroundColor: theme.inputBg, 
                color: theme.text,
                borderColor: theme.border
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setFilters(prev => ({ ...prev, competences: [...prev.competences, e.target.value.trim()] }));
                  e.target.value = '';
                }
              }}
            />
            <p className="text-xs mt-1" style={{ color: theme.textLight }}>Entrée pour ajouter</p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t space-y-2" style={{ borderColor: theme.border }}>
            <button
              onClick={onReset}
              className="w-full py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.cardAlt, color: theme.textLight }}
            >
              <Trash2 size={14} /> Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Version collapsée - icônes seulement */}
      {isCollapsed && (
        <div className="p-3 space-y-4">
          <div className="flex justify-center"><Search size={18} style={{ color: theme.textLight }} /></div>
          <div className="flex justify-center"><Filter size={18} style={{ color: theme.textLight }} /></div>
          <div className="flex justify-center"><MapPin size={18} style={{ color: theme.textLight }} /></div>
          <div className="flex justify-center"><DollarSign size={18} style={{ color: theme.textLight }} /></div>
          <div className="flex justify-center"><Clock size={18} style={{ color: theme.textLight }} /></div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPOSANT PRINCIPAL DASHBOARD ETUDIANT
// ============================================
export function DashboardEtudiant({ etudiant, offres, candidatures, onPostuler, onLogout, onUpdateProfil, onChangePassword }) {
  
  // ============================================
  // DARK MODE STATE
  // ============================================
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // Save to localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Theme colors
  const theme = {
    bg: darkMode ? '#111827' : '#f3f4f6',
    text: darkMode ? '#f3f4f6' : '#1f2937',
    textLight: darkMode ? '#9ca3af' : '#4b5563',
    card: darkMode ? '#1f2937' : '#ffffff',
    cardAlt: darkMode ? '#374151' : '#f9fafb',
    sidebar: darkMode ? '#111827' : '#111827',
    footer: darkMode ? '#000000' : '#111827',
    border: darkMode ? '#374151' : '#e5e7eb',
    inputBg: darkMode ? '#374151' : '#ffffff',
    inputBorder: darkMode ? '#4b5563' : '#d1d5db',
  };

  // ============================================
  // 1. TOUS LES useState (en premier)
  // ============================================
  const [activeMenu, setActiveMenu] = useState("offres");
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    villes: [],
    remunere: null,
    duree: '',
    competences: []
  });
  const [favoris, setFavoris] = useState({});
  const [showCvModal, setShowCvModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // États pour le profil
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(etudiant?.profilePhoto || null);
  const [formData, setFormData] = useState({
    nom: etudiant?.nom || "", prenom: etudiant?.prenom || "", email: etudiant?.email || "",
    matricule: etudiant?.matricule || "", filiere: etudiant?.filiere || "",
    universite: etudiant?.universite || "", niveau: etudiant?.niveau || "",
    competences: etudiant?.competences?.join(", ") || "", telephone: etudiant?.telephone || "",
    adresse: etudiant?.adresse || "", bio: etudiant?.bio || ""
  });
  
  // États pour le CV
  const [uploadedCv, setUploadedCv] = useState(null);
  const [cvName, setCvName] = useState(etudiant?.cvName || "");
  const [isCvEditing, setIsCvEditing] = useState(false);
  const [customCvExtra, setCustomCvExtra] = useState({
    experience: "", formation: "", langues: "", centresInteret: ""
  });

  // États pour le mot de passe
  const [passwordData, setPasswordData] = useState({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
  const [passwordErrors, setPasswordErrors] = useState({});

  // ============================================
  // 2. FONCTION getCurrentCv (déclarée avant d'être utilisée)
  // ============================================
  const getCurrentCv = useCallback(() => {
    return {
      nom: formData.nom || etudiant?.nom || "",
      prenom: formData.prenom || etudiant?.prenom || "",
      email: formData.email || etudiant?.email || "",
      telephone: formData.telephone || etudiant?.telephone || "",
      adresse: formData.adresse || etudiant?.adresse || "",
      competences: (formData.competences || etudiant?.competences?.join(", ") || "").split(",").map(c => c.trim()).filter(c => c),
      universite: formData.universite || etudiant?.universite || "",
      filiere: formData.filiere || etudiant?.filiere || "",
      niveau: formData.niveau || etudiant?.niveau || "",
      experience: customCvExtra.experience,
      formation: customCvExtra.formation,
      langues: customCvExtra.langues,
      centresInteret: customCvExtra.centresInteret
    };
  }, [formData, etudiant, customCvExtra]);

  // ============================================
  // 3. showNotification (utilisée par beaucoup)
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ============================================
  // 4. FILTRAGE DES OFFRES
  // ============================================
  const offresFiltrees = useMemo(() => {
    if (!offersData) return [];

    return offersData.filter(offre => {
      // Filtre recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchSearch = 
          offre.titre?.toLowerCase().includes(searchLower) ||
          offre.entreprise?.toLowerCase().includes(searchLower) ||
          offre.description?.toLowerCase().includes(searchLower) ||
          offre.competences?.some(c => c.toLowerCase().includes(searchLower));
        if (!matchSearch) return false;
      }

      // Filtre types
      if (filters.types.length > 0) {
        if (!filters.types.includes(offre.type)) return false;
      }

      // Filtre villes
      if (filters.villes.length > 0) {
        if (!filters.villes.includes(offre.lieu)) return false;
      }

      // Filtre rémunération
      if (filters.remunere !== null) {
        const isRemunere = offre.salaire !== 'Non rémunéré';
        if (isRemunere !== filters.remunere) return false;
      }

      // Filtre durée
      if (filters.duree) {
        const dureeValue = parseInt(offre.duree);
        if (filters.duree === 'court' && (isNaN(dureeValue) || dureeValue > 3)) return false;
        if (filters.duree === 'moyen' && (isNaN(dureeValue) || dureeValue < 3 || dureeValue > 6)) return false;
        if (filters.duree === 'long' && (isNaN(dureeValue) || dureeValue <= 6)) return false;
      }

      // Filtre compétences
      if (filters.competences.length > 0) {
        const offreCompetences = offre.competences?.map(c => c.toLowerCase()) || [];
        const hasMatch = filters.competences.some(comp =>
          offreCompetences.some(oc => oc.includes(comp.toLowerCase()))
        );
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [filters]);

  // ============================================
  // 5. AUTRES useMemo
  // ============================================
  const mesCandidatures = useMemo(() => candidatures?.filter(c => c.etudiantId === etudiant?.id) || [], [candidatures, etudiant?.id]);
  const offresFavoris = useMemo(() => offersData?.filter(o => favoris[o.id]) || [], [favoris]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.types.length) count++;
    if (filters.villes.length) count++;
    if (filters.remunere !== null) count++;
    if (filters.duree) count++;
    if (filters.competences.length) count++;
    return count;
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '', types: [], villes: [], remunere: null, duree: '', competences: []
    });
    showNotification('success', "✅ Tous les filtres ont été réinitialisés");
  }, [showNotification]);

  // ============================================
  // 6. GESTION DES FAVORIS
  // ============================================
  const toggleFavori = useCallback((offreId) => {
    setFavoris(prev => ({ ...prev, [offreId]: !prev[offreId] }));
    showNotification('success', !favoris[offreId] ? "❤️ Ajouté aux favoris" : "💔 Retiré des favoris");
  }, [favoris, showNotification]);

  // ============================================
  // 7. GESTION DE LA CANDIDATURE
  // ============================================
  const handlePostuler = useCallback((offre) => {
    setSelectedOffre(offre);
    setShowCvModal(true);
  }, []);

  const handleConfirmPostuler = useCallback(() => {
    if (!uploadedCv && (!getCurrentCv().nom || !getCurrentCv().competences.length)) {
      showNotification('error', "❌ Veuillez compléter votre profil ou télécharger un CV");
      return;
    }
    
    const cvToSend = uploadedCv || { type: 'generated', data: getCurrentCv() };
    if (onPostuler) {
      onPostuler(selectedOffre, cvToSend);
    }
    setShowCvModal(false);
    setSelectedOffre(null);
    showNotification('success', `✅ Candidature envoyée pour ${selectedOffre?.titre}`);
  }, [uploadedCv, getCurrentCv, onPostuler, selectedOffre, showNotification]);

  // ============================================
  // 8. GESTION DU CV
  // ============================================
  const handleCVUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', "❌ Format non supporté (PDF, DOC, DOCX, TXT)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', "❌ Fichier trop volumineux (max 10MB)");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedCv({ name: file.name, content: event.target.result, type: file.type, dateCreation: new Date().toLocaleDateString('fr-FR') });
      setCvName(file.name);
      showNotification('success', `✅ CV "${file.name}" téléchargé`);
    };
    reader.readAsDataURL(file);
  }, [showNotification]);

  const handleGenerateCVFromProfile = useCallback(() => {
    showNotification('success', "✅ CV généré à partir de vos informations personnelles");
    setIsCvEditing(false);
  }, [showNotification]);

  const handleDownloadCV = useCallback(() => {
    const cv = getCurrentCv();
    
    let cvContent = "=".repeat(50) + "\n";
    cvContent += "                 CURRICULUM VITAE\n";
    cvContent += "=".repeat(50) + "\n\n";
    cvContent += "INFORMATIONS PERSONNELLES\n";
    cvContent += "-".repeat(50) + "\n";
    cvContent += `Nom complet : ${cv.nom} ${cv.prenom}\n`;
    cvContent += `Email : ${cv.email}\n`;
    cvContent += `Téléphone : ${cv.telephone || 'Non renseigné'}\n`;
    cvContent += `Adresse : ${cv.adresse || 'Non renseignée'}\n\n`;
    cvContent += "FORMATION ACADÉMIQUE\n";
    cvContent += "-".repeat(50) + "\n";
    cvContent += `Université : ${cv.universite || 'Non renseignée'}\n`;
    cvContent += `Filière : ${cv.filiere || 'Non renseignée'}\n`;
    cvContent += `Niveau : ${cv.niveau || 'Non renseigné'}\n\n`;
    cvContent += "COMPÉTENCES\n";
    cvContent += "-".repeat(50) + "\n";
    cvContent += cv.competences.join(", ") || 'Non renseignées\n';
    cvContent += "\n";
    if (cv.experience) { cvContent += "EXPÉRIENCE PROFESSIONNELLE\n" + "-".repeat(50) + `\n${cv.experience}\n\n`; }
    if (cv.formation) { cvContent += "FORMATION COMPLÉMENTAIRE\n" + "-".repeat(50) + `\n${cv.formation}\n\n`; }
    if (cv.langues) { cvContent += "LANGUES\n" + "-".repeat(50) + `\n${cv.langues}\n\n`; }
    if (cv.centresInteret) { cvContent += "CENTRES D'INTÉRÊT\n" + "-".repeat(50) + `\n${cv.centresInteret}\n\n`; }
    cvContent += "=".repeat(50) + "\n";
    cvContent += `Date de création : ${new Date().toLocaleDateString('fr-FR')}\n`;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${cv.nom}_${cv.prenom}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', "✅ CV téléchargé");
  }, [getCurrentCv, showNotification]);

  const handleCvExtraChange = useCallback((e) => {
    setCustomCvExtra(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // ============================================
  // 9. GESTION DU PROFIL
  // ============================================
  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(() => {
    const updatedEtudiant = {
      ...etudiant, ...formData,
      competences: formData.competences.split(",").map(c => c.trim()).filter(c => c),
      profilePhoto: photoPreview, cvName: cvName
    };
    if (onUpdateProfil) {
      onUpdateProfil(updatedEtudiant);
    }
    setIsEditing(false);
    showNotification('success', "✅ Profil mis à jour");
  }, [etudiant, formData, photoPreview, cvName, onUpdateProfil, showNotification]);

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      showNotification('success', "✅ Photo mise à jour");
    } else {
      showNotification('error', "❌ Image invalide ou trop volumineuse (max 5MB)");
    }
  }, [showNotification]);

  // ============================================
  // 10. GESTION DU MOT DE PASSE
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
    
    if (passwordData.ancienMotDePasse !== etudiant?.password) {
      showNotification('error', "❌ Ancien mot de passe incorrect");
      return;
    }
    
    if (onChangePassword) {
      onChangePassword(etudiant?.id, passwordData.nouveauMotDePasse);
    }
    setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
    showNotification('success', "✅ Mot de passe changé");
  }, [passwordData, etudiant, onChangePassword, showNotification]);

  // ============================================
  // 11. MENU ITEMS
  // ============================================
  const menuItems = [
    { id: "profil", label: "Mon profil", icon: <User size={18} /> },
    { id: "offres", label: "Liste des offres", icon: <Briefcase size={18} /> },
    { id: "mesCandidatures", label: "Mes candidatures", icon: <Send size={18} /> },
    { id: "mesStages", label: "Mes stages", icon: <Calendar size={18} /> },
    { id: "favoris", label: "Mes favoris", icon: <Heart size={18} /> },
    { id: "evaluations", label: "Mes évaluations", icon: <Star size={18} /> },
    { id: "changePassword", label: "Changer mot de passe", icon: <Key size={18} /> },
    { id: "aide", label: "Conditions & Aide", icon: <FileText size={18} /> },
  ];

  const getMenuTitle = (id) => {
    const titles = { profil: 'Mon Profil', offres: 'Offres de Stage', mesCandidatures: 'Mes Candidatures', mesStages: 'Mes Stages', favoris: 'Mes Favoris', evaluations: 'Mes Évaluations', changePassword: 'Changer le Mot de Passe', aide: 'Centre d\'Aide' };
    return titles[id] || 'Dashboard';
  };

  // ============================================
  // 12. VÉRIFICATION QUE ETUDIANT EXISTE
  // ============================================
  if (!etudiant) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.bg }}>
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4" style={{ color: theme.text }}>Chargement...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // 13. RENDU PRINCIPAL
  // ============================================
  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {/* Dark mode toggle button */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: darkMode ? '#374151' : '#e5e7eb' }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-700" />}
        </button>
      </div>

      {/* NOTIFICATION */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* MODAL CV POUR POSTULATION */}
      {showCvModal && selectedOffre && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: theme.card }}>
            <div className="sticky top-0 border-b px-6 py-4 flex justify-between items-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h3 className="text-xl font-bold" style={{ color: theme.text }}>Postuler pour : {selectedOffre.titre}</h3>
              <button onClick={() => setShowCvModal(false)} className="p-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} style={{ color: theme.text }} /></button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                <p className="text-sm leading-relaxed" style={{ color: theme.text }}>{selectedOffre.description || "Aucune description disponible"}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">{selectedOffre.type}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">{selectedOffre.lieu}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-xl p-5 text-center hover:border-emerald-400 transition" style={{ borderColor: theme.border }}>
                  <Upload size={40} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                  <p className="text-sm mb-2" style={{ color: theme.text }}>Télécharger un CV existant</p>
                  <label className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 inline-flex items-center gap-2 text-sm">
                    <Upload size={16} /> Choisir un fichier
                    <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleCVUpload} />
                  </label>
                  {uploadedCv && <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-sm flex items-center justify-between"><span>📄 {uploadedCv.name}</span><CheckCircle size={16} className="text-emerald-500" /></div>}
                </div>
                
                <div className="text-center text-sm" style={{ color: theme.textLight }}>OU</div>
                
                <div className="rounded-xl p-5" style={{ backgroundColor: theme.cardAlt }}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}><FileText size={18} className="text-emerald-500" /> Utiliser mon CV du profil</h4>
                  <div className="rounded-lg p-3 mb-3 text-sm" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
                    <p className="font-medium" style={{ color: theme.text }}>{getCurrentCv().nom} {getCurrentCv().prenom}</p>
                    <p className="text-xs" style={{ color: theme.textLight }}>{getCurrentCv().email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getCurrentCv().competences.slice(0, 3).map((s, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.cardAlt, color: theme.textLight }}>{s}</span>)}
                      {getCurrentCv().competences.length > 3 && <span className="text-xs" style={{ color: theme.textLight }}>+{getCurrentCv().competences.length - 3}</span>}
                    </div>
                  </div>
                  <button onClick={handleGenerateCVFromProfile} className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm hover:bg-emerald-600 flex items-center justify-center gap-2">
                    <FilePlus size={14} /> Utiliser ce CV
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t p-6 flex gap-3" style={{ borderColor: theme.border }}>
              <button onClick={handleConfirmPostuler} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600">Confirmer la candidature</button>
              <button onClick={() => setShowCvModal(false)} className="flex-1 py-2 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 flex-shrink-0" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-6 border-b" style={{ borderColor: '#374151' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center"><TrendingUp size={20} className="text-white" /></div>
            <div><h1 className="text-xl font-bold text-white">Stag.io</h1><p className="text-emerald-400 text-xs">Plateforme de stages</p></div>
          </div>
          <div className="mt-4 pt-3 border-t" style={{ borderColor: '#374151' }}>
            <p className="text-sm font-medium text-white">{formData.nom || etudiant.nom} {formData.prenom || etudiant.prenom}</p>
            <p className="text-emerald-400 text-xs">{formData.filiere || etudiant.filiere}</p>
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
            {photoPreview ? <img src={photoPreview} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400" /> : <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.cardAlt }}><User size={18} style={{ color: theme.textLight }} /></div>}
            <span className="font-medium" style={{ color: theme.text }}>{formData.nom || etudiant.nom} {formData.prenom || etudiant.prenom}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ==================== MON PROFIL ==================== */}
          {activeMenu === "profil" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: theme.card }}>
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                      {photoPreview ? <img src={photoPreview} alt="Photo" className="w-24 h-24 rounded-full border-4 border-white object-cover" /> : <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-600 flex items-center justify-center"><User size={40} className="text-gray-400" /></div>}
                      <label className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full cursor-pointer hover:bg-emerald-600"><Camera size={14} className="text-white" /><input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} /></label>
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div><h3 className="text-2xl font-bold" style={{ color: theme.text }}>{formData.nom || etudiant.nom} {formData.prenom || etudiant.prenom}</h3><p style={{ color: theme.textLight }}>{formData.email || etudiant.email}</p><p className="text-sm" style={{ color: theme.textLight }}>Matricule: {formData.matricule || etudiant.matricule || "Non renseigné"}</p></div>
                    {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 flex items-center gap-2"><Settings size={16} /> Modifier</button> : <div className="flex gap-2"><button onClick={handleSaveProfil} className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Enregistrer</button><button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2"><X size={16} /> Annuler</button></div>}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}>
                <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: theme.text }}><User size={20} className="text-emerald-500" /> Informations personnelles</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: "Nom", name: "nom", value: formData.nom || etudiant.nom },
                    { label: "Prénom", name: "prenom", value: formData.prenom || etudiant.prenom },
                    { label: "Email", name: "email", value: formData.email || etudiant.email, type: "email" },
                    { label: "Matricule", name: "matricule", value: formData.matricule || etudiant.matricule },
                    { label: "Téléphone", name: "telephone", value: formData.telephone || etudiant.telephone, placeholder: "+213 XX XXX XXXX" },
                    { label: "Adresse", name: "adresse", value: formData.adresse || etudiant.adresse, placeholder: "Ville, pays" },
                    { label: "Filière", name: "filiere", value: formData.filiere || etudiant.filiere },
                    { label: "Université", name: "universite", value: formData.universite || etudiant.universite },
                    { label: "Niveau", name: "niveau", value: formData.niveau || etudiant.niveau }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>{field.label}</label>
                      {isEditing ? <input type={field.type || "text"} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-emerald-400" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /> : <p className="p-2 rounded-xl" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{field.value || "Non renseigné"}</p>}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Compétences (séparées par des virgules)</label>
                    {isEditing ? <input type="text" name="competences" value={formData.competences} onChange={handleInputChange} placeholder="React, Python, JavaScript" className="w-full p-2 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /> : <div className="flex flex-wrap gap-2 p-2 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>{(formData.competences || etudiant.competences?.join(", ") || "").split(",").map((s, i) => s.trim() && <span key={i} className="px-2 py-1 rounded-full text-sm" style={{ backgroundColor: theme.card, color: theme.text }}>{s.trim()}</span>)}</div>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Bio</label>
                    {isEditing ? <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" placeholder="Parlez de vous..." className="w-full p-2 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /> : <p className="p-2 rounded-xl" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{formData.bio || etudiant.bio || "Aucune présentation"}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: theme.card }}>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: theme.text }}><FileText size={20} className="text-emerald-500" /> Curriculum Vitae (CV)</h3>
                  <button onClick={() => setIsCvEditing(!isCvEditing)} className="text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-700 flex items-center gap-1"><Edit size={14} /> {isCvEditing ? "Fermer" : "Personnaliser"}</button>
                </div>
                
                <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: theme.cardAlt }}>
                  <div className="flex justify-between items-start mb-4">
                    <div><h4 className="font-bold" style={{ color: theme.text }}>{getCurrentCv().nom} {getCurrentCv().prenom}</h4><p className="text-sm" style={{ color: theme.textLight }}>{getCurrentCv().email}</p></div>
                    <div className="flex gap-2">
                      <button onClick={handleGenerateCVFromProfile} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs hover:bg-emerald-600 flex items-center gap-1"><FilePlus size={12} /> Générer</button>
                      <button onClick={handleDownloadCV} className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 flex items-center gap-1"><Download size={12} /> Télécharger</button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500 dark:text-gray-400">Téléphone:</span> <span style={{ color: theme.text }}>{getCurrentCv().telephone || "Non renseigné"}</span></div>
                    <div><span className="text-gray-500 dark:text-gray-400">Adresse:</span> <span style={{ color: theme.text }}>{getCurrentCv().adresse || "Non renseignée"}</span></div>
                    <div><span className="text-gray-500 dark:text-gray-400">Université:</span> <span style={{ color: theme.text }}>{getCurrentCv().universite || "Non renseignée"}</span></div>
                    <div><span className="text-gray-500 dark:text-gray-400">Filière:</span> <span style={{ color: theme.text }}>{getCurrentCv().filiere || "Non renseignée"}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500 dark:text-gray-400">Compétences:</span> <div className="flex flex-wrap gap-1 mt-1">{getCurrentCv().competences.map((s, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.card, color: theme.text }}>{s}</span>)}</div></div>
                  </div>
                </div>

                {isCvEditing && (
                  <div className="border-t pt-4 mt-2" style={{ borderColor: theme.border }}>
                    <h4 className="font-medium mb-3 flex items-center gap-2" style={{ color: theme.text }}><Edit size={16} className="text-emerald-500" /> Informations complémentaires</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Expérience professionnelle</label>
                        <textarea name="experience" value={customCvExtra.experience} onChange={handleCvExtraChange} rows="2" placeholder="Décrivez vos expériences..." className="w-full p-2 border rounded-lg text-sm" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Formation complémentaire</label>
                        <textarea name="formation" value={customCvExtra.formation} onChange={handleCvExtraChange} rows="2" placeholder="Certifications, formations..." className="w-full p-2 border rounded-lg text-sm" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Langues</label>
                        <input type="text" name="langues" value={customCvExtra.langues} onChange={handleCvExtraChange} placeholder="Arabe, Français, Anglais..." className="w-full p-2 border rounded-lg text-sm" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Centres d'intérêt</label>
                        <input type="text" name="centresInteret" value={customCvExtra.centresInteret} onChange={handleCvExtraChange} placeholder="Sport, lecture, voyage..." className="w-full p-2 border rounded-lg text-sm" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} />
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={handleGenerateCVFromProfile} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600">Mettre à jour le CV</button>
                      <button onClick={() => setCustomCvExtra({ experience: "", formation: "", langues: "", centresInteret: "" })} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600">Effacer</button>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mt-4" style={{ borderColor: theme.border }}>
                  <p className="text-sm mb-2" style={{ color: theme.textLight }}>Ou téléchargez un CV existant :</p>
                  <label className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 inline-flex items-center gap-2 text-sm"><Upload size={14} /> Choisir un fichier<input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleCVUpload} /></label>
                  {uploadedCv && <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-sm flex items-center justify-between"><span>📄 {uploadedCv.name}</span><button onClick={() => { setUploadedCv(null); setCvName(""); }} className="text-rose-500 text-xs">Supprimer</button></div>}
                </div>
              </div>
            </div>
          )}

          {/* ==================== LISTE DES OFFRES AVEC FILTRES RADHOUM (SIDE LIST) ==================== */}
          {activeMenu === "offres" && (
            <div className="flex gap-5">
              {/* Side list des filtres Radhoum */}
              <RadhoumFilters 
                filters={filters}
                setFilters={setFilters}
                activeFiltersCount={activeFiltersCount}
                onReset={handleResetFilters}
                darkMode={darkMode}
                theme={theme}
              />
              
              {/* Liste des offres */}
              <div className="flex-1 space-y-4">
                {/* En-tête avec compteur */}
                <div className="flex justify-between items-center">
                  <p className="text-sm" style={{ color: theme.textLight }}>
                    <span className="font-bold text-emerald-600">{offresFiltrees.length}</span> offre{offresFiltrees.length > 1 ? 's' : ''} trouvée{offresFiltrees.length > 1 ? 's' : ''}
                  </p>
                  {activeFiltersCount > 0 && (
                    <button onClick={handleResetFilters} className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1">
                      <X size={14} /> Effacer tous les filtres
                    </button>
                  )}
                </div>

                {offresFiltrees.length > 0 ? (
                  <div className="space-y-4">
                    {offresFiltrees.map(offre => (
                      <div key={offre.id} className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex gap-2 mb-2 flex-wrap">
                                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">{offre.type}</span>
                                {offre.salaire !== 'Non rémunéré' && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">💰 Rémunéré</span>}
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">⏱️ {offre.duree}</span>
                              </div>
                              <h3 className="text-xl font-bold mb-1" style={{ color: theme.text }}>{offre.titre}</h3>
                              <div className="flex items-center gap-2 mb-3" style={{ color: theme.textLight }}><Building2 size={16} /><span className="text-sm">{offre.entreprise}</span></div>
                              <div className="flex flex-wrap gap-4 mb-3 text-sm" style={{ color: theme.textLight }}><span className="flex items-center gap-1"><MapPin size={14} /> {offre.lieu}</span><span className="flex items-center gap-1 text-emerald-600 font-medium"><DollarSign size={14} /> {offre.salaire}</span></div>
                              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: theme.cardAlt }}><p className="text-sm leading-relaxed" style={{ color: theme.text }}>{offre.description}</p></div>
                              {offre.competences && offre.competences.length > 0 && (
                                <div className="mt-3"><p className="text-xs mb-2" style={{ color: theme.textLight }}>Compétences requises :</p><div className="flex flex-wrap gap-2">{offre.competences.map((s, i) => <span key={i} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{s}</span>)}</div></div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-3 ml-4">
                              <button onClick={() => toggleFavori(offre.id)} className={`p-2 rounded-full transition-all ${favoris[offre.id] ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-500"}`}><Heart size={20} fill={favoris[offre.id] ? "white" : "none"} /></button>
                              <button onClick={() => handlePostuler(offre)} className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition-colors">Postuler</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                    <Search size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                    <p style={{ color: theme.textLight }}>Aucune offre ne correspond à vos critères</p>
                    {activeFiltersCount > 0 && (
                      <button onClick={handleResetFilters} className="mt-3 text-emerald-600 hover:text-emerald-700">
                        Effacer tous les filtres
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* ==================== MES CANDIDATURES ==================== */}
          {activeMenu === "mesCandidatures" && (
            <div className="space-y-3">
              {mesCandidatures.length > 0 ? mesCandidatures.map(c => (
                <div key={c.id} className="rounded-xl p-4 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-center"><div><h4 className="font-bold" style={{ color: theme.text }}>{c.offreTitre}</h4><p className="text-sm" style={{ color: theme.textLight }}>Postulé le {c.date}</p></div><span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.statut === "acceptee" ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" : c.statut === "refusee" ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"}`}>{c.statut === "acceptee" ? "Acceptée" : c.statut === "refusee" ? "Refusée" : "En attente"}</span></div>
                </div>
              )) : <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}><Send size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} /><p style={{ color: theme.textLight }}>Aucune candidature</p></div>}
            </div>
          )}

          {/* ==================== MES STAGES ==================== */}
          {activeMenu === "mesStages" && (
            <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}><Calendar size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} /><p style={{ color: theme.textLight }}>Mes stages apparaîtront ici</p></div>
          )}

          {/* ==================== MES FAVORIS ==================== */}
          {activeMenu === "favoris" && (
            <div className="space-y-3">
              {offresFavoris.length > 0 ? offresFavoris.map(offre => (
                <div key={offre.id} className="rounded-xl p-4 shadow-sm border-l-4 border-rose-400" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-start"><div><h4 className="font-bold" style={{ color: theme.text }}>{offre.titre}</h4><p style={{ color: theme.textLight }}>{offre.entreprise}</p><div className="flex gap-3 mt-1 text-xs" style={{ color: theme.textLight }}><span><MapPin size={12} className="inline" /> {offre.lieu}</span><span><Clock size={12} className="inline" /> {offre.duree}</span></div></div><div className="flex flex-col gap-2 items-end"><button onClick={() => toggleFavori(offre.id)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600"><Heart size={18} fill="white" /></button><button onClick={() => handlePostuler(offre)} className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-600">Postuler</button></div></div>
                </div>
              )) : <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}><Heart size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} /><p style={{ color: theme.textLight }}>Aucun favori</p><button onClick={() => setActiveMenu("offres")} className="mt-3 text-emerald-600 hover:text-emerald-700">Découvrir des offres →</button></div>}
            </div>
          )}

          {/* ==================== MES ÉVALUATIONS ==================== */}
          {activeMenu === "evaluations" && (
            <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}><Star size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} /><p style={{ color: theme.textLight }}>Évaluations à venir</p></div>
          )}

          {/* ==================== CHANGER MOT DE PASSE ==================== */}
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

          {/* ==================== CONDITIONS & AIDE ==================== */}
          {activeMenu === "aide" && (
            <div className="rounded-2xl shadow-sm p-6 max-w-3xl mx-auto" style={{ backgroundColor: theme.card }}>
              <h3 className="font-bold text-xl mb-5" style={{ color: theme.text }}>📚 Centre d'aide</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}><p className="font-semibold" style={{ color: theme.text }}>📝 Comment postuler ?</p><p className="text-sm mt-1" style={{ color: theme.textLight }}>1. Allez dans "Liste des offres"<br />2. Choisissez une offre<br />3. Cliquez sur "Postuler"<br />4. Choisissez votre CV (upload ou CV du profil)<br />5. Confirmez</p></div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}><p className="font-semibold" style={{ color: theme.text }}>🔍 Comment utiliser les filtres avancés ?</p><p className="text-sm mt-1" style={{ color: theme.textLight }}>Vous pouvez combiner plusieurs critères : recherche textuelle, multi-sélection des types et villes, filtrage par rémunération et durée, ajout de compétences spécifiques.</p></div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}><p className="font-semibold" style={{ color: theme.text }}>❤️ Comment ajouter une offre en favori ?</p><p className="text-sm mt-1" style={{ color: theme.textLight }}>Cliquez sur le cœur ❤️ à côté de l'offre</p></div>
                <div className="p-4 rounded-xl border-l-4 border-emerald-500" style={{ backgroundColor: theme.cardAlt }}><p className="font-semibold text-emerald-600 dark:text-emerald-400">📧 Besoin d'aide ?</p><p className="text-sm mt-1" style={{ color: theme.textLight }}>Contactez-nous : support@stageflow.dz</p></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STYLES CSS */}
      <style>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .spinner { border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #10b981; width: 40px; height: 40px; animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}