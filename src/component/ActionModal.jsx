import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ActionModal = ({
    isModalOpen,
    setIsModalOpen,
    editingActionIndex,
    setEditingActionIndex,
    newAction,
    setNewAction,
    handleAddAction,
    handleUpdateAction,
    getRootProps,
    getInputProps,
    cropModalOpen,
    setCropModalOpen,
    imageToCrop,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    handleCropSave,
}) => (
    <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
            setIsModalOpen(false);
            setEditingActionIndex(null);
            setNewAction({
                axe: '',
                description: '',
                justificatif: null,
                justificatifPreview: '',
            });
        }}
        contentLabel="Ajouter une Action"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
        <div className="bg-white w-full max-w-2xl mx-auto p-6 rounded-md">
            <h2 className="text-xl font-semibold mb-4">
                {editingActionIndex !== null ? 'Modifier une Action' : 'Ajouter une Action'}
            </h2>
            <select
                value={newAction.axe}
                onChange={(e) => setNewAction({ ...newAction, axe: e.target.value })}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            >
                <option value="">Choisir un axe</option>
                <option value="Entreprise">Entreprise</option>
                <option value="Challenge / Communication">Challenge / Communication</option>
                <option value="Esprit d'équipe">Esprit d'équipe</option>
                <option value="Ouverture sur l’extérieur">Ouverture sur l’extérieur</option>
            </select>
            <input
                type="text"
                placeholder="Description"
                value={newAction.description}
                onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            {/* Upload Justificatif avec plus d'espace et rognage */}
            <div className="w-full mb-4">
                <p className="mb-2 text-center">
                    Glissez et déposez une image ici, ou cliquez pour sélectionner un fichier
                </p>
                <div
                    {...getRootProps()}
                    className="w-full h-64 px-4 py-10 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer flex items-center justify-center"
                >
                    <input {...getInputProps()} required />
                    {newAction.justificatifPreview ? (
                        <img
                            src={newAction.justificatifPreview}
                            alt="Justificatif Preview"
                            className="max-h-full object-contain"
                        />
                    ) : (
                        <p>Zone de dépôt pour l'image du justificatif</p>
                    )}
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                    Taille maximale recommandée : 2MB. Vous pouvez zoomer ou rogner l'image après l'avoir sélectionnée.
                </p>
            </div>

            {/* Modal pour le rognage d'image */}
            {cropModalOpen && (
                <Modal
                    isOpen={cropModalOpen}
                    onRequestClose={() => setCropModalOpen(false)}
                    contentLabel="Rogner l'image"
                    className="fixed inset-0 flex items-center justify-center"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                >
                    <div className="bg-white w-full max-w-3xl mx-auto p-6 rounded-md">
                        <h2 className="text-xl font-semibold mb-4">Rogner l'image</h2>
                        <div className="relative w-full h-96 bg-gray-200">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="mr-3">Zoom :</span>
                            <Slider
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(value) => setZoom(value)}
                            />
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setCropModalOpen(false)}
                                className="mr-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCropSave}
                                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            <div className="flex justify-end">
                <button
                    onClick={() => {
                        setIsModalOpen(false);
                        setEditingActionIndex(null);
                        setNewAction({
                            axe: '',
                            description: '',
                            justificatif: null,
                            justificatifPreview: '',
                        });
                    }}
                    className="mr-4 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                    Annuler
                </button>
                <button
                    onClick={editingActionIndex !== null ? handleUpdateAction : handleAddAction}
                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    {editingActionIndex !== null ? 'Modifier' : 'Ajouter'}
                </button>
            </div>
        </div>
    </Modal>
);

export default ActionModal;