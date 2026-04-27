import { useState, useEffect } from 'react';
import { TrendingUp, Building2, GraduationCap, LogOut, UserCog, Moon, Sun, Shield } from "lucide-react";
import { offresData, entreprisesData, etudiantsData, candidaturesData } from './data/data';
import { Notification } from './Components/Notification';
import { ModalAuth } from './Components/ModalAuth';
import { ModalPostuler } from './Components/ModalPostuler';
import { PageAccueil } from './pages/Accueil';
import { PageOffres } from './pages/Offres';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardEntreprise } from './pages/DashboardEntreprise';
import { DashboardEtudiant } from './pages/DashboardEtudiant';


// ============================================
// COMPTES ADMIN (UNIVERSITÉS) - AJOUTÉS MANUELLEMENT
// Ces comptes ne peuvent PAS s'inscrire, seulement se connecter
// ============================================
const adminsData = [
  { id: 1, nom: "Université d'Alger", email: "admin@stag.io", password: "admin123", role: "admin" },
  { id: 2, nom: "USTHB", email: "admin@usthb.dz", password: "admin123", role: "admin" },
  { id: 3, nom: "Université d'Oran", email: "admin@univ-oran.dz", password: "admin123", role: "admin" },
  { id: 4, nom: "Université de Constantine", email: "admin@univ-constantine.dz", password: "admin123", role: "admin" },
  { id: 5, nom: "Université d'Annaba", email: "admin@univ-annaba.dz", password: "admin123", role: "admin" }
];

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [authUserType, setAuthUserType] = useState("etudiant");
  const [notification, setNotification] = useState(null);
  const [modalPostuler, setModalPostuler] = useState(null);
  const [page, setPage] = useState("accueil");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [offres, setOffres] = useState(offresData);
  const [entreprises, setEntreprises] = useState(entreprisesData);
  const [etudiants, setEtudiants] = useState(etudiantsData);
  const [candidatures, setCandidatures] = useState(candidaturesData);
  
  // Admins stockés dans le state (comme une table BD)
  const [admins, setAdmins] = useState(adminsData);

  // Appliquer le mode sombre
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogin = (email, password, userType) => {
    // 🔐 ADMINS : UNIQUEMENT CONNEXION (pas d'inscription)
    if (userType === "admin") {
      const admin = admins.find(a => a.email === email && a.password === password);
      if (admin) {
        setUser({ id: admin.id, nom: admin.nom, email, role: "admin" });
        setNotification({ message: `🏛️ Bienvenue ${admin.nom}!`, type: "success" });
        setShowAuthModal(false);
        return;
      } else {
        setNotification({ message: "❌ Compte admin non trouvé. Contactez l'administrateur.", type: "error" });
        return;
      }
    }
    
    // ✅ ENTREPRISES : connexion
    if (userType === "entreprise") {
      const entreprise = entreprises.find(e => e.email === email && e.password === password);
      if (entreprise) {
        setUser({ id: entreprise.id, nom: entreprise.nom, email, role: "entreprise" });
        setNotification({ message: `✅ Bienvenue ${entreprise.nom}!`, type: "success" });
        setShowAuthModal(false);
        return;
      }
    }
    
    // ✅ ÉTUDIANTS : connexion
    if (userType === "etudiant") {
      const etudiant = etudiants.find(e => e.email === email && e.password === password);
      if (etudiant) {
        setUser({ id: etudiant.id, nom: etudiant.nom, email, role: "etudiant" });
        setNotification({ message: `✅ Bienvenue ${etudiant.nom}!`, type: "success" });
        setShowAuthModal(false);
        return;
      }
    }
    
    setNotification({ message: "❌ Email ou mot de passe incorrect", type: "error" });
  };

  const handleLogout = () => {
    setUser(null);
    setNotification({ message: "👋 Déconnecté avec succès!", type: "success" });
    setPage("accueil");
  };

  const handleRegister = (data) => {
    // 🚫 EMPÊCHER L'INSCRIPTION DES ADMINS
    if (data.role === "admin") {
      setNotification({ 
        message: "❌ L'inscription des comptes administrateur est désactivée. Veuillez contacter l'administrateur système.", 
        type: "error" 
      });
      return;
    }
    
    // ✅ INSCRIPTION ENTREPRISES
    if (data.role === "entreprise") {
      // Vérifier si l'email existe déjà
      const emailExists = entreprises.some(e => e.email === data.email);
      if (emailExists) {
        setNotification({ message: "❌ Cet email est déjà utilisé!", type: "error" });
        return;
      }
      
      const newEntreprise = { 
        id: entreprises.length + 1, 
        ...data, 
        logo: "🏢",
        password: data.password
      };
      setEntreprises([...entreprises, newEntreprise]);
      setNotification({ message: "✅ Inscription réussie! Connectez-vous.", type: "success" });
    } 
    // ✅ INSCRIPTION ÉTUDIANTS
    else if (data.role === "etudiant") {
      // Vérifier si l'email existe déjà
      const emailExists = etudiants.some(e => e.email === data.email);
      if (emailExists) {
        setNotification({ message: "❌ Cet email est déjà utilisé!", type: "error" });
        return;
      }
      
      const newEtudiant = { 
        id: etudiants.length + 1, 
        ...data,
        password: data.password
      };
      setEtudiants([...etudiants, newEtudiant]);
      setNotification({ message: "✅ Inscription réussie! Connectez-vous.", type: "success" });
    }
    setAuthType("login");
  };

  const handleAjouterOffre = (nouvelleOffre) => {
    setOffres([...offres, nouvelleOffre]);
    setNotification({ message: `✅ Offre "${nouvelleOffre.titre}" publiée!`, type: "success" });
  };

  const handleSupprimerOffre = (offreId) => {
    setOffres(offres.filter(o => o.id !== offreId));
    setNotification({ message: "✅ Offre supprimée!", type: "success" });
  };

  const handleUpdateCandidature = (candidatureId, statut) => {
    setCandidatures(candidatures.map(c => c.id === candidatureId ? { ...c, statut } : c));
    setNotification({ message: `✅ Candidature ${statut === "acceptee" ? "acceptée" : "refusée"}!`, type: "success" });
  };

  const handlePostuler = (offre, etudiantId) => {
    const nouvelleCandidature = {
      id: candidatures.length + 1,
      offreId: offre.id,
      offreTitre: offre.titre,
      entreprise: offre.entreprise,
      etudiantId: user.id,
      etudiantNom: user.nom,
      email: user.email,
      date: new Date().toLocaleDateString('fr-FR'),
      statut: "en_attente"
    };
    setCandidatures([...candidatures, nouvelleCandidature]);
    setNotification({ message: `✅ Candidature envoyée pour "${offre.titre}"!`, type: "success" });
  };

  const handleEnvoyerCandidature = (titre) => {
    setNotification({ message: `✅ Candidature envoyée pour "${titre}" avec succès !`, type: "success" });
  };
  
  const handleUpdateProfil = (updatedEtudiant) => {
    setEtudiants(etudiants.map(e => e.id === updatedEtudiant.id ? updatedEtudiant : e));
    if (user && user.id === updatedEtudiant.id) {
      setUser({ ...user, nom: updatedEtudiant.nom });
    }
    setNotification({ message: "✅ Profil mis à jour!", type: "success" });
  };
   
  const handleChangePassword = (etudiantId, newPassword) => {
    setEtudiants(etudiants.map(e => e.id === etudiantId ? { ...e, password: newPassword } : e));
    setNotification({ message: "✅ Mot de passe changé!", type: "success" });
  };

  const handleAccepterCandidat = (candidatureId) => {
    console.log("Candidature acceptée:", candidatureId);
  };

  const handleRefuserCandidat = (candidatureId) => {
    console.log("Candidature refusée:", candidatureId);
  };

  const handleEnvoyerContact = () => {
    setNotification({ message: "📧 Votre message a été envoyé avec succès !", type: "success" });
  };
  
  const handlePostulerClick = (offre) => {
    if (!user) {
      setAuthUserType("etudiant");
      setAuthType("login");
      setShowAuthModal(true);
      setModalPostuler(offre);
    } else if (user.role === "etudiant") {
      setModalPostuler(offre);
    } else {
      setNotification({ message: "❌ Seuls les étudiants peuvent postuler aux stages!", type: "error" });
    }
  };

  const openAuthModal = (userType, type) => {
    setAuthUserType(userType);
    setAuthType(type);
    setShowAuthModal(true);
  };

  // Configuration du ModalAuth pour cacher l'onglet "S'inscrire" pour les admins
  const getModalConfig = () => {
    // Pour les admins, on force le type à "login" et on cache l'inscription
    if (authUserType === "admin") {
      return {
        forceLogin: true,
        hideRegister: true
      };
    }
    return {
      forceLogin: false,
      hideRegister: false
    };
  };

  const renderDashboard = () => {
    if (!user) return null;
    
    // Les admins utilisent le DashboardAdmin existant
    if (user.role === "admin") {
      return (
        <DashboardAdmin 
          offres={offres}
          entreprises={entreprises}
          darkMode={darkMode}
          candidatures={candidatures}
          onUpdateOffre={() => {}}
          onDeleteOffre={handleSupprimerOffre}
          onUpdateCandidature={handleUpdateCandidature}
          onLogout={handleLogout}
          adminNom={user.nom}
        />
      );
    }
    
    if (user.role === "entreprise") {
      const entreprise = entreprises.find(e => e.id === user.id);
      const offresEntreprise = offres.filter(o => o.entreprise === entreprise?.nom);
      const candidaturesEntreprise = candidatures.filter(c => {
        const offre = offres.find(o => o.id === c.offreId);
        return offre?.entreprise === entreprise?.nom;
      });
      return (
        <DashboardEntreprise 
          entreprise={entreprise}
          offres={offresEntreprise}
          darkMode={darkMode}
          candidatures={candidaturesEntreprise}
          onAjouterOffre={handleAjouterOffre}
          onSupprimerOffre={handleSupprimerOffre}
          onLogout={handleLogout}
          onAccepterCandidat={handleAccepterCandidat}
          onRefuserCandidat={handleRefuserCandidat}
        />
      );
    }
    
    if (user.role === "etudiant") {
      const etudiant = etudiants.find(e => e.id === user.id);
      return (
        <DashboardEtudiant 
          etudiant={etudiant}
          offres={offres}
          darkMode={darkMode}
          candidatures={candidatures}
          onPostuler={(offre) => handlePostuler(offre, user.id)}
          onLogout={handleLogout}
          onUpdateProfil={handleUpdateProfil}
          onChangePassword={handleChangePassword}
        />
      );
    }
    
    return null;
  };

  const modalConfig = getModalConfig();
  
