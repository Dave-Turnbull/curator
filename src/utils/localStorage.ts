const saveToLocalStorage = (key: string, data: object[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string): object[] => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : {};
};

export const addToLocalStorageByID = (key: string, newArtwork: object) => {
  console.log('saving', newArtwork)
  const currentData = getFromLocalStorage(key) || {};
  console.log('datafromstorage', currentData)
  currentData[newArtwork.internal_id] = (newArtwork);
  console.log('currentData', currentData)
  saveToLocalStorage(key, currentData);
  
}

export const deleteFromLocalStorageByID = (key: string, internal_id: string) => {
  const currentData = getFromLocalStorage(key);
  delete currentData[internal_id]
  saveToLocalStorage(key, currentData);
}

export const saveArtwork = (artwork: object) => {
  addToLocalStorageByID('savedArtworks', artwork, )
};

export const deleteArtwork = (internal_id: number) => {
    deleteFromLocalStorageByID('savedArtworks', internal_id);
};