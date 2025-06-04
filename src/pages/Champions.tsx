import ChampionsList from "../components/ChampionsList";

const Champions = () => {
  return (
    <div className="champions-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ChampionsList 
        showFilters={true} 
        showTitle={true}
      />
    </div>
  );
};

export default Champions;