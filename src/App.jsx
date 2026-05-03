import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom'; // Ajoutez ces imports
import { TrendingUp, Building2, GraduationCap, LogOut, UserCog, Moon, Sun, Shield } from "lucide-react";
import { Notification } from './Components/Notification';
import { ModalAuth } from './Components/ModalAuth';
import { ModalPostuler } from './Components/ModalPostuler';
import { PageAccueil } from './pages/Accueil';
import { PageOffres } from './pages/Offres';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardEntreprise } from './pages/DashboardEntreprise';
import { DashboardEtudiant } from './pages/DashboardEtudiant';
import { api } from './api';


function App() {
  const navigate = useNavigate(); // Ajoutez cette ligne
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
  
  const [offres, setOffres] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
 
  const [loading, setLoading] = useState(true);

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
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offresRes = await api.getOffres();
        if (offresRes.ok) {
          const offresData = await offresRes.json();
          setOffres(offresData.offres || []);
        }
      } catch (error) {
        console.error('Erreur chargement offres:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("🟢 user chargé depuis localStorage:", parsedUser);
    }
  }, []);

  // ========== LOGIN avec API ==========
 const handleLogin = async (email, password) => {
  try {
    const response = await api.login({ email, password });
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setShowAuthModal(false);

      console.log("🔵 Utilisateur connecté:", data.user);

      if (data.user.role === "etudiant") {
        navigate("/student/dashboard");
      } else if (data.user.role === "entreprise") {
        navigate("/company/dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");

        // تحميل بيانات admin
        fetchAdminProfile();
        fetchAdminStats();
        fetchAllApplications();
        fetchAllStudents();
        fetchAllCompanies();
      }

    } else {
      setNotification({ message: data.message || "❌ Email ou mot de passe incorrect", type: "error" });
    }

  } catch (error) {
    console.error(error);
    setNotification({ message: "❌ Erreur serveur", type: "error" });
  }
};
// Ajoute ces fonctions dans App.jsx après les autres fonctions

// ========== FONCTIONS ADMIN ==========
const fetchAdminStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.getAdminStats(token);
    const data = await response.json();
    if (response.ok && data.success) {
      console.log("📊 Stats admin:", data.stats);
    }
  } catch (error) {
    console.error('Erreur chargement stats admin:', error);
  }
};

const fetchAllApplications = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.getAllApplications(token);
    const data = await response.json();
    if (response.ok) {
      setCandidatures(data.applications || []);
      console.log("📋 Candidatures admin:", data.applications?.length);
    }
  } catch (error) {
    console.error('Erreur chargement candidatures admin:', error);
  }
};

const fetchAllStudents = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.getAllStudents(token);
    const data = await response.json();
    if (response.ok) {
      setEtudiants(data.students || []);
    }
  } catch (error) {
    console.error('Erreur chargement étudiants admin:', error);
  }
};

const fetchAllCompanies = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.getAllCompanies(token);
    const data = await response.json();
    if (response.ok) {
      setEntreprises(data.companies || []);
    }
  } catch (error) {
    console.error('Erreur chargement entreprises admin:', error);
  }
};

const fetchAdminProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.getAdminProfile(token);
    const data = await response.json();
    if (response.ok && data.success) {
      console.log("👤 Profil admin chargé:", data.admin);
    }
  } catch (error) {
    console.error('Erreur chargement profil admin:', error);
  }
};

const validateInternship = async (applicationId) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.validateInternship(token, applicationId);
    const data = await response.json();
    if (response.ok) {
      setNotification({ message: "✅ Stage validé par l'administration", type: "success" });
      fetchAllApplications(); // Rafraîchir
      fetchAdminStats(); // Rafraîchir les stats
    } else {
      setNotification({ message: data.message || "❌ Erreur lors de la validation", type: "error" });
    }
  } catch (error) {
    console.error('Erreur validation:', error);
    setNotification({ message: "❌ Erreur de connexion", type: "error" });
  }
};

const toggleUserStatus = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.toggleUserStatus(token, userId);
    const data = await response.json();
    if (response.ok) {
      setNotification({ message: data.message, type: "success" });
      fetchAllStudents();
      fetchAllCompanies();
    } else {
      setNotification({ message: data.message || "❌ Erreur", type: "error" });
    }
  } catch (error) {
    console.error('Erreur:', error);
    setNotification({ message: "❌ Erreur de connexion", type: "error" });
  }
};

