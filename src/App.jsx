import React, { useState, useEffect, useRef } from 'react';
import 'tailwindcss/tailwind.css';
import { useDropzone } from 'react-dropzone';
import html2pdf from 'html2pdf.js';
import getCroppedImg from './component/cropImage';
import UserForm from './component/UserForm';
import PointsSummary from './component/PointsSummary';
import ActionTable from './component/ActionTable';
import ActionModal from './component/ActionModal';
import HelpAccordions from './component/HelpAccordions';
import Header from './component/Header';
import { set, get, del } from 'idb-keyval';
import Modal from 'react-modal';
Modal.setAppElement('#root');

function DossierForm() {
  const [nom, setNom] = useState(() => localStorage.getItem('nom') || '');
  const [prenom, setPrenom] = useState(() => localStorage.getItem('prenom') || '');
  const [annee, setAnnee] = useState(() => localStorage.getItem('annee') || '1');
  const [ecole, setEcole] = useState(() => localStorage.getItem('ecole') || 'ESGI');
  const [classe, setClasse] = useState('');
  const [logoEcole, setLogoEcole] = useState('/logos/esgi.svg');
  const [actions, setActions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAction, setNewAction] = useState({
    axe: '',
    description: '',
    justificatif: null,
    justificatifPreview: '',
  });

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const contentRef = useRef(null);

  const [openAccordion, setOpenAccordion] = useState(null);

  const [totalPointsPerAxe, setTotalPointsPerAxe] = useState({});

  const axeLimits = {
    Entreprise: 8,
    'Challenge / Communication': 8,
    "Esprit d'équipe": 6,
    'Ouverture sur l’extérieur': 5,
  };


  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const loadActions = async () => {
      const savedActions = localStorage.getItem('actions');
      if (savedActions) {
        const parsedActions = JSON.parse(savedActions);

        const actionsWithImages = await Promise.all(
          parsedActions.map(async (action) => {
            const imageBase64 = await get(`image-${action.id}`);
            return {
              ...action,
              justificatifPreview: imageBase64 || '',
            };
          })
        );

        setActions(actionsWithImages);
      }
    };

    loadActions();
  }, []);

  useEffect(() => {
    const logos = import.meta.glob('./assets/logos/*', { eager: true });
    const logoPath = `./assets/logos/${ecole.toLowerCase()}.svg`;

    if (logos[logoPath]) {
      setLogoEcole(logos[logoPath].default);
    } else {
      setLogoEcole('');
      console.error("Logo introuvable pour l'école :", ecole);
    }

    setClasse(`${annee}ème année ${ecole}`);
  }, [ecole, annee]);

  useEffect(() => {
    const actionsWithoutImages = actions.map(({ justificatif, justificatifPreview, ...rest }) => rest);
    localStorage.setItem('actions', JSON.stringify(actionsWithoutImages));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('nom', nom);
  }, [nom]);

  useEffect(() => {
    localStorage.setItem('prenom', prenom);
  }, [prenom]);

  useEffect(() => {
    localStorage.setItem('annee', annee);
  }, [annee]);

  useEffect(() => {
    localStorage.setItem('ecole', ecole);
  }, [ecole]);

  const handleAddAction = async () => {
    if (!newAction.axe || !newAction.description || !newAction.justificatif) {
      alert('Les champs "Description", "Axe" et "Justificatif" sont obligatoires.');
      return;
    }

    const actionId = Date.now();

    await set(`image-${actionId}`, newAction.justificatif);

    const actionWithoutImage = {
      ...newAction,
      id: actionId,
      justificatif: null,
      justificatifPreview: newAction.justificatifPreview,
    };

    setActions([...actions, actionWithoutImage]);
    setNewAction({
      axe: '',
      description: '',
      justificatif: null,
      justificatifPreview: '',
    });
    setIsModalOpen(false);
  };

  const [editingActionIndex, setEditingActionIndex] = useState(null);

  const handleEditAction = async (index) => {
    setEditingActionIndex(index);
    const action = actions[index];

    const imageBase64 = await get(`image-${action.id}`);

    setNewAction({
      ...action,
      justificatif: imageBase64 || null,
      justificatifPreview: imageBase64 || '',
    });
    setIsModalOpen(true);
  };

  const handleUpdateAction = async () => {
    if (!newAction.axe || !newAction.description || !newAction.justificatif) {
      alert('Les champs "Description", "Axe" et "Justificatif" sont obligatoires.');
      return;
    }

    const updatedActions = [...actions];
    const actionId = newAction.id;

    await set(`image-${actionId}`, newAction.justificatif);

    const actionWithoutImage = {
      ...newAction,
      justificatif: null,
      justificatifPreview: newAction.justificatifPreview,
    };

    updatedActions[editingActionIndex] = actionWithoutImage;
    setActions(updatedActions);
    setNewAction({
      axe: '',
      description: '',
      justificatif: null,
      justificatifPreview: '',
    });
    setIsModalOpen(false);
    setEditingActionIndex(null);
  };

  const handleDeleteAction = async (index) => {
    const actionToDelete = actions[index];

    await del(`image-${actionToDelete.id}`);

    const updatedActions = [...actions];
    updatedActions.splice(index, 1);
    setActions(updatedActions);
  };

  const calculateOpens = (axe, position) => {
    switch (axe) {
      case 'Entreprise':
        return 2;
      case 'Challenge / Communication':
        if (position === 1) return 4;
        return 2;
      case "Esprit d'équipe":
        return 1.5;
      case 'Ouverture sur l’extérieur':
        if (position === 1) return 2;
        return 1;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const totals = {};
    const countsPerAxe = {};

    actions.forEach((action) => {
      if (!countsPerAxe[action.axe]) countsPerAxe[action.axe] = 0;
      countsPerAxe[action.axe] += 1;

      const position = countsPerAxe[action.axe];

      const points = calculateOpens(action.axe, position);

      if (!totals[action.axe]) totals[action.axe] = 0;
      totals[action.axe] += points;
    });

    setTotalPointsPerAxe(totals);
  }, [actions]);

  const getSchoolYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    if (month >= 8) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  const generatePDF = () => {
    const input = contentRef.current.cloneNode(true);

    const modifyButtons = input.querySelectorAll('.modify-button');
    modifyButtons.forEach((btn) => btn.remove());

    const modifyHeaders = input.querySelectorAll('.modify-header');
    modifyHeaders.forEach((header) => header.remove());

    const options = {
      margin: [10, 10, 10, 10],
      filename: `Dossier Open ${nom} ${prenom} ${ecole} - ${getSchoolYear()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(options).from(input).save();
  };

  const onDropJustificatif = (acceptedFiles, fileRejections) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageToCrop(URL.createObjectURL(file));
      setCropModalOpen(true);
    }

    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((e) => {
          if (e.code === 'file-too-large') {
            alert(`Le fichier ${file.name} dépasse la taille maximale de 2 Mo.`);
          } else if (e.code === 'file-invalid-type') {
            alert(`Le fichier ${file.name} n'est pas un type d'image valide.`);
          }
        });
      });
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const croppedImageBase64 = await blobToBase64(croppedImageBlob);

      setNewAction({
        ...newAction,
        justificatif: croppedImageBase64,
        justificatifPreview: croppedImageBase64,
      });
      setCropModalOpen(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropJustificatif,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg'],
    },
    maxSize: 2 * 1024 * 1024, // 2MB en octets
  });
  const accordionsData = [
    {
      title: 'Axe Entreprise',
      content: (
        <>
          <p>1 action = 2 Opens</p>
          <p>Limite par axe : 8 Opens</p>
          <p className="font-semibold">
            Points accumulés : {totalPointsPerAxe['Entreprise'] || 0} / 8
          </p>
          <p className="font-semibold mt-2">Exemples d’actions :</p>
          <ul className="list-disc list-inside">
            <li>Conférences en lien avec la filière ou le projet professionnel.</li>
            <li>Interviews de professionnels.</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Axe Challenge / Communication',
      content: (
        <>
          <p>1ère action = 4 Opens</p>
          <p>Actions suivantes = 2 Opens</p>
          <p>Limite par axe : 8 Opens</p>
          <p className="font-semibold">
            Points accumulés : {totalPointsPerAxe['Challenge / Communication'] || 0} / 8
          </p>
          <p className="font-semibold mt-2">Exemples d’actions :</p>
          <ul className="list-disc list-inside">
            <li>
              Salons, présentation du campus dans d’anciens établissements, concours ou certifications.
            </li>
            <li>
              Participation à des vidéos ou shooting photos gérés par le service communication.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Axe Esprit d'équipe",
      content: (
        <>
          <p>1 action = 1,5 Opens</p>
          <p>Limite par axe : 6 Opens</p>
          <p className="font-semibold">
            Points accumulés : {totalPointsPerAxe["Esprit d'équipe"] || 0} / 6
          </p>
          <p className="font-semibold mt-2">Exemples d’actions :</p>
          <ul className="list-disc list-inside">
            <li>
              Participation à des activités BDE, soirées, week-ends d’intégration.
            </li>
            <li>Organisation d’activités de cohésion (Escape Game, Urban Foot).</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Axe Ouverture sur l’extérieur',
      content: (
        <>
          <p>1ère action = 2 Opens</p>
          <p>Actions suivantes = 1 Open</p>
          <p>Limite par axe : 5 Opens</p>
          <p className="font-semibold">
            Points accumulés : {totalPointsPerAxe['Ouverture sur l’extérieur'] || 0} / 5
          </p>
          <p className="font-semibold mt-2">Exemples d’actions :</p>
          <ul className="list-disc list-inside">
            <li>Visiter un musée, théâtre, expositions.</li>
            <li>
              Participer à des salons professionnels ou avoir une activité associative régulière.
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <PointsSummary totalPointsPerAxe={totalPointsPerAxe} axeLimits={axeLimits} />
      <div className="max-w-7xl mx-auto mt-10 p-6">
        <div className="flex flex-col xl:flex-row justify-center items-start xl:space-x-8">
          <UserForm
            nom={nom}
            setNom={setNom}
            prenom={prenom}
            setPrenom={setPrenom}
            annee={annee}
            setAnnee={setAnnee}
            ecole={ecole}
            setEcole={setEcole}
            logoEcole={logoEcole}
            setActions={setActions}
          />
          {/* Section Droite - 2/3 */}
          <div className="w-full xl:w-2/3 mt-6 xl:mt-0 border-2 border-gray-400 bg-white p-8 rounded-lg shadow-inner relative">
            <div ref={contentRef}>
              <div className="text-center">
                <img src={logoEcole} alt="Logo École" className="mx-auto mb-4 w-24 h-24" />
                <h1 className="text-2xl font-bold">
                  Page de garde synthèse semestrielle « Open {ecole} » - {getSchoolYear()}
                </h1>
                <p className="text-sm text-gray-600">
                  {classe} – À remettre au plus tard le 13 juillet {getSchoolYear().split('-')[1]}
                </p>
                <p className="text-sm text-gray-600">à votre Attaché(e) de promotion</p>
              </div>

              <table className="w-full border-collapse mt-4">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="border border-gray-300 p-2">
                      <strong>Nom :</strong> {nom}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <strong>Prénom :</strong> {prenom}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <strong>Classe :</strong> {classe}
                    </td>
                  </tr>
                </tbody>
              </table>

              <ActionTable
                actions={actions}
                handleEditAction={handleEditAction}
                handleDeleteAction={handleDeleteAction}
                calculateOpens={calculateOpens}
              />
            </div>

            {/* Boutons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between">
              <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 sm:mb-0 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Ajouter une Action
              </button>
              <button
                onClick={generatePDF}
                className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Générer PDF
              </button>
            </div>
          </div>

          <HelpAccordions
            accordionsData={accordionsData}
            openAccordion={openAccordion}
            setOpenAccordion={setOpenAccordion}
          />
        </div>

        <ActionModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editingActionIndex={editingActionIndex}
          setEditingActionIndex={setEditingActionIndex}
          newAction={newAction}
          setNewAction={setNewAction}
          handleAddAction={handleAddAction}
          handleUpdateAction={handleUpdateAction}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          cropModalOpen={cropModalOpen}
          setCropModalOpen={setCropModalOpen}
          imageToCrop={imageToCrop}
          crop={crop}
          setCrop={setCrop}
          zoom={zoom}
          setZoom={setZoom}
          onCropComplete={onCropComplete}
          handleCropSave={handleCropSave}
        />
      </div>
    </>
  );
}

export default DossierForm;
