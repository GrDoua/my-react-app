import { useState } from 'react';
import { X, Eye, EyeOff, Building2, GraduationCap } from "lucide-react";

export function ModalAuth({ type, onClose, onLogin, onRegister, userType, darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [filiere, setFiliere] = useState("");
  const [universite, setUniversite] = useState("");
  const [secteur, setSecteur] = useState("");
  const [competences, setCompetences] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentType, setCurrentType] = useState(type);

  // Thème basé sur darkMode
  const theme = {
    bg: darkMode ? '#1f2937' : '#ffffff',
    border: darkMode ? '#374151' : '#e5e7eb',
    text: darkMode ? '#f3f4f6' : '#1f2937',
    textLight: darkMode ? '#9ca3af' : '#6b7280',
    inputBg: darkMode ? '#374151' : '#ffffff',
    inputBorder: darkMode ? '#4b5563' : '#e5e7eb',
    hoverBg: darkMode ? '#374151' : '#f3f4f6',
    iconColor: darkMode ? '#60a5fa' : '#2563eb'
  };

  const validateLogin = () => {
    let newErrors = {};
    if (!email.trim()) newErrors.email = "Email obligatoire";
    if (!password.trim()) newErrors.password = "Mot de passe obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    let newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom complet obligatoire";
    if (!email.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email invalide";
    }
    if (!password.trim() || password.length < 6) {
      newErrors.password = "Mot de passe (min 6 caractères)";
    }
    if (userType === "etudiant") {
      if (!filiere.trim()) newErrors.filiere = "Filière obligatoire";
      if (!universite.trim()) newErrors.universite = "Université obligatoire";
    }
    if (userType === "entreprise") {
      if (!secteur.trim()) newErrors.secteur = "Secteur d'activité obligatoire";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentType === "login") {
      if (validateLogin()) onLogin(email, password, userType);
    } else {
      if (validateRegister()) {
        const userData = { nom, email, password, role: userType };
        if (userType === "etudiant") {
          userData.filiere = filiere;
          userData.universite = universite;
          userData.competences = competences.split(",").map(c => c.trim()).filter(c => c);
        }
        if (userType === "entreprise") {
          userData.secteur = secteur;
        }
        onRegister(userData);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-xl max-w-md w-full transform transition-all duration-300 shadow-lg"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-2">
            {userType === "etudiant" ? (
              <GraduationCap size={22} style={{ color: theme.iconColor }} />
            ) : (
              <Building2 size={22} style={{ color: theme.iconColor }} />
            )}
            <h3 className="font-bold text-lg" style={{ color: theme.text }}>
              {userType === "etudiant" ? "Espace Étudiant" : "Espace Entreprise"}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full transition"
            style={{ color: theme.textLight }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.hoverBg}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {currentType === "register" && (
            <input
              type="text"
              placeholder="Nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errors.nom ? "border-red-500" : ""
              }`}
              style={{ 
                backgroundColor: theme.inputBg, 
                color: theme.text, 
                borderColor: errors.nom ? '#ef4444' : theme.inputBorder 
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              errors.email ? "border-red-500" : ""
            }`}
            style={{ 
              backgroundColor: theme.inputBg, 
              color: theme.text, 
              borderColor: errors.email ? '#ef4444' : theme.inputBorder 
            }}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errors.password ? "border-red-500" : ""
              }`}
              style={{ 
                backgroundColor: theme.inputBg, 
                color: theme.text, 
                borderColor: errors.password ? '#ef4444' : theme.inputBorder 
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 transition"
              style={{ color: theme.textLight }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.textLight}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {currentType === "register" && userType === "etudiant" && (
            <>
              <input
                type="text"
                placeholder="Filière"
                value={filiere}
                onChange={(e) => setFiliere(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.filiere ? "border-red-500" : ""
                }`}
                style={{ 
                  backgroundColor: theme.inputBg, 
                  color: theme.text, 
                  borderColor: errors.filiere ? '#ef4444' : theme.inputBorder 
                }}
              />
              <input
                type="text"
                placeholder="Université"
                value={universite}
                onChange={(e) => setUniversite(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.universite ? "border-red-500" : ""
                }`}
                style={{ 
                  backgroundColor: theme.inputBg, 
                  color: theme.text, 
                  borderColor: errors.universite ? '#ef4444' : theme.inputBorder 
                }}
              />
              <input
                type="text"
                placeholder="Compétences (séparées par des virgules)"
                value={competences}
                onChange={(e) => setCompetences(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                style={{ 
                  backgroundColor: theme.inputBg, 
                  color: theme.text, 
                  borderColor: theme.inputBorder 
                }}
              />
            </>
          )}

          {currentType === "register" && userType === "entreprise" && (
            <input
              type="text"
              placeholder="Secteur d'activité"
              value={secteur}
              onChange={(e) => setSecteur(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errors.secteur ? "border-red-500" : ""
              }`}
              style={{ 
                backgroundColor: theme.inputBg, 
                color: theme.text, 
                borderColor: errors.secteur ? '#ef4444' : theme.inputBorder 
              }}
            />
          )}

          {errors.nom && <p className="text-red-500 text-sm -mt-2">{errors.nom}</p>}
          {errors.email && <p className="text-red-500 text-sm -mt-2">{errors.email}</p>}
          {errors.password && <p className="text-red-500 text-sm -mt-2">{errors.password}</p>}
          {errors.filiere && <p className="text-red-500 text-sm -mt-2">{errors.filiere}</p>}
          {errors.universite && <p className="text-red-500 text-sm -mt-2">{errors.universite}</p>}
          {errors.secteur && <p className="text-red-500 text-sm -mt-2">{errors.secteur}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {currentType === "login" ? "Se connecter" : "S'inscrire"}
          </button>

          {currentType === "login" && (
            <div className="text-center pt-2 border-t" style={{ borderColor: theme.border }}>
              <p className="text-sm" style={{ color: theme.textLight }}>
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentType("register")}
                  className="font-semibold hover:underline transition"
                  style={{ color: theme.iconColor }}
                >
                  Inscrivez-vous
                </button>
              </p>
            </div>
          )}

          {currentType === "register" && (
            <div className="text-center pt-2 border-t" style={{ borderColor: theme.border }}>
              <p className="text-sm" style={{ color: theme.textLight }}>
                Déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentType("login")}
                  className="font-semibold hover:underline transition"
                  style={{ color: theme.iconColor }}
                >
                  Connectez-vous
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}