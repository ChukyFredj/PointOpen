const HelpAccordions = ({ accordionsData, openAccordion, setOpenAccordion }) => (
    <div className="w-full xl:w-1/4 mt-6 xl:mt-0 xl:pl-4">
        <div className="sticky top-0">
            <h2 className="text-xl font-bold mb-4">Aide</h2>
            {accordionsData.map((accordion, index) => (
                <div key={index} className="mb-4">
                    <button
                        onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                        className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none"
                    >
                        {accordion.title}
                    </button>
                    {openAccordion === index && (
                        <div className="mt-2 px-4 py-2 bg-blue-100 rounded-md">
                            {accordion.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default HelpAccordions;