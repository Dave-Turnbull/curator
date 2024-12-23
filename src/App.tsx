import { useState, useEffect } from 'react';
import './App.css';
import fetchData from './utils/fetchData';
import { Button, Input } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import apiData from './utils/apiData';
import { ArtworkRecord, MuseumKey } from './types';
import { Queries } from './utils/formatQueries';
import { getFromLocalStorage, saveArtwork, deleteArtwork } from './utils/localStorage';
import ArtworkGrid from './components/artworkGrid';

function App() {
  const [data, setData] = useState<ArtworkRecord[]>([]);
  const [savedCollection, setSavedCollection] = useState<ArtworkRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mainSearchInput, setMainSearchInput] = useState<string>('');
  const [titleSearchInput, setTitleSearchInput] = useState<string>('');
  const [creatorInput, setCreatorInput] = useState<string>('');
  const [dateRangeFrom, setDateRangeFrom] = useState('');
  const [dateRangeTo, setDateRangeTo] = useState('');
  const [museumsToSearch, setMuseumsToSearch] = useState<MuseumKey[]>(Object.keys(apiData) as MuseumKey[]);
  const [isTitleSearch, setIsTitleSearch] = useState<boolean>(false);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState<boolean>(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(0)
  const [currentSearchQueries, setCurrentSearchQueries] = useState<Queries>({})
  const [currentMuseumsSearched, setCurrentMuseumsSearched] = useState<MuseumKey[]>(Object.keys(apiData) as MuseumKey[]);

  useEffect(() => {
    const savedArtworks = getFromLocalStorage("savedArtworks")
    //@ts-ignore
    setSavedCollection(savedArtworks);
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const queries = {
        search_titles: titleSearchInput,
        search_all: mainSearchInput,
        date: {from: Number(dateRangeFrom), to: Number(dateRangeTo)},
        creator: creatorInput,
      };
      const result = await fetchData(queries, museumsToSearch);
      setCurrentSearchQueries(queries)
      setCurrentMuseumsSearched(museumsToSearch)
      setData(result);
    } catch (err) {
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMuseumCheckboxChange = (key: any) => {
    setMuseumsToSearch((prev) =>
      prev.includes(key)
        ? prev.filter((museum) => museum !== key)
        : [...prev, key]
    );
  };
  const handleDateRangeChange = (e: any, fromOrTo: string) => {
    if (fromOrTo === 'from') {
      setDateRangeFrom(e.target.value)
      }
    if (fromOrTo === 'to') {
      setDateRangeTo(e.target.value)
    }
  }
  const handleLoadNextPage = async () => {
    console.log(currentSearchQueries)
    if(Array.isArray(data)) {
      try {
        setLoading(true);
        const result = await fetchData({...currentSearchQueries, page: currentPageNumber + 1}, currentMuseumsSearched);
        setData((prev) => [...prev, ...result]);
      } catch (err) {
        setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setCurrentPageNumber((prev) => prev++)
        setLoading(false);
      }
    } else {
      setError('Failed to load more data')
    }
  }

  const saveItem = (artworkObject: object) => {
    saveArtwork(artworkObject)
  };

  const deleteItem = (index: number) => {
    setSavedCollection((prevArray) => {
      prevArray.splice(index, 1);
      return prevArray
    })
    deleteArtwork(index)
  }

  return (
    <>
      <Input onChange={(e) => setMainSearchInput(e.target.value)} value={mainSearchInput} placeholder="Search for Artwork" />
      {!isAdvancedSearch && 
        <Switch checked={isTitleSearch} onCheckedChange={(e) => setIsTitleSearch(e.checked)}>
          Search Title Only
        </Switch>
      }
      {isAdvancedSearch && (
        <>
          <Input onChange={(e) => setTitleSearchInput(e.target.value)} value={titleSearchInput} placeholder="Search Titles" />
          <Input onChange={(e) => setCreatorInput(e.target.value)} value={creatorInput} placeholder="Search Artist/Maker" />
          <Input onChange={(e) => handleDateRangeChange(e, 'from')} value={dateRangeFrom} placeholder="Date Range From" />
          <Input onChange={(e) => handleDateRangeChange(e, 'to')} value={dateRangeTo} placeholder="Date Range to" />
        </>
      )}
      <div>
        {(Object.keys(apiData) as MuseumKey[]).map((key) => (
          <Checkbox
            key={key}
            checked={museumsToSearch.includes(key)}
            variant="outline"
            onChange={() => handleMuseumCheckboxChange(key)}
          >
            {apiData[key].name}
          </Checkbox>
        ))}
      </div>
      <Switch checked={isAdvancedSearch} onCheckedChange={(e) => setIsAdvancedSearch(e.checked)}>
        Advanced Search
      </Switch>
      <Button onClick={getData} variant="solid">Search</Button>
      {loading && <p>Loading...</p>}
      {error && <p>{`Error: ${error}`}</p>}
      
      {data.length > 0 ? (
        <>
          <ArtworkGrid data={data} saveItem={saveItem} deleteItem={deleteItem} isLocalStorage={false}/>
          <Button variant="solid" onClick={handleLoadNextPage}>Next Page</Button>
        </>
      ) : 
        !loading ? (
        <>
        <h1>Your Collection:</h1>
        <ArtworkGrid data={savedCollection} saveItem={saveItem} deleteItem={deleteItem} isLocalStorage={true}/>
        </>
      ):<></>
      }
    </>
  );
}

export default App;