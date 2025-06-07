import ChampionsList from "../components/ChampionsList";

const Champions = () => {
  
  return (
    <div className="champions-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
        <div className="mb-8 pt-8 px-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Champions</h1>
          <p className="text-lg text-gray-500">
            Explore all League of Legends champions and their rework proposals
          </p>
        </div>
      <ChampionsList 
        showFilters={true} 
        showTitle={true}
      />
    </div>
  );
};

export default Champions;