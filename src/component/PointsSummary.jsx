const PointsSummary = ({ totalPointsPerAxe, axeLimits }) => {
    const axeData = [
        { name: 'Entreprise', emoji: '🏢', limit: axeLimits['Entreprise'] },
        { name: 'Challenge / Communication', emoji: '🎤', limit: axeLimits['Challenge / Communication'] },
        { name: "Esprit d'équipe", emoji: '🤝', limit: axeLimits["Esprit d'équipe"] },
        { name: 'Ouverture sur l’extérieur', emoji: '🌍', limit: axeLimits['Ouverture sur l’extérieur'] },
    ];

    return (
        <div className="flex flex-wrap justify-center items-center mt-4">
            {axeData.map((axe) => (
                <div key={axe.name} className="w-full sm:w-1/2 lg:w-1/4 p-2">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-4xl">{axe.emoji}</div>
                        <div className="text-xl font-bold mt-2">{axe.name}</div>
                        <div className="text-2xl font-bold mt-2">
                            {totalPointsPerAxe[axe.name] || 0} / {axe.limit}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PointsSummary;