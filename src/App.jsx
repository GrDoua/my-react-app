import { useState } from 'react';
import { TrendingUp, Building2, GraduationCap, LogOut, UserCog, Moon, Sun } from "lucide-react";
import { offresData, entreprisesData, etudiantsData, candidaturesData } from './data/data';
import { Notification } from './Components/Notification';
import { ModalAuth } from './Components/ModalAuth';
import { ModalPostuler } from './Components/ModalPostuler';
import { PageAccueil } from './pages/Accueil';
import { PageOffres } from './pages/Offres';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardEntreprise } from './pages/DashboardEntreprise';
import { DashboardEtudiant } from './pages/DashboardEtudiant';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [authUserType, setAuthUserType] = useState("etudiant");
  const [notification, setNotification] = useState(null);
  const [modalPostuler, setModalPostuler] = useState(null);
  const [page, setPage] = useState("accueil");
  const [darkMode, setDarkMode] = useState(() => {
    // Vérifier si l'utilisateur a déjà une préférence
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [offres, setOffres] = useState(offresData);
  const [entreprises, setEntreprises] = useState(entreprisesData);
  const [etudiants, setEtudiants] = useState(etudiantsData);
  const [candidatures, setCandidatures] = useState(candidaturesData);

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

  // Initialiser le mode sombre au démarrage
  useState(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogin = (email, password, userType) => {
    // Vérifier admin
    if (email === "admin@stag.io" && password === "admin123") {
      setUser({ id: 0, nom: "Administrateur", email, role: "admin" });
      setNotification({ message: "✅ Bienvenue Administrateur!", type: "success" });
      setShowAuthModal(false);
      return;
    }
    
    if (userType === "entreprise") {
      const entreprise = entreprises.find(e => e.email === email && e.password === password);
      if (entreprise) {
        setUser({ id: entreprise.id, nom: entreprise.nom, email, role: "entreprise" });
        setNotification({ message: `✅ Bienvenue ${entreprise.nom}!`, type: "success" });
        setShowAuthModal(false);
        return;
      }
    }
    
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
    if (data.role === "entreprise") {
      const newEntreprise = { 
        id: entreprises.length + 1, 
        ...data, 
        logo: "🏢",
        password: data.password
      };
      setEntreprises([...entreprises, newEntreprise]);
    } else {
      const newEtudiant = { 
        id: etudiants.length + 1, 
        ...data,
        password: data.password
      };
      setEtudiants([...etudiants, newEtudiant]);
    }
    setNotification({ message: "✅ Inscription réussie! Connectez-vous.", type: "success" });
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

  const renderDashboard = () => {
    if (!user) return null;
    
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
        />
      );
    }
    
    if (user.role === "entreprise") {
      const entreprise = entreprises.find(e => e.id === user.id);
      return (
        <DashboardEntreprise 
          entreprise={entreprise}
          offres={offres}
          darkMode={darkMode}
          candidatures={candidatures}
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

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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
                <div className={`flex items-center gap-2 px-3 py-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full transition-colors duration-300`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm">
                    {user.role === "entreprise" ? "🏢" : user.role === "admin" ? "👨‍💼" : "👨‍🎓"}
                  </div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{user.nom}</span>
                </div>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => openAuthModal("etudiant", "login")}
                  className={`flex items-center gap-2 px-5 py-2 ${darkMode ? 'bg-gray-800 text-blue-400 border-blue-400' : 'bg-white text-blue-600 border-blue-600'} border-2 rounded-lg font-semibold hover:transition-all duration-300 hover:scale-105`}
                >
                  <GraduationCap size={18} />
                  Espace Étudiant
                </button>
                
                <button 
                  onClick={() => openAuthModal("entreprise", "login")}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                >
                  <Building2 size={18} />
                  Espace Entreprise
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
      
      {/* Modal Auth */}
      {showAuthModal && (
        <ModalAuth 
          type={authType}
          darkMode={darkMode}
          userType={authUserType}
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
    </div>
  );
}

export default App;