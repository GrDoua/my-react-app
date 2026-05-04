import { useState, useEffect } from 'react';
import { Search, TrendingUp, Filter, MapPin, Clock, DollarSign, Heart, ChevronRight, Award, X, Calendar, Building, Tag, ArrowLeft, Briefcase, GraduationCap, Eye, ExternalLink, SlidersHorizontal, CheckCircle } from "lucide-react";
import { api } from '../api';

// Liste complète des wilayas d'Algérie
const WILAYAS = [
  'Tous', 'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
  'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
];

// Liste des types de stage
const TYPES_STAGE = [
  'Tous', 'Stage PFE', 'Stage d\'été', 'Stage ouvrier', 'Stage d\'initiation', 
  'Stage professionnel', 'Stage de perfectionnement', 'Alternance', 'CDD', 'CDI'
];

// Liste des durées
const DUREES = [
  'Tous', '1 mois', '2 mois', '3 mois', '4 mois', '5 mois', '6 mois', 
  '7 mois', '8 mois', '9 mois', '10 mois', '11 mois', '12 mois', 'Plus de 12 mois'
];

export function PageOffres({ onPostulerClick, setPage, darkMode }) {
  const [recherche, setRecherche] = useState("");
  const [typeStage, setTypeStage] = useState("Tous");
  const [ville, setVille] = useState("Tous");
  const [likes, setLikes] = useState({});
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [duree, setDuree] = useState("Tous");
  const [minSalaire, setMinSalaire] = useState("");

  // Charger les offres depuis l'API
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await api.getOffres();
        const data = await response.json();
        if (response.ok) {
          setOffres(data.offers || data.offres || []);
        } else {
          console.error("Erreur chargement offres");
          setOffres([]);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setOffres([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffres();
  }, []);

  const offresFiltrees = offres.filter(offre => {
    const memeRecherche = recherche === "" || 
      offre.titre?.toLowerCase().includes(recherche.toLowerCase()) || 
      offre.entreprise?.toLowerCase().includes(recherche.toLowerCase()) ||
      offre.description?.toLowerCase().includes(recherche.toLowerCase());
    
    const memeType = typeStage === "Tous" || offre.type === typeStage;
    const memeVille = ville === "Tous" || offre.lieu === ville;
    const memeDuree = duree === "Tous" || offre.duree === duree;
    
    let memeSalaire = true;
    if (minSalaire && minSalaire !== "") {
      const salaireOffre = offre.salaire || "";
      const montantOffre = parseInt(salaireOffre.replace(/[^0-9]/g, ''));
      const salaireMin = parseInt(minSalaire);
      if (!isNaN(montantOffre) && !isNaN(salaireMin)) {
        memeSalaire = montantOffre >= salaireMin;
      }
    }
    
    return memeRecherche && memeType && memeVille && memeDuree && memeSalaire;
  });

  const openOffreDetails = (offre) => {
    setSelectedOffre(offre);
    document.body.style.overflow = 'hidden';
  };

  const closeOffreDetails = () => {
    setSelectedOffre(null);
    document.body.style.overflow = 'auto';
  };

  const resetFilters = () => {
    setTypeStage("Tous");
    setVille("Tous");
    setDuree("Tous");
    setMinSalaire("");
    setRecherche("");
  };

  const activeFiltersCount = [typeStage, ville, duree, minSalaire].filter(f => f && f !== "Tous" && f !== "").length;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="spinner"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement des offres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen fade-in ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Award size={18} className="text-blue-500" />
              <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{offres.length} Offres disponibles</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trouvez votre stage idéal</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Découvrez des milliers d'opportunités en Algérie</p>
          </div>
          
          {/* Barre de recherche */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20"></div>
              <div className={`relative rounded-2xl shadow-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <Search className={`ml-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                  <input 
                    type="text" 
                    placeholder="Rechercher par titre, entreprise, compétence..." 
                    className={`flex-1 px-3 py-3 outline-none rounded-lg ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`} 
                    value={recherche} 
                    onChange={(e) => setRecherche(e.target.value)} 
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-transform">
                    Chercher
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtres */}
          <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showFilters ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'} shadow-sm`}
              >
                <SlidersHorizontal size={16} />
                <span className="font-medium text-sm">Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {activeFiltersCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition flex items-center gap-1"
                >
                  <X size={14} /> Réinitialiser
                </button>
              )}
            </div>
            
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="font-bold text-blue-500">{offresFiltrees.length}</span> offre(s) trouvée(s)
            </p>
          </div>
          
          {/* Panneau des filtres complets */}
          {showFilters && (
            <div className={`rounded-2xl p-5 mb-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Type de stage */}
                <div>
                  <label className={`block text-sm font-medium mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Briefcase size={14} className="text-blue-500" /> Type de stage
                  </label>
                  <select 
                    value={typeStage} 
                    onChange={(e) => setTypeStage(e.target.value)} 
                    className={`w-full px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                  >
                    {TYPES_STAGE.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Wilaya */}
                <div>
                  <label className={`block text-sm font-medium mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin size={14} className="text-yellow-500" /> Wilaya
                  </label>
                  <select 
                    value={ville} 
                    onChange={(e) => setVille(e.target.value)} 
                    className={`w-full px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                  >
                    {WILAYAS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                
                {/* Durée */}
                <div>
                  <label className={`block text-sm font-medium mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Clock size={14} className="text-blue-500" /> Durée
                  </label>
                  <select 
                    value={duree} 
                    onChange={(e) => setDuree(e.target.value)} 
                    className={`w-full px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                  >
                    {DUREES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                
                {/* Salaire minimum */}
                <div>
                  <label className={`block text-sm font-medium mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <DollarSign size={14} className="text-green-500" /> Salaire minimum (DA)
                  </label>
                  <input 
                    type="number" 
                    placeholder="Ex: 20000" 
                    value={minSalaire} 
                    onChange={(e) => setMinSalaire(e.target.value)} 
                    className={`w-full px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                  />
                </div>
              </div>
              
              {/* Filtres actifs */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-3 border-t flex flex-wrap gap-2" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filtres actifs :</span>
                  {typeStage !== "Tous" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <Briefcase size={10} /> {typeStage}
                      <button onClick={() => setTypeStage("Tous")}><X size={10} /></button>
                    </span>
                  )}
                  {ville !== "Tous" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                      <MapPin size={10} /> {ville}
                      <button onClick={() => setVille("Tous")}><X size={10} /></button>
                    </span>
                  )}
                  {duree !== "Tous" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Clock size={10} /> {duree}
                      <button onClick={() => setDuree("Tous")}><X size={10} /></button>
                    </span>
                  )}
                  {minSalaire && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center gap-1">
                      <DollarSign size={10} /> ≥ {minSalaire} DA
                      <button onClick={() => setMinSalaire("")}><X size={10} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Liste des offres */}
          {offresFiltrees.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offresFiltrees.map(offre => (
                <div key={offre.id} className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {/* Entête */}
                  <div className="h-28 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <span className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600'}`}>
                      {offre.type || 'Stage'}
                    </span>
                    <button 
                      onClick={() => setLikes({...likes, [offre.id]: !likes[offre.id]})} 
                      className={`absolute top-3 right-3 p-2 rounded-full hover:scale-110 transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                    >
                      <Heart className={`w-4 h-4 ${likes[offre.id] ? 'fill-red-500 text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  
                  {/* Corps */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 text-white font-bold text-xl shadow-md">
                        {offre.entreprise?.charAt(0) || 'E'}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg line-clamp-1 transition ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'}`}>
                          {offre.titre}
                        </h3>
                        <p className={`text-sm flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Building size={12} /> {offre.entreprise}
                        </p>
                      </div>
                    </div>
                    
                    {/* Description courte */}
                    <p className={`text-sm mt-2 mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {offre.description || "Aucune description disponible. Cliquez sur 'Voir détails' pour plus d'informations."}
                    </p>
                    
                    {/* Infos */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-yellow-500 flex-shrink-0" />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{offre.lieu || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-blue-500 flex-shrink-0" />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Durée: {offre.duree || 'Non spécifiée'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign size={14} className="text-green-500 flex-shrink-0" />
                        <span className="font-bold text-green-600">{offre.salaire || 'Non spécifié'}</span>
                      </div>
                    </div>
                    
                    {/* Compétences */}
                    {offre.competences && offre.competences.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {offre.competences.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-yellow-900/30 hover:text-yellow-400' : 'bg-blue-50 text-blue-600 hover:bg-yellow-100'}`}>
                            {skill}
                          </span>
                        ))}
                        {offre.competences.length > 3 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            +{offre.competences.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Boutons */}
                    <div className={`flex justify-between items-center pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button 
                        onClick={() => openOffreDetails(offre)} 
                        className={`text-xs flex items-center gap-1 transition ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`}
                      >
                        <Eye size={14} /> Voir détails
                      </button>
                      <button 
                        onClick={() => onPostulerClick(offre)} 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 flex items-center gap-2 shadow-md"
                      >
                        Postuler <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-6xl mb-4">🔍</div>
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aucune offre trouvée</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Essayez de modifier vos critères de recherche</p>
              <button 
                onClick={resetFilters} 
                className={`mt-4 px-6 py-2 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-500 hover:bg-red-200'}`}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-950' : 'bg-gray-900'} text-white py-12 px-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-500">Stag.io</h3>
              </div>
              <p className="text-gray-400 text-sm">La plateforme #1 pour trouver votre stage idéal en Algérie</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (setPage) setPage("accueil"); }} className="hover:text-white transition">Accueil</button></li>
                <li><button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (setPage) setPage("offres"); }} className="hover:text-white transition">Offres</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Aide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
              </div>
            </div>
          </div>
          <div className={`border-t pt-8 text-center text-gray-400 text-sm ${darkMode ? 'border-gray-800' : 'border-gray-800'}`}>
            <p>© 2026 Stag.io - Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* Modal Détails Offre */}
      {selectedOffre && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeOffreDetails}>
          <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`sticky top-0 p-5 border-b flex justify-between items-center ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: darkMode ? '#fff' : '#1f2937' }}>
                <Briefcase size={20} className="text-blue-500" />
                Détails du stage
              </h3>
              <button onClick={closeOffreDetails} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                  {selectedOffre.entreprise?.charAt(0) || 'E'}
                </div>
                <div>
                  <h4 className="text-2xl font-bold" style={{ color: darkMode ? '#fff' : '#1f2937' }}>{selectedOffre.titre}</h4>
                  <p className="text-blue-500 font-medium">{selectedOffre.entreprise}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className={`flex items-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <MapPin size={16} className="text-yellow-500" />
                  <div>
                    <p className="text-xs opacity-70">Lieu</p>
                    <p className="font-medium">{selectedOffre.lieu || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Clock size={16} className="text-blue-500" />
                  <div>
                    <p className="text-xs opacity-70">Durée</p>
                    <p className="font-medium">{selectedOffre.duree || 'Non spécifiée'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Briefcase size={16} className="text-purple-500" />
                  <div>
                    <p className="text-xs opacity-70">Type</p>
                    <p className="font-medium">{selectedOffre.type || 'Stage'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <DollarSign size={16} className="text-green-500" />
                  <div>
                    <p className="text-xs opacity-70">Salaire</p>
                    <p className="font-medium text-green-600">{selectedOffre.salaire || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl mb-5 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h5 className="font-semibold mb-2 flex items-center gap-2">📋 Description du poste</h5>
                <p className="text-sm leading-relaxed" style={{ color: darkMode ? '#d1d5db' : '#4b5563' }}>
                  {selectedOffre.description || "Aucune description détaillée n'est disponible pour cette offre. Veuillez contacter l'entreprise pour plus d'informations."}
                </p>
              </div>
              
              {selectedOffre.competences && selectedOffre.competences.length > 0 && (
                <div className="mb-5">
                  <h5 className="font-semibold mb-2 flex items-center gap-2">🎯 Compétences requises</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffre.competences.map((skill, idx) => (
                      <span key={idx} className={`px-3 py-1.5 rounded-full text-sm ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedOffre.avantages && selectedOffre.avantages.length > 0 && (
                <div className="mb-5">
                  <h5 className="font-semibold mb-2 flex items-center gap-2">✨ Avantages</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffre.avantages.map((avantage, idx) => (
                      <span key={idx} className={`px-3 py-1.5 rounded-full text-sm ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        {avantage}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => {
                  closeOffreDetails();
                  onPostulerClick(selectedOffre);
                }} 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
              >
                Postuler maintenant <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spinner {
          border: 3px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          border-top-color: #3b82f6;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}