const deleteOfferByAdmin = async (offerId) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.deleteOfferByAdmin(token, offerId);
    const data = await response.json();
    if (response.ok) {
      setNotification({ message: "✅ Offre supprimée par l'administration", type: "success" });
      setOffres(offres.filter(o => o.id !== offerId));
    } else {
      setNotification({ message: data.message || "❌ Erreur", type: "error" });
    }
  } catch (error) {
    console.error('Erreur:', error);
    setNotification({ message: "❌ Erreur de connexion", type: "error" });
  }
};

const handleUpdateCandidatureStatus = async (candidatureId, status, conventionData = null) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    // Mettre à jour le statut
    const response = await api.updateApplicationStatus(candidatureId, token, status);
    const data = await response.json();
    
    if (response.ok) {
      setNotification({ 
        message: `✅ Candidature ${status === "acceptee" ? "acceptée" : "refusée"}!`, 
        type: "success" 
      });
      
      // Si acceptée avec convention, télécharger/uploader la convention
      if (status === "acceptee" && conventionData?.conventionFile) {
        // Ici vous pouvez uploader le fichier vers le serveur
        const formData = new FormData();
        formData.append('convention', conventionData.conventionFile);
        // Envoyer la convention au backend
        await api.uploadConvention(token, candidatureId, formData);
      }
      
      fetchAllApplications(); // Rafraîchir la liste
      fetchAdminStats(); // Rafraîchir les stats
    } else {
      setNotification({ message: data.message || "❌ Erreur", type: "error" });
    }
  } catch (error) {
    console.error('Erreur:', error);
    setNotification({ message: "❌ Erreur de connexion", type: "error" });
  }
};
 const handleRegister = async (data) => {
  // 🚫 EMPÊCHER L'INSCRIPTION DES ADMINS
  if (data.role === "admin") {
    setNotification({ 
      message: "❌ L'inscription des comptes administrateur est désactivée.", 
      type: "error" 
    });
    return;
  }
  
  try {
    const response = await api.register(data);
    const result = await response.json();
    
    if (response.ok) {
      // ✅ Connexion automatique après inscription
      // Si l'API retourne un token directement
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setShowAuthModal(false);
        
        // Redirection selon le rôle
        if (result.user.role === "etudiant") {
          navigate("/student/dashboard");
        } else if (result.user.role === "entreprise") {
          navigate("/company/dashboard");
        }
        setNotification({ message: "✅ Inscription réussie ! Bienvenue !", type: "success" });
      } else {
        // Si l'API ne retourne pas de token, rediriger vers login
        setNotification({ message: "✅ Inscription réussie! Connectez-vous maintenant.", type: "success" });
        setAuthType("login");
      }
    } else {
      setNotification({ message: result.message || "❌ Erreur lors de l'inscription", type: "error" });
    }
  } catch (error) {
    console.error(error);
    setNotification({ message: "❌ Erreur de connexion au serveur", type: "error" });
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setNotification({ message: "👋 Déconnecté avec succès!", type: "success" });
    navigate("/"); // Redirection vers l'accueil
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
      etudiantId: user?.id,
      etudiantNom: user?.nom,
      email: user?.email,
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
   
  const handleChangePassword = async (etudiantId, newPassword) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.changePassword(token, {
          ancienMotDePasse: "",
          nouveauMotDePasse: newPassword
        });
        if (response.ok) {
          setNotification({ message: "✅ Mot de passe changé!", type: "success" });
        } else {
          setNotification({ message: "❌ Erreur lors du changement", type: "error" });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setEtudiants(etudiants.map(e => e.id === etudiantId ? { ...e, password: newPassword } : e));
      setNotification({ message: "✅ Mot de passe changé!", type: "success" });
    }
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

  // Gestion du profil admin
const handleUpdateProfilAdmin = (updatedProfil) => {
  setNotification({ message: "✅ Profil administrateur mis à jour!", type: "success" });
  // Si vous avez un state pour l'admin, mettez-le à jour ici
};

const handleChangePasswordAdmin = (newPassword) => {
  setNotification({ message: "✅ Mot de passe administrateur changé!", type: "success" });
};

  const openAuthModal = (userType, type) => {
    setAuthUserType(userType);
    setAuthType(type);
    setShowAuthModal(true);
  };

  const getModalConfig = () => {
    if (authUserType === "admin") {
      return { forceLogin: true, hideRegister: true };
    }
    return { forceLogin: false, hideRegister: false };
  };

  // Composant pour la navigation protégée
 // App.jsx - Modifie ProtectedRoute
const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  
  // ⚠️ Ne pas appeler navigate pendant le render
  // Utilise useEffect à la place
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate("/");
    }
  }, [user, allowedRoles, navigate]);
  
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  
  return children;
};

  const handleSaveEvaluation = (candidatureId, evaluationData) => {
  setCandidatures(candidatures.map(c => 
    c.id === candidatureId ? { ...c, evaluation: evaluationData } : c
  ));
  setNotification({ message: "✅ Évaluation enregistrée avec succès!", type: "success" });
};

  const modalConfig = getModalConfig();
  
  // SCROLL TO TOP COMPONENT
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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="spinner"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen fade-in ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'} sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Stag.io</h1>
          </div>
          
          {!user && (
            <div className="flex gap-6">
              <button onClick={() => navigate("/")} className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-all duration-300 hover:scale-110 font-semibold`}>
                Accueil
              </button>
              <button onClick={() => navigate("/offres")} className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-all duration-300 hover:scale-110 font-semibold`}>
                Offres
              </button>
            </div>
          )}
          
          <div className="flex gap-3 items-center">
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
                
                <button 
                  onClick={() => openAuthModal("entreprise", "login")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                >
                  <Building2 size={15} />
                  Entreprise
                </button>
              
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
      
      {/* Routes avec React Router */}
      <Routes>
        <Route path="/" element={
          <PageAccueil 
            allerAuxOffres={() => navigate("/offres")} 
            darkMode={darkMode}
            onEnvoyerContact={handleEnvoyerContact}
            onOpenEspaceEtudiant={() => openAuthModal("etudiant", "login")}
            onOpenEspaceEntreprise={() => openAuthModal("entreprise", "login")}
            onOpenEspaceAdmin={() => openAuthModal("admin", "login")}
            setPage={setPage}
          />
        } />
        
        <Route path="/offres" element={
          <PageOffres 
            onPostulerClick={handlePostulerClick}
            darkMode={darkMode}
            offres={offres}
            setPage={setPage}
          />
        } />
        
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={["etudiant"]}>
            <DashboardEtudiant darkMode={darkMode} />
          </ProtectedRoute>
        } />
        
       <Route path="/company/dashboard" element={
  <ProtectedRoute allowedRoles={["entreprise"]}>
    <DashboardEntreprise 
      darkMode={darkMode}
      entreprise={user}  // ← Passez l'utilisateur comme entreprise
      offres={offres}    // ← Passez les offres
      candidatures={candidatures}  // ← Passez les candidatures
      onAjouterOffre={handleAjouterOffre}
      onSupprimerOffre={handleSupprimerOffre}
      onLogout={handleLogout}
      onUpdateProfil={handleUpdateProfil}
      onChangePassword={handleChangePassword}
      onAccepterCandidat={handleAccepterCandidat}
      onRefuserCandidat={handleRefuserCandidat}
      onSaveEvaluation={handleSaveEvaluation}
    />
  </ProtectedRoute>
} />

        
      <Route path="/admin/dashboard" element={
  <ProtectedRoute allowedRoles={["admin"]}>
    <DashboardAdmin 
      darkMode={darkMode}
      offres={offres}
      entreprises={entreprises}
      candidatures={candidatures}
      onDeleteOffre={deleteOfferByAdmin}
      onUpdateCandidature={handleUpdateCandidatureStatus}
      onLogout={handleLogout}
      onUpdateProfil={handleUpdateProfilAdmin}
      onChangePassword={handleChangePasswordAdmin}
    />
  </ProtectedRoute>
} />
</Routes>
      
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
      
     

{showAuthModal && (
  <ModalAuth 
    type={authType}
    darkMode={darkMode}
    userType={authUserType}
    forceLogin={authUserType === "admin"}
    hideRegister={authUserType === "admin"}
    onClose={() => {
      setShowAuthModal(false);
      setModalPostuler(null);
    }}
    onLogin={handleLogin}      // ⚠️ Assurez-vous que c'est bien passé
    onRegister={handleRegister} // ⚠️ Assurez-vous que c'est bien passé
  />
)}
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <ScrollToTop darkMode={darkMode} />
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #10b981; width: 40px; height: 40px; animation: spin 0.8s linear infinite; margin: 0 auto; }
      `}</style>
    </div>
  );
}

export default App;