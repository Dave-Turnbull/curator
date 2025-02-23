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
  //@ts-expect-error temp fix
  currentData[newArtwork.internal_id] = (newArtwork);
  console.log('currentData', currentData)
  saveToLocalStorage(key, currentData);
  
}

export const deleteFromLocalStorageByID = (key: string, internal_id: string) => {
  const currentData = getFromLocalStorage(key);
  //@ts-expect-error temp fix
  delete currentData[internal_id]
  saveToLocalStorage(key, currentData);
}

export const saveArtwork = (artwork: object) => {
  addToLocalStorageByID('savedArtworks', artwork, )
};

export const deleteArtwork = (internal_id: number) => {
  //@ts-expect-error temp fix
    deleteFromLocalStorageByID('savedArtworks', internal_id);
};