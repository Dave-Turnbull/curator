import { useEffect, useState } from "react";
import ArtworkGrid from "@/components/ArtworkGrid";
import { ArtworkRecord, MuseumKey } from "@/types";
import fetchData from "../../utils/fetchData";
import { Queries } from "../../utils/formatQueries";
import { Button } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import apiData from "@/utils/apiData";

export const SearchResults = () => {
  const [data, setData] = useState<ArtworkRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [currentSearchQueries, setCurrentSearchQueries] = useState<Queries>({});
  const [currentMuseumsSearched, setCurrentMuseumsSearched] = useState<
    MuseumKey[]
  >(Object.keys(apiData) as MuseumKey[]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const museumsToSearch =
      searchParams.get("museums_to_search")?.split(",") || "";

    const queries = {};
    searchParams.forEach((value, key) => {
      if (key !== "museums_to_search") {
        queries[key] = value;
      }
    });

    const getData = async () => {
      try {
        setData([]);
        setError(null);
        setLoading(true);
        const result = await fetchData(queries, museumsToSearch);
        setCurrentSearchQueries(queries);
        setCurrentMuseumsSearched(museumsToSearch);
        setData(result);
      } catch (err) {
        setError(
          `Failed to fetch data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    if (searchParams.size > 0) {
      getData();
    } else {
      setLoading(false);
      setError("Search parameters are empty!");
    }
  }, [searchParams]);

  const handleLoadNextPage = async () => {
    if (Array.isArray(data)) {
      try {
        setLoading(true);
        const result = await fetchData(
          { ...currentSearchQueries, page: currentPageNumber + 1 },
          currentMuseumsSearched
        );
        setData((prev) => [...prev, ...result]);
      } catch (err) {
        setError(
          `Failed to fetch data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setCurrentPageNumber((prev) => ++prev);
        setLoading(false);
      }
    } else {
      setError("Failed to load more data");
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>{`Error: ${error}`}</p>}
      {data.length > 0 && (
        <>
          <ArtworkGrid data={data} isLocalStorage={false} />
          <Button variant="solid" onClick={handleLoadNextPage}>
            Next Page
          </Button>
        </>
      )}
    </>
  );
};

export default SearchResults;
