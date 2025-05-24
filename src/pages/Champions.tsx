import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ChampionsList from "../components/ChampionsList";
import { Champion, ChampionsResponse } from '../types/champions';

function Champions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  
  useEffect(() => {
    axiosInstance.get<ChampionsResponse>('/champions')
      .then(response => {
        console.log('Champions data:', response.data);
        if (!response.data.success) {
          return;
        } 
          setChampions(response.data.data.champions);
      });
  });
  
  
  return (
     <div>
        <ChampionsList champions={champions} />
      </div>
  );
}

export default Champions;