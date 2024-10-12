const ActionTable = ({ actions, handleEditAction, handleDeleteAction, calculateOpens }) => {
    return (
        <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Actions réalisées</th>
                        <th className="border border-gray-300 p-2">Axe</th>
                        <th className="border border-gray-300 p-2">Points Open</th>
                        <th className="border border-gray-300 p-2">Justificatifs joints</th>
                        <th className="border border-gray-300 p-2 modify-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const countsPerAxe = {};
                        return actions.map((action, index) => {
                            if (!countsPerAxe[action.axe]) countsPerAxe[action.axe] = 0;
                            countsPerAxe[action.axe] += 1;

                            const position = countsPerAxe[action.axe];

                            const points = calculateOpens(action.axe, position);

                            return (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {action.description}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {action.axe}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {points}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {action.justificatifPreview && (
                                            <img
                                                src={action.justificatifPreview}
                                                alt="Justificatif"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center modify-button">
                                        <button
                                            onClick={() => handleEditAction(index)}
                                            className="py-1 px-2 mr-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAction(index)}
                                            className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            );
                        });
                    })()}
                </tbody>
            </table>
        </div>
    );
};

export default ActionTable;