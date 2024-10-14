import React from 'react';
import { clear } from 'idb-keyval';

const UserForm = ({ nom, setNom, prenom, setPrenom, annee, setAnnee, ecole, setEcole, logoEcole, setActions }) => {
    const handleReset = async () => {
        localStorage.clear();

        await clear();

        setNom('');
        setPrenom('');
        setAnnee('1');
        setEcole('ESGI');
        setActions([]);
    };

    return (
        <div className="w-full xl:w-1/3 xl:pr-4 xl:border-r border-gray-300 bg-white rounded-xl p-5 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="w-full h-40 mb-4 flex items-center justify-center">
                {logoEcole ? (
                    <img src={logoEcole} alt="Logo École" className="object-contain h-full" />
                ) : (
                    <p>Logo de l'école</p>
                )}
            </div>
            {/* Éléments centrés */}
            <div className="flex flex-col items-center">
                {/* École */}
                <div className="mb-4 w-full">
                    <label className="block mb-1 font-semibold text-center">École</label>
                    <select
                        value={ecole}
                        onChange={(e) => setEcole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ESGI">ESGI</option>
                        <option value="EFAB">EFAB</option>
                        <option value="Efet Studio Créa">Efet Studio Créa</option>
                        <option value="EIML">EIML Paris</option>
                        <option value="ESUPCOM">ESUPCOM</option>
                        <option value="Maestris BTS">Maestris BTS</option>
                        <option value="PPA">PPA</option>
                        <option value="PPA-SPORT">PPA Sport</option>
                        <option value="ISA">ISA</option>
                        <option value="ISFJ">ISFJ</option>
                        <option value="MODART">MODART</option>
                        <option value="ENGDE">ENGDE</option>
                        {/* Ajouter d'autres écoles si nécessaire */}
                    </select>
                </div>
                {/* Année */}
                <div className="mb-4 w-full">
                    <label className="block mb-1 font-semibold text-center">Année</label>
                    <select
                        value={annee}
                        onChange={(e) => setAnnee(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                {/* Nom */}
                <div className="mb-4 w-full">
                    <label className="block mb-1 font-semibold text-center">Nom</label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Nom"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {/* Prénom */}
                <div className="mb-4 w-full">
                    <label className="block mb-1 font-semibold text-center">Prénom</label>
                    <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        placeholder="Prénom"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {/* Bouton Reset */}
                <div className="mb-4 w-full">
                    <button
                        onClick={handleReset}
                        className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
