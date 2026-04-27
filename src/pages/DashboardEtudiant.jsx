import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  User, Briefcase, Send, Calendar, Heart, Star, Settings, FileText,
  TrendingUp, LogOut, MapPin, Clock, DollarSign, Upload, Camera, Save,
  X, CheckCircle, AlertCircle, Key, Download, FilePlus, Edit, Building2, Search,
  Trash2, Eye, ChevronDown, ChevronRight, Globe, Phone, Mail, MapPin as MapPinIcon,
  Filter, SlidersHorizontal, Plus, Trash
} from "lucide-react";
import jsPDF from 'jspdf';

// ============================================
// DONNÉES DE TEST POUR LES OFFRES
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
      {items.length > 0 ? (
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
                <Trash size={14} />
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
export function DashboardEtudiant({ etudiant, offres = offersData, candidatures, onPostuler, onLogout, onUpdateProfil, onChangePassword, darkMode = false }) {
  
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
  // 1. TOUS LES useState
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
  const [photoPreview, setPhotoPreview] = useState(etudiant?.profilePhoto || null);
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
  const [cvName, setCvName] = useState(etudiant?.cvName || "");
  const [isCvEditing, setIsCvEditing] = useState(false);
  
  // Listes pour le CV
  const [experiences, setExperiences] = useState([]);
  const [formations, setFormations] = useState([]);
  const [langues, setLangues] = useState([]);
  const [centresInteret, setCentresInteret] = useState([]);
  
  // États temporaires pour les ajouts
  const [newExperience, setNewExperience] = useState("");
  const [newFormation, setNewFormation] = useState("");
  const [newLangue, setNewLangue] = useState("");
  const [newCentreInteret, setNewCentreInteret] = useState("");

  // États pour le mot de passe
  const [passwordData, setPasswordData] = useState({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" });
  const [passwordErrors, setPasswordErrors] = useState({});

  // ============================================
  // 2. FONCTION getCurrentCv
  // ============================================
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

  // ============================================
  // 3. showNotification
  // ============================================
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ============================================
  // 4. FONCTIONS POUR GÉRER LES LISTES DU CV
  // ============================================
  const addExperience = () => {
    if (newExperience.trim()) {
      setExperiences([...experiences, newExperience.trim()]);
      setNewExperience("");
      showNotification('success', "✅ Expérience ajoutée");
    }
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
    showNotification('success', "❌ Expérience supprimée");
  };

  const addFormation = () => {
    if (newFormation.trim()) {
      setFormations([...formations, newFormation.trim()]);
      setNewFormation("");
      showNotification('success', "✅ Formation ajoutée");
    }
  };

  const removeFormation = (index) => {
    setFormations(formations.filter((_, i) => i !== index));
    showNotification('success', "❌ Formation supprimée");
  };

  const addLangue = () => {
    if (newLangue.trim()) {
      setLangues([...langues, newLangue.trim()]);
      setNewLangue("");
      showNotification('success', "✅ Langue ajoutée");
    }
  };

  const removeLangue = (index) => {
    setLangues(langues.filter((_, i) => i !== index));
    showNotification('success', "❌ Langue supprimée");
  };

  const addCentreInteret = () => {
    if (newCentreInteret.trim()) {
      setCentresInteret([...centresInteret, newCentreInteret.trim()]);
      setNewCentreInteret("");
      showNotification('success', "✅ Centre d'intérêt ajouté");
    }
  };

  const removeCentreInteret = (index) => {
    setCentresInteret(centresInteret.filter((_, i) => i !== index));
    showNotification('success', "❌ Centre d'intérêt supprimé");
  };

  // ============================================
  // 5. FILTRAGE DES OFFRES
  // ============================================
  const offresDisponibles = useMemo(() => {
    const offresData = offres || offersData;
    return offresData.filter(o => o.statut !== 'inactive');
  }, [offres]);

  const offresFiltrees = useMemo(() => {
    const data = offresDisponibles;
    if (!data) return [];

    return data.filter(offre => {
      const matchSearch = !filters.search || 
                         offre.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         offre.entreprise?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         offre.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         offre.competences?.some(c => c.toLowerCase().includes(filters.search.toLowerCase()));
      
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
        if (filters.salaireMin) {
          const salaireMin = parseInt(filters.salaireMin);
          if (!isNaN(salaireMin) && montantOffre < salaireMin) matchSalaire = false;
        }
        if (filters.salaireMax && matchSalaire) {
          const salaireMax = parseInt(filters.salaireMax);
          if (!isNaN(salaireMax) && montantOffre > salaireMax) matchSalaire = false;
        }
      } else {
        if (filters.salaireMin && filters.salaireMin !== '0') matchSalaire = false;
      }
      
      return matchSearch && matchType && matchVille && matchDuree && matchSalaire;
    });
  }, [offresDisponibles, filters]);

  // ============================================
  // 6. AUTRES useMemo
  // ============================================
  const mesCandidatures = useMemo(() => candidatures?.filter(c => c.etudiantId === etudiant?.id) || [], [candidatures, etudiant?.id]);
  const offresFavoris = useMemo(() => offresDisponibles?.filter(o => favoris[o.id]) || [], [offresDisponibles, favoris]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type) count++;
    if (filters.ville) count++;
    if (filters.duree) count++;
    if (filters.salaireMin) count++;
    if (filters.salaireMax) count++;
    return count;
  }, [filters]);

  // ============================================
  // 7. GESTION DES FILTRES
  // ============================================
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
    showNotification('success', "Filtres appliqués");
  };

  const resetFilters = () => {
    setFilters({ search: '', type: '', ville: '', duree: '', salaireMin: '', salaireMax: '' });
    setTempFilters({ type: '', ville: '', duree: '', salaireMin: '', salaireMax: '' });
    showNotification('success', "Filtres réinitialisés");
  };

  // ============================================
  // 8. GESTION DES FAVORIS
  // ============================================
  const toggleFavori = useCallback((offreId) => {
    setFavoris(prev => ({ ...prev, [offreId]: !prev[offreId] }));
    showNotification('success', !favoris[offreId] ? "❤️ Ajouté aux favoris" : "💔 Retiré des favoris");
  }, [favoris, showNotification]);

  // ============================================
  // 9. GESTION DE LA CANDIDATURE
  // ============================================
  const handlePostuler = useCallback((offre) => {
    setSelectedOffre(offre);
    setShowCvModal(true);
  }, []);

  const handleConfirmPostuler = useCallback(() => {
    const currentCvData = getCurrentCv();
    
    // Vérifier si le CV est disponible (uploadé OU généré avec au moins nom/prenom)
    const hasValidCv = uploadedCv || (currentCvData.nom && currentCvData.prenom);
    
    if (!hasValidCv) {
      showNotification('error', "❌ Veuillez compléter votre profil ou télécharger un CV");
      return;
    }
    
    const cvToSend = uploadedCv || { type: 'generated', data: currentCvData };
    if (onPostuler) {
      onPostuler(selectedOffre, cvToSend);
    }
    setShowCvModal(false);
    setSelectedOffre(null);
    showNotification('success', `✅ Candidature envoyée pour ${selectedOffre?.titre}`);
  }, [uploadedCv, getCurrentCv, onPostuler, selectedOffre, showNotification]);

  // ============================================
  // 10. GESTION DU CV (Upload, Download)
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

  // Téléchargement du CV en PDF
  const handleDownloadCV = useCallback(() => {
    const cv = getCurrentCv();
    const doc = new jsPDF();
    
    let yPos = 25;
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 20;
    
    // Titre
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("CURRICULUM VITAE", pageWidth / 2, yPos, { align: "center" });
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(`${cv.nom} ${cv.prenom}`, pageWidth / 2, yPos, { align: "center" });
    
    yPos += 8;
    doc.setDrawColor(16, 185, 129);
    doc.line(marginX, yPos, pageWidth - marginX, yPos);
    
    // Contact
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("CONTACT", marginX, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text(`Email : ${cv.email}`, marginX + 5, yPos);
    yPos += 5;
    doc.text(`Téléphone : ${cv.telephone || 'Non renseigné'}`, marginX + 5, yPos);
    yPos += 5;
    doc.text(`Adresse : ${cv.adresse || 'Non renseignée'}`, marginX + 5, yPos);
    
    // Formation
    yPos += 12;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("FORMATION", marginX, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text(`Université : ${cv.universite || 'Non renseignée'}`, marginX + 5, yPos);
    yPos += 5;
    doc.text(`Filière : ${cv.filiere || 'Non renseignée'}`, marginX + 5, yPos);
    yPos += 5;
    doc.text(`Niveau : ${cv.niveau || 'Non renseigné'}`, marginX + 5, yPos);
    
    // Compétences
    yPos += 12;
    if (yPos > 250) { doc.addPage(); yPos = 25; }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text("COMPETENCES", marginX, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    
    if (cv.competences.length > 0) {
      let ligneCompetence = "";
      cv.competences.forEach((comp, index) => {
        ligneCompetence += comp;
        if (index < cv.competences.length - 1) ligneCompetence += "  |  ";
      });
      const lignes = doc.splitTextToSize(ligneCompetence, pageWidth - marginX - 10);
      doc.text(lignes, marginX + 5, yPos);
      yPos += (lignes.length * 5) + 5;
    } else {
      doc.text("Aucune compétence renseignée", marginX + 5, yPos);
      yPos += 8;
    }
    
    // Expériences
    if (cv.experiences && cv.experiences.length > 0) {
      yPos += 8;
      if (yPos > 250) { doc.addPage(); yPos = 25; }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text("EXPERIENCES PROFESSIONNELLES", marginX, yPos);
      
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      
      cv.experiences.forEach((exp) => {
        if (yPos > 260) { doc.addPage(); yPos = 25; }
        doc.text("- " + exp, marginX + 5, yPos);
        yPos += 6;
      });
      yPos += 4;
    }
    
    // Formations complémentaires
    if (cv.formations && cv.formations.length > 0) {
      yPos += 8;
      if (yPos > 250) { doc.addPage(); yPos = 25; }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text("FORMATIONS COMPLEMENTAIRES", marginX, yPos);
      
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      
      cv.formations.forEach((formation) => {
        if (yPos > 260) { doc.addPage(); yPos = 25; }
        doc.text("- " + formation, marginX + 5, yPos);
        yPos += 6;
      });
      yPos += 4;
    }
    
    // Langues
    if (cv.langues && cv.langues.length > 0) {
      yPos += 8;
      if (yPos > 250) { doc.addPage(); yPos = 25; }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text("LANGUES", marginX, yPos);
      
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      
      let ligneLangues = "";
      cv.langues.forEach((langue, index) => {
        ligneLangues += langue;
        if (index < cv.langues.length - 1) ligneLangues += "  |  ";
      });
      doc.text(ligneLangues, marginX + 5, yPos);
      yPos += 8;
    }
    
    // Centres d'intérêt
    if (cv.centresInteret && cv.centresInteret.length > 0) {
      yPos += 8;
      if (yPos > 250) { doc.addPage(); yPos = 25; }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text("CENTRES D'INTERET", marginX, yPos);
      
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      
      let ligneCentres = "";
      cv.centresInteret.forEach((centre, index) => {
        ligneCentres += centre;
        if (index < cv.centresInteret.length - 1) ligneCentres += "  |  ";
      });
      doc.text(ligneCentres, marginX + 5, yPos);
      yPos += 8;
    }
    
    // Pied de page
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Créé le ${new Date().toLocaleDateString('fr-FR')} via Stag.io`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    
    doc.save(`CV_${cv.nom}_${cv.prenom}.pdf`);
    showNotification('success', "✅ CV PDF téléchargé");
  }, [getCurrentCv, showNotification]);

  // ============================================
  // 11. GESTION DU PROFIL
  // ============================================
  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSaveProfil = useCallback(() => {
    const updatedEtudiant = {
      ...etudiant, ...formData,
      competences: formData.competences.split(",").map(c => c.trim()).filter(c => c),
      profilePhoto: photoPreview, 
      cvName: cvName,
      experiences: experiences,
      formations: formations,
      langues: langues,
      centresInteret: centresInteret
    };
    if (onUpdateProfil) {
      onUpdateProfil(updatedEtudiant);
    }
    setIsEditing(false);
    showNotification('success', "✅ Profil mis à jour");
  }, [etudiant, formData, photoPreview, cvName, experiences, formations, langues, centresInteret, onUpdateProfil, showNotification]);

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
  // 12. GESTION DU MOT DE PASSE
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
  // 13. MENU ITEMS
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
  // 14. VÉRIFICATION QUE ETUDIANT EXISTE
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
  // 15. RENDU PRINCIPAL
  // ============================================
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
                <Filter size={20} /> Filtres de recherche
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="p-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Type de stage</label>
                <input
                  type="text"
                  value={tempFilters.type}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Stage PFE, Stage, Alternance..."
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Wilaya</label>
                <AutocompleteWilaya
                  value={tempFilters.ville}
                  onChange={(value) => setTempFilters(prev => ({ ...prev, ville: value }))}
                  placeholder="Tapez le nom d'une wilaya..."
                  darkMode={darkMode}
                />
                <p className="text-xs mt-1" style={{ color: theme.textLight }}>💡 Tapez "A" pour voir Alger, Adrar, Annaba...</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Durée</label>
                <input
                  type="text"
                  value={tempFilters.duree}
                  onChange={(e) => setTempFilters(prev => ({ ...prev, duree: e.target.value }))}
                  placeholder="3 mois, 6 mois, 1 an..."
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Salaire Min (DA)</label>
                  <input
                    type="number"
                    value={tempFilters.salaireMin}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, salaireMin: e.target.value }))}
                    placeholder="Ex: 30000"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Salaire Max (DA)</label>
                  <input
                    type="number"
                    value={tempFilters.salaireMax}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, salaireMax: e.target.value }))}
                    placeholder="Ex: 100000"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }}
                  />
                </div>
              </div>
              
              <p className="text-xs p-2 rounded-lg" style={{ color: theme.textLight, backgroundColor: theme.cardAlt }}>
                💡 Laisse vide pour ne pas filtrer
              </p>
            </div>
            <div className="border-t p-6 flex gap-3" style={{ borderColor: theme.border }}>
              <button onClick={applyFilters} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600">
                Appliquer les filtres
              </button>
              <button onClick={() => { setTempFilters({ type: '', ville: '', duree: '', salaireMin: '', salaireMax: '' }); }} className="flex-1 py-2 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>
                Effacer
              </button>
            </div>
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
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">{selectedOffre.type}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">{selectedOffre.lieu}</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">{selectedOffre.duree}</span>
                  <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">{selectedOffre.salaire}</span>
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
                  {uploadedCv && <div className="mt-3 p-2 rounded-lg text-sm flex items-center justify-between" style={{ backgroundColor: theme.cardAlt }}><span style={{ color: theme.text }}>📄 {uploadedCv.name}</span><CheckCircle size={16} className="text-emerald-500" /></div>}
                </div>
                
                <div className="text-center text-xs" style={{ color: theme.textLight }}>OU</div>
                
                <div className="rounded-xl p-5" style={{ backgroundColor: theme.cardAlt }}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}><FileText size={18} className="text-emerald-500" /> Utiliser mon CV du profil</h4>
                  <div className="rounded-lg p-3 mb-3 text-sm" style={{ backgroundColor: theme.card }}>
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
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-white/10">
              <span className="text-xl font-bold text-white">
                {((formData.prenom || etudiant.prenom)?.charAt(0) || '')}{((formData.nom || etudiant.nom)?.charAt(0) || 'É')}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-semibold text-white">
              {(formData.prenom || etudiant.prenom)} {(formData.nom || etudiant.nom)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
              <p className="text-emerald-400 text-xs font-medium">{formData.filiere || etudiant.filiere}</p>
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
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
            {photoPreview ? <img src={photoPreview} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400" /> : <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.cardAlt }}><User size={18} style={{ color: theme.textLight }} /></div>}
            <span className="font-medium" style={{ color: theme.text }}>{formData.nom || etudiant.nom} {formData.prenom || etudiant.prenom}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* MON PROFIL */}
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
                      <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>{field.label}</label>
                      {isEditing ? <input type={field.type || "text"} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-emerald-400" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /> : <p className="p-2 rounded-xl" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{field.value || "Non renseigné"}</p>}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Compétences (séparées par des virgules)</label>
                    {isEditing ? <input type="text" name="competences" value={formData.competences} onChange={handleInputChange} placeholder="React, Python, JavaScript" className="w-full p-2 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /> : <div className="flex flex-wrap gap-2 p-2 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>{(formData.competences || "").split(",").map((s, i) => s.trim() && <span key={i} className="px-2 py-1 rounded-full text-sm" style={{ backgroundColor: theme.card, color: theme.text }}>{s.trim()}</span>)}</div>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.textLight }}>Bio</label>
                    {isEditing ? <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" placeholder="Parlez de vous..." className="w-full p-2 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} /> : <p className="p-2 rounded-xl" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>{formData.bio || etudiant.bio || "Aucune présentation"}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION CV AVEC LISTES À PUCES */}
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
                    <div><span className="text-gray-500">Téléphone:</span> <span style={{ color: theme.text }}>{getCurrentCv().telephone || "Non renseigné"}</span></div>
                    <div><span className="text-gray-500">Adresse:</span> <span style={{ color: theme.text }}>{getCurrentCv().adresse || "Non renseignée"}</span></div>
                    <div><span className="text-gray-500">Université:</span> <span style={{ color: theme.text }}>{getCurrentCv().universite || "Non renseignée"}</span></div>
                    <div><span className="text-gray-500">Filière:</span> <span style={{ color: theme.text }}>{getCurrentCv().filiere || "Non renseignée"}</span></div>
                  </div>
                </div>

                {/* Zone d'édition du CV avec listes */}
                {isCvEditing && (
                  <div className="border-t pt-4 mt-2" style={{ borderColor: theme.border }}>
                    <h4 className="font-medium mb-3 flex items-center gap-2" style={{ color: theme.text }}><Edit size={16} className="text-emerald-500" /> Informations complémentaires</h4>
                    
                    <ListSection 
                      title="Expérience professionnelle"
                      items={experiences}
                      onAdd={addExperience}
                      onRemove={removeExperience}
                      newValue={newExperience}
                      setNewValue={setNewExperience}
                      placeholder="Ex: Stage chez ABC, 2023 - 2024"
                      darkMode={darkMode}
                    />
                    
                    <ListSection
                      title="Formation complémentaire"
                      items={formations}
                      onAdd={addFormation}
                      onRemove={removeFormation}
                      newValue={newFormation}
                      setNewValue={setNewFormation}
                      placeholder="Ex: Certification React, 2024"
                      darkMode={darkMode}
                    />
                    
                    <ListSection
                      title="Langues"
                      items={langues}
                      onAdd={addLangue}
                      onRemove={removeLangue}
                      newValue={newLangue}
                      setNewValue={setNewLangue}
                      placeholder="Ex: Arabe (natif), Français (courant), Anglais (intermédiaire)"
                      darkMode={darkMode}
                    />
                    
                    <ListSection
                      title="Centres d'intérêt"
                      items={centresInteret}
                      onAdd={addCentreInteret}
                      onRemove={removeCentreInteret}
                      newValue={newCentreInteret}
                      setNewValue={setNewCentreInteret}
                      placeholder="Ex: Sport, lecture, voyage"
                      darkMode={darkMode}
                    />
                    
                    <div className="mt-3 flex gap-2">
                      <button onClick={handleGenerateCVFromProfile} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600">Mettre à jour le CV</button>
                      <button onClick={() => {
                        setExperiences([]);
                        setFormations([]);
                        setLangues([]);
                        setCentresInteret([]);
                      }} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600">Tout effacer</button>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mt-4" style={{ borderColor: theme.border }}>
                  <p className="text-sm mb-2" style={{ color: theme.textLight }}>Ou téléchargez un CV existant :</p>
                  <label className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 inline-flex items-center gap-2 text-sm"><Upload size={14} /> Choisir un fichier<input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleCVUpload} /></label>
                  {uploadedCv && <div className="mt-2 p-2 rounded-lg text-sm flex items-center justify-between" style={{ backgroundColor: theme.cardAlt }}><span style={{ color: theme.text }}>📄 {uploadedCv.name}</span><button onClick={() => { setUploadedCv(null); setCvName(""); }} className="text-rose-500 text-xs">Supprimer</button></div>}
                </div>
              </div>
            </div>
          )}

          {/* LISTE DES OFFRES */}
          {activeMenu === "offres" && (
            <div className="space-y-5">
              <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.card }}>
                <div className="flex gap-3 flex-wrap items-center">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textLight }} />
                    <input 
                      type="text" 
                      placeholder="Rechercher par titre, entreprise, description ou compétences..." 
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
                    <button onClick={resetFilters} className="text-rose-500 text-sm hover:text-rose-600 flex items-center gap-1">
                      <X size={14} /> Réinitialiser
                    </button>
                  )}
                </div>

                {activeFiltersCount > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {filters.type && <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">Type: {filters.type}</span>}
                    {filters.ville && <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">Wilaya: {filters.ville}</span>}
                    {filters.duree && <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">Durée: {filters.duree}</span>}
                    {filters.salaireMin && <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">Salaire min: {filters.salaireMin} DA</span>}
                    {filters.salaireMax && <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">Salaire max: {filters.salaireMax} DA</span>}
                  </div>
                )}
              </div>
              
              {offresFiltrees.length > 0 ? (
                <>
                  <div className="text-sm" style={{ color: theme.textLight }}>{offresFiltrees.length} offre(s) trouvée(s)</div>
                  {offresFiltrees.map(offre => (
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
                              {offre.salaire === 'Non rémunéré' && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">Non rémunéré</span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold mb-1" style={{ color: theme.text }}>{offre.titre}</h3>
                            <div className="flex items-center gap-2 mb-3" style={{ color: theme.textLight }}><Building2 size={16} /><span className="text-sm">{offre.entreprise}</span></div>
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
                            <button onClick={() => toggleFavori(offre.id)} className={`p-2 rounded-full transition-all ${favoris[offre.id] ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-500"}`}>
                              <Heart size={20} fill={favoris[offre.id] ? "white" : "none"} />
                            </button>
                            <button onClick={() => handlePostuler(offre)} className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium">
                              Postuler
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
                  <Briefcase size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
                  <p style={{ color: theme.textLight }}>Aucune offre ne correspond à vos critères</p>
                  <button onClick={resetFilters} className="mt-3 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">Réinitialiser les filtres →</button>
                </div>
              )}
            </div>
          )}
          
          {/* MES CANDIDATURES */}
          {activeMenu === "mesCandidatures" && (
            <div className="space-y-3">
              {mesCandidatures.length > 0 ? mesCandidatures.map(c => (
                <div key={c.id} className="rounded-xl p-4 shadow-sm border-l-4 border-emerald-400" style={{ backgroundColor: theme.card }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold" style={{ color: theme.text }}>{c.offreTitre}</h4>
                      <p className="text-sm" style={{ color: theme.textLight }}>Postulé le {c.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.statut === "acceptee" ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" : c.statut === "refusee" ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"}`}>
                      {c.statut === "acceptee" ? "Acceptée" : c.statut === "refusee" ? "Refusée" : "En attente"}
                    </span>
                  </div>
                </div>
              )) : <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}><Send size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} /><p style={{ color: theme.textLight }}>Aucune candidature</p></div>}
            </div>
          )}

          {/* MES STAGES */}
          {activeMenu === "mesStages" && (
            <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
              <Calendar size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
              <p style={{ color: theme.textLight }}>Mes stages apparaîtront ici</p>
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
                      <div className="flex gap-3 mt-1 text-xs" style={{ color: theme.textLight }}><span><MapPin size={12} className="inline" /> {offre.lieu}</span><span><Clock size={12} className="inline" /> {offre.duree}</span></div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button onClick={() => toggleFavori(offre.id)} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600"><Heart size={18} fill="white" /></button>
                      <button onClick={() => handlePostuler(offre)} className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-600">Postuler</button>
                    </div>
                  </div>
                </div>
              )) : <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}><Heart size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} /><p style={{ color: theme.textLight }}>Aucun favori</p><button onClick={() => setActiveMenu("offres")} className="mt-3 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">Découvrir des offres →</button></div>}
            </div>
          )}

          {/* MES ÉVALUATIONS */}
          {activeMenu === "evaluations" && (
            <div className="rounded-xl p-12 text-center" style={{ backgroundColor: theme.card }}>
              <Star size={48} className="mx-auto mb-3" style={{ color: theme.textLight }} />
              <p style={{ color: theme.textLight }}>Évaluations à venir</p>
            </div>
          )}

          {/* CHANGER MOT DE PASSE */}
          {activeMenu === "changePassword" && (
            <div className="max-w-md mx-auto">
              <div className="rounded-2xl shadow-sm p-8" style={{ backgroundColor: theme.card }}>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.cardAlt }}><Key size={40} className="text-emerald-500" /></div>
                  <h3 className="text-2xl font-bold" style={{ color: theme.text }}>Changer le mot de passe</h3>
                  <p className="text-sm mt-2" style={{ color: theme.textLight }}>Sécurisez votre compte</p>
                </div>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Ancien mot de passe</label><input type="password" name="ancienMotDePasse" value={passwordData.ancienMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Entrez votre mot de passe actuel" />{passwordErrors.ancienMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.ancienMotDePasse}</p>}</div>
                  <div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Nouveau mot de passe</label><input type="password" name="nouveauMotDePasse" value={passwordData.nouveauMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Minimum 6 caractères" />{passwordErrors.nouveauMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.nouveauMotDePasse}</p>}</div>
                  <div><label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Confirmer</label><input type="password" name="confirmerMotDePasse" value={passwordData.confirmerMotDePasse} onChange={handlePasswordChange} className="w-full p-3 border rounded-xl" style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }} placeholder="Retapez votre nouveau mot de passe" />{passwordErrors.confirmerMotDePasse && <p className="text-rose-500 text-xs mt-1">{passwordErrors.confirmerMotDePasse}</p>}</div>
                  <div className="flex gap-3 pt-4"><button onClick={handleSubmitPasswordChange} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Changer</button><button onClick={() => { setPasswordData({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmerMotDePasse: "" }); setPasswordErrors({}); }} className="flex-1 py-3 rounded-xl font-semibold" style={{ backgroundColor: theme.cardAlt, color: theme.text }}>Réinitialiser</button></div>
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONS & AIDE */}
          {activeMenu === "aide" && (
            <div className="rounded-2xl shadow-sm p-6 max-w-3xl mx-auto" style={{ backgroundColor: theme.card }}>
              <h3 className="font-bold text-xl mb-5" style={{ color: theme.text }}>📚 Centre d'aide</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                  <p className="font-semibold" style={{ color: theme.text }}>🔍 Comment utiliser la recherche ?</p>
                  <p className="text-sm mt-1" style={{ color: theme.textLight }}>
                    • Barre de recherche : cherche dans les titres, entreprises, descriptions et compétences<br />
                    • Cliquez sur "Filtres" pour ouvrir une fenêtre et écrire vos critères :<br />
                    &nbsp;&nbsp;- Type de stage (Stage, Stage PFE, Alternance)<br />
                    &nbsp;&nbsp;- Wilaya (tapez les premières lettres pour voir les suggestions)<br />
                    &nbsp;&nbsp;- Durée (3 mois, 6 mois...)<br />
                    &nbsp;&nbsp;- Salaire minimum et maximum (en DA)<br />
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                  <p className="font-semibold" style={{ color: theme.text }}>📝 Comment postuler ?</p>
                  <p className="text-sm mt-1" style={{ color: theme.textLight }}>1. Allez dans "Liste des offres"<br />2. Choisissez une offre<br />3. Cliquez sur "Postuler"<br />4. Choisissez votre CV (upload ou CV du profil)<br />5. Confirmez</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.cardAlt }}>
                  <p className="font-semibold" style={{ color: theme.text }}>❤️ Comment ajouter une offre en favori ?</p>
                  <p className="text-sm mt-1" style={{ color: theme.textLight }}>Cliquez sur le cœur ❤️ à côté de l'offre</p>
                </div>
                <div className="p-4 rounded-xl border-l-4 border-emerald-500" style={{ backgroundColor: theme.cardAlt }}>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">📧 Besoin d'aide ?</p>
                  <p className="text-sm mt-1" style={{ color: theme.textLight }}>Contactez-nous : support@stageflow.dz</p>
                </div>
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