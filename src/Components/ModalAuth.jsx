import { useState } from 'react';
import { X, Eye, EyeOff, Building2, GraduationCap } from "lucide-react";

export function ModalAuth({ type, onClose, onLogin, onRegister, userType }) {
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
      <div className="bg-white rounded-xl max-w-md w-full transform transition-all duration-300 shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            {userType === "etudiant" ? (
              <GraduationCap size={22} className="text-blue-600" />
            ) : (
              <Building2 size={22} className="text-blue-600" />
            )}
            <h3 className="font-bold text-lg text-gray-800">
              {userType === "etudiant" ? "Espace Étudiant" : "Espace Entreprise"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
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
                errors.nom ? "border-red-500" : "border-gray-200"
              }`}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  errors.filiere ? "border-red-500" : "border-gray-200"
                }`}
              />
              <input
                type="text"
                placeholder="Université"
                value={universite}
                onChange={(e) => setUniversite(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.universite ? "border-red-500" : "border-gray-200"
                }`}
              />
              <input
                type="text"
                placeholder="Compétences (séparées par des virgules)"
                value={competences}
                onChange={(e) => setCompetences(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                errors.secteur ? "border-red-500" : "border-gray-200"
              }`}
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
            <div className="text-center pt-2 border-t">
              <p className="text-gray-600 text-sm">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentType("register")}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Inscrivez-vous
                </button>
              </p>
            </div>
          )}

          {currentType === "register" && (
            <div className="text-center pt-2 border-t">
              <p className="text-gray-600 text-sm">
                Déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentType("login")}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
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