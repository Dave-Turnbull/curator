const saveToLocalStorage = (key: string, data: object[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string): object[] => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
};

const addToLocalStorageArray = (key: string, newObject: object) => {
    const currentArray = getFromLocalStorage(key) || [];
    currentArray.push(newObject);
    saveToLocalStorage(key, currentArray);
};

const deleteFromLocalStorageByIndex = (key: string, index: number) => {
    const currentArray = getFromLocalStorage(key);
  
    if (index >= 0 && index < currentArray.length) {
      currentArray.splice(index, 1);
      saveToLocalStorage(key, currentArray);
    } else {
      console.warn("Invalid index provided.");
    }
  };

export const saveArtwork = (artwork: object) => {
    addToLocalStorageArray('savedArtworks', artwork);
};

export const deleteArtwork = (index: number) => {
    deleteFromLocalStorageByIndex('savedArtworks', index);
};