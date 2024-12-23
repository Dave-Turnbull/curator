import { useEffect, useState } from 'react';
import './App.css';
import fetchData, { formatResponseIndex } from './utils/fetchData';
import { Button, Card, Image, Flex, Input } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { Switch } from "@/components/ui/switch";
import apiData from './utils/apiData';
import { ArtworkRecord, DateRange } from './types';

function App() {
  const [data, setData] = useState<ArtworkRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mainSearchInput, setMainSearchInput] = useState<string>('');
  const [titleSearchInput, setTitleSearchInput] = useState<string>('');
  const [creatorInput, setCreatorInput] = useState<string>('');
  const [dateRangeInput, setDateRangeInput] = useState<DateRange>({from: null, to: null});
  const [museumsToSearch, setMuseumsToSearch] = useState<string[]>(Object.keys(apiData));
  const [isTitleSearch, setIsTitleSearch] = useState<boolean>(false);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);
      const queries = {
        search_titles: titleSearchInput,
        search_all: mainSearchInput,
        date: dateRangeInput,
        creator: creatorInput,
      };
      const result = await fetchData(queries, museumsToSearch);
      setData(result);
    } catch (err) {
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMuseumCheckboxChange = (key: string) => {
    setMuseumsToSearch((prev) =>
      prev.includes(key)
        ? prev.filter((museum) => museum !== key)
        : [...prev, key]
    );
  };

  const saveItem = (id: string) => {
    // Implementation here
    return () => {
      console.log('Saving item:', id);
    };
  };

  return (
    <>
      <Input onChange={(e) => setMainSearchInput(e.target.value)} value={mainSearchInput} placeholder="Search for Artwork" />
      {!isAdvancedSearch && 
        <Switch checked={isTitleSearch} onCheckedChange={(checked: boolean) => setIsTitleSearch(checked)}>
          Search Title Only
        </Switch>
      }
      {isAdvancedSearch && (
        <>
          <Input onChange={(e) => setTitleSearchInput(e.target.value)} value={titleSearchInput} placeholder="Search Titles" />
          <Input onChange={(e) => setCreatorInput(e.target.value)} value={creatorInput} placeholder="Search Artist/Maker" />
        </>
      )}
      <div>
        {Object.keys(apiData).map((key) => (
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
      <Switch checked={isAdvancedSearch} onCheckedChange={(checked: boolean) => setIsAdvancedSearch(checked)}>
        Advanced Search
      </Switch>
      <Button onClick={getData} variant="solid">Search</Button>
      {loading && <p>Loading...</p>}
      {error && <p>{`Error: ${error}`}</p>}
      
      {data ? (
        <Flex gap="4" wrap="wrap"> 
          {data.map((record: ArtworkRecord) => (
            <Card.Root maxW="sm" overflow="hidden" key={record.id}>
              <Image
                src={record.image_src}
                alt={record.title || "Artwork"}
              />
              <Card.Body gap="2">
                <Card.Title>{record.title}</Card.Title>
                <Card.Description>
                  {record.description}
                </Card.Description>
                <DataListRoot orientation="horizontal" divideY="1px" maxW="md">
                  {Object.keys(record).map(key => {
                    const field = formatResponseIndex.fields[key];
                    if (field?.display_title) {
                      return (
                        <DataListItem
                          info={field.help_text || null}
                          key={key}
                          label={field.display_title}
                          value={record[key]}
                        />
                      );
                    }
                    return null;
                  })}
                </DataListRoot>
              </Card.Body>
              <Card.Footer gap="2">
                <Button variant="solid" onClick={saveItem(record.id)}>Save to Collection</Button>
                <Button variant="ghost">Request Additional Info</Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </Flex>
      ) : (
        <p>Press Submit to find artworks</p>
      )}
    </>
  );
}

export default App;