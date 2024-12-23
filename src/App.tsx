import { useEffect, useState } from 'react';
import './App.css';
import fetchData, {formatResponseIndex} from './utils/fetchData';
import { Button, Card, Image, Flex, Input } from "@chakra-ui/react"
import { Checkbox } from "@/components/ui/checkbox"
import { DataListItem, DataListRoot } from "@/components/ui/data-list"
import { Switch } from "@/components/ui/switch"
import apiData from './utils/apiData';

function App() {
  const [data, setData] = useState<Array<object> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mainSearchInput, setMainSearchInput] = useState<string>('')
  const [titleSearchInput, setTitleSearchInput] = useState<string>('')
  const [creatorInput, setCreatorInput] = useState<string>('')
  const [dateRangeInput, setDateRangeInput] = useState<object>({from: null, to: null})
  const [museumsToSearch, setMuseumsToSearch] = useState<string[]>(Object.keys(apiData))
  const [isTitleSearch, setIsTitleSearch] = useState<boolean>(false)
  const [isAdvancedSearch, setIsAdvancedSearch] = useState<boolean>(false)

  const getData = async () => {
    try {
      setLoading(true);
      const queries = {
        search_titles: titleSearchInput,
        search_all: mainSearchInput,
        date: {
          from: dateRangeInput.from,
          to: dateRangeInput.to,
        },
        creator: creatorInput,
      }
      const result = await fetchData(queries, museumsToSearch);
      setData(result);
    } catch (err) {
      setError(`Failed to fetch data: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMuseumCheckboxChange = (key: string) => {
    setMuseumsToSearch((prev) =>
      prev.includes(key)
        ? prev.filter((museum) => museum !== key) // Remove if already selected
        : [...prev, key] // Add if not selected
    );
  };

  const saveItem = () => {
    
  }
  return (
    <>
      <Input onChange={(e) => setMainSearchInput(e.target.value)} value={mainSearchInput} placeholder="Search for Artwork" />
      {!isAdvancedSearch?<Switch checked={isTitleSearch} onCheckedChange={(e) => setIsTitleSearch(e.checked)}>Search Title Only</Switch>:<></>}
      {isAdvancedSearch?
      <>
        <Input onChange={(e) => setTitleSearchInput(e.target.value)} value={titleSearchInput} placeholder="Search Titles" />
        <Input onChange={(e) => setCreatorInput(e.target.value)} value={creatorInput} placeholder="Search Artist/Maker" />
      </>
      :<></>}
      <div>
        {Object.keys(apiData).map((key) => {
          return (
            <Checkbox
              key={key}
              checked={museumsToSearch.includes(key)}
              variant="outline"
              onChange={() => handleMuseumCheckboxChange(key)}
            >{apiData[key].name}
          </Checkbox>
          )
        })}
      </div>
      <Switch checked={isAdvancedSearch} onCheckedChange={(e) => setIsAdvancedSearch(e.checked)}>Advanced Search</Switch>
      <Button onClick={e => getData()} variant="solid">Search</Button>
      {loading?<p>Loading...</p>:<></>}
      {error?<p>{`Error: ${error}`}</p>:<></>}
      
      {data ? (
        <Flex gap="4"  wrap="wrap"> 
        {data ? data.map((record:object) => {
          return (
            <Card.Root maxW="sm" overflow="hidden" key={record.id}>
              <Image
                src={record.image_src}
                alt=""
              />
              <Card.Body gap="2">
                <Card.Title>{record.title}</Card.Title>
                <Card.Description>
                  {record.description}
                </Card.Description>
                <DataListRoot orientation="horizontal" divideY="1px" maxW="md">
                  {Object.keys(record).map(key => {
                      if (formatResponseIndex.fields[key] && formatResponseIndex.fields[key].display_title) {
                      return(
                        <DataListItem
                          info={formatResponseIndex.fields[key].help_text ? formatResponseIndex.fields[key].help_text:null}
                          key={key}
                          label={formatResponseIndex.fields[key].display_title ? formatResponseIndex.fields[key].display_title:null}
                          value={record[key]}
                        />
                      )
                    }
                  })}
                </DataListRoot>
              </Card.Body>
              <Card.Footer gap="2">
                <Button variant="solid" onClick={saveItem(record.id)}>Save to Collection</Button>
                <Button variant="ghost">Request Additional Info</Button>
              </Card.Footer>
            </Card.Root>
          )
        }) : 'Nothing Found'}
      </Flex>): <p>Press Submit to find artworks</p>}
    </>
  );
}

export default App;