// COMPOSANT SCROLL TO TOP 

function ScrollToTop({ darkMode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 p-4 rounded-full text-4xl font-bold shadow-lg transition-all hover:scale-110 z-50 ${
        darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
      } text-white`}
    >
      ↑
    </button>
  );
}

  return (
    <div className={`min-h-screen fade-in ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'} sticky top-0 z-50 transition-colors duration-300`}>
                  <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("accueil")}>
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp size={16} className="text-white" />
                      </div>
                      <h1 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Stag.io</h1>
                    </div>
                    
                    {!user && (
                      <div className="flex gap-6">
                        <button onClick={() => setPage("accueil")} className={`${page === "accueil" ? (darkMode ? "text-blue-400" : "text-blue-600") : (darkMode ? "text-gray-300" : "text-gray-600")} ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-all duration-300 hover:scale-110 font-semibold`}>
                          Accueil
                        </button>
                        <button onClick={() => setPage("offres")} className={`${page === "offres" ? (darkMode ? "text-blue-400" : "text-blue-600") : (darkMode ? "text-gray-300" : "text-gray-600")} ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-all duration-300 hover:scale-110 font-semibold`}>
                          Offres
                        </button>
                      </div>
                    )}
                    
                    <div className="flex gap-3 items-center">
                      {/* Bouton mode sombre */}
                      <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        aria-label="Toggle dark mode"
                      >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                      </button>
          
                      {user ? (
                        <div className="flex items-center gap-4">
                        
                          <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                            Déconnexion
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
            {/* Bouton Espace Étudiant */}
            <button 
              onClick={() => openAuthModal("etudiant", "login")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${
                darkMode 
                  ? 'bg-gray-800 text-emerald-400 border-emerald-400 hover:bg-gray-700' 
                  : 'bg-white text-emerald-600 border-emerald-500 hover:bg-emerald-50'
              } border rounded-md font-medium transition-all duration-200 hover:scale-105`}
            >
              <GraduationCap size={15} />
              Étudiant
            </button>
            
            {/* Bouton Espace Entreprise */}
            <button 
              onClick={() => openAuthModal("entreprise", "login")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-105"
            >
              <Building2 size={15} />
              Entreprise
            </button>
          
            {/* Bouton Espace Admin - UNIQUEMENT CONNEXION */}
            <button 
              onClick={() => openAuthModal("admin", "login")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition-all duration-200 hover:scale-105"
            >
              <Shield size={15} />
              Admin
            </button>
          </div>
                      )}
                    </div>
                  </div>
                </nav>
      
      {user ? (
        renderDashboard()
      ) : (
        <>
          {page === "accueil" && (
            <PageAccueil 
              allerAuxOffres={() => setPage("offres")} 
              darkMode={darkMode}
              onEnvoyerContact={handleEnvoyerContact}
              onOpenEspaceEtudiant={() => openAuthModal("etudiant", "login")}
              onOpenEspaceEntreprise={() => openAuthModal("entreprise", "login")}
              onOpenEspaceAdmin={() => openAuthModal("admin", "login")}
              setPage={setPage}
            />
          )}
          
          {page === "offres" && (
            <PageOffres 
              onPostulerClick={handlePostulerClick}
              darkMode={darkMode}
              offres={offres}
              setPage={setPage}
            />
          )}
        </>
      )}
      
      {/* Modal Postuler */}
      {modalPostuler && (
        <ModalPostuler 
          offre={modalPostuler}
          onClose={() => setModalPostuler(null)}
          onEnvoyer={handleEnvoyerCandidature}
          isLoggedIn={!!user}
          onOpenAuth={() => {
            setAuthUserType("etudiant");
            setAuthType("login");
            setShowAuthModal(true);
          }}
        />
      )}
      
      {/* Modal Auth - avec configuration spéciale pour les admins */}
      {showAuthModal && (
        <ModalAuth 
          type={authType}
          darkMode={darkMode}
          userType={authUserType}
          forceLogin={authUserType === "admin"} // Force le mode login pour les admins
          hideRegister={authUserType === "admin"} // Cache l'onglet inscription pour les admins
          onClose={() => {
            setShowAuthModal(false);
            setModalPostuler(null);
          }}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
      
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <ScrollToTop darkMode={darkMode} />
    </div>
  );
}

export default App;