import { useState } from 'react';
import { Search, TrendingUp, Filter, MapPin, Clock, DollarSign, Heart, ChevronRight, Award, X, Calendar, Building, Tag, ArrowLeft } from "lucide-react";
import { offresData } from "../data/data";

export function PageOffres({ onPostulerClick, setPage, darkMode }) {
  const [recherche, setRecherche] = useState("");
  const [typeStage, setTypeStage] = useState("Tous");
  const [ville, setVille] = useState("Tous");
  const [likes, setLikes] = useState({});
  const [selectedOffre, setSelectedOffre] = useState(null);

  const offresFiltrees = offresData.filter(offre => {
    const memeRecherche = offre.titre.toLowerCase().includes(recherche.toLowerCase()) || 
                         offre.entreprise.toLowerCase().includes(recherche.toLowerCase());
    const memeType = typeStage === "Tous" || offre.type === typeStage;
    const memeVille = ville === "Tous" || offre.lieu === ville;
    return memeRecherche && memeType && memeVille;
  });

  const openOffreDetails = (offre) => {
    setSelectedOffre(offre);
    document.body.style.overflow = 'hidden';
  };

  const closeOffreDetails = () => {
    setSelectedOffre(null);
    document.body.style.overflow = 'auto';
  };
  

  return (
    <div className={`min-h-screen fade-in ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Award size={18} className="text-blue-500" />
              <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>+1000 Offres disponibles</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trouvez votre stage idéal</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Découvrez des milliers d'opportunités en Algérie</p>
          </div>
          
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-20"></div>
              <div className={`relative rounded-xl shadow-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center">
                  <Search className={`ml-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                  <input 
                    type="text" 
                    placeholder="Rechercher par titre, entreprise..." 
                    className={`flex-1 px-3 py-3 outline-none rounded-lg ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`} 
                    value={recherche} 
                    onChange={(e) => setRecherche(e.target.value)} 
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Chercher
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Filter size={16} className="text-blue-500" />
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filtres:</span>
              </div>
              <select 
                value={typeStage} 
                onChange={(e) => setTypeStage(e.target.value)} 
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-blue-100 border-gray-200 text-gray-900'}`}
              >
                <option>Tous</option>
                <option>Stage PFE</option>
                <option>Stage</option>
              </select>
              <select 
                value={ville} 
                onChange={(e) => setVille(e.target.value)} 
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-blue-100 border-gray-200 text-gray-900'}`}
              >
                <option>Tous</option>
                <option>Alger</option>
                <option>Oran</option>
                <option>Constantine</option>
                <option>Tizi Ouzou</option>
                <option>Annaba</option>
              </select>
            </div>
            <button 
              onClick={() => { setTypeStage("Tous"); setVille("Tous"); setRecherche(""); }} 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-500 hover:bg-red-200'}`}
            >
              Réinitialiser
            </button>
          </div>
          
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-bold text-blue-500">{offresFiltrees.length}</span> offre(s) trouvée(s)
          </p>
          
          {offresFiltrees.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offresFiltrees.map(offre => (
                <div key={offre.id} className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-3 overflow-hidden group ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <span className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600'}`}>{offre.type}</span>
                    <button 
                      onClick={() => setLikes({...likes, [offre.id]: !likes[offre.id]})} 
                      className={`absolute top-3 right-3 p-2 rounded-full hover:scale-110 transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                    >
                      <Heart className={`w-4 h-4 ${likes[offre.id] ? 'fill-red-500 text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-20 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <img src={offre.image} alt={offre.entreprise} className="w-20 h-16 rounded-xl object-cover border-2 border-gray-200" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg transition ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'}`}>{offre.titre}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{offre.entreprise}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin size={14} className="text-yellow-500" />{offre.lieu}
                      </p>
                      <p className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Clock size={14} className="text-blue-500" />{offre.duree}
                      </p>
                      <p className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-bold text-green-500">{offre.salaire}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {offre.competences.map((skill, idx) => (
                        <span key={idx} className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-yellow-900/30 hover:text-yellow-400' : 'bg-blue-50 text-blue-600 hover:bg-yellow-100'}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className={`flex justify-between items-center pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>📅 {offre.date}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onPostulerClick(offre)} 
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2"
                        >
                          Postuler <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-6xl mb-4">🔍</div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Aucune offre trouvée</p>
              <button 
                onClick={() => { setTypeStage("Tous"); setVille("Tous"); setRecherche(""); }} 
                className={`mt-3 font-bold hover:underline transition-colors ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
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
                <li>
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      if (setPage) setPage("accueil");
                    }} 
                    className="hover:text-white transition cursor-pointer"
                  >
                    Accueil
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      if (setPage) setPage("offres");
                    }} 
                    className="hover:text-white transition cursor-pointer"
                  >
                    Offres
                  </button>
                </li>
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
              <div className="flex gap-3">
                {["LinkedIn", "Twitter", "Facebook"].map((social, i) => (
                  <a key={i} href="#" className="text-gray-400 hover:text-white transition">{social}</a>
                ))}
              </div>
            </div>
          </div>
          <div className={`border-t pt-8 text-center text-gray-400 text-sm ${darkMode ? 'border-gray-800' : 'border-gray-800'}`}>
            <p>© 2026 Stag.io - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}