import { formatResponseIndex } from "../utils/fetchData";
import { Button, Card, Image, Flex, Center } from "@chakra-ui/react";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { ArtworkRecord } from "@/types";
import { saveArtwork, deleteArtwork } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/utils/localStorage";

type ArtworkGridProps = {
  data: ArtworkRecord[] | null;
  isLocalStorage: boolean;
};

const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  data,
  isLocalStorage = false,
}) => {
  const [artworkArray, setArtworkArray] = useState([]);
  const [savedArtworks, setSavedArtworks] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedArtworks: object = getFromLocalStorage("savedArtworks");
    if (storedArtworks) {
      setSavedArtworks(storedArtworks);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setArtworkArray(data);
    } else if (isLocalStorage) {
      const artworksArray = Object.values(savedArtworks);
      setArtworkArray(artworksArray);
    } else {
      setErrorMsg("Cannot find artwork!");
    }
  }, [data, isLocalStorage, savedArtworks]);

  const saveItem = (artworkObject: object) => {
    setSavedArtworks((prev) => {
      const updated = { ...prev };
      updated[artworkObject.internal_id] = artworkObject;
      return updated;
    });
    saveArtwork(artworkObject);
  };

  const deleteItem = (index: number, internal_id) => {
    console.log("deleting", internal_id);
    setSavedArtworks((prev) => {
      const updated = { ...prev };
      delete updated[internal_id];
      return updated;
    });
    deleteArtwork(internal_id);
  };

  return (
    <div>
      {errorMsg && <p>errorMsg</p>}
      <Flex gap="4" wrap="wrap" justify="center">
        {artworkArray.map((record: ArtworkRecord, index) => (
          <Card.Root maxW="sm" overflow="hidden" key={`${record.id}-${index}`}>
            <Image
              src={record.image_src}
              alt={record.title || "Artwork"}
              aspectRatio={4 / 3}
              width={400}
            />
            <Card.Body gap="2">
              <Card.Title>{record.title}</Card.Title>
              <Card.Description>{record.description}</Card.Description>
              <DataListRoot orientation="horizontal" divideY="1px" maxW="md">
                {Object.keys(record).map((key) => {
                  const field = formatResponseIndex.fields[key];
                  if (field?.display_title && record[key].length > 0) {
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
            <Card.Footer gap="2" justifyContent="center">
              {Object.keys(savedArtworks).includes(record.internal_id) ? (
                <Button
                  variant="outline"
                  onClick={() => deleteItem(index, record.internal_id)}
                >
                  Delete from Collection
                </Button>
              ) : (
                <Button variant="solid" onClick={() => saveItem(record)}>
                  Save to Collection
                </Button>
              )}
            </Card.Footer>
          </Card.Root>
        ))}
      </Flex>
    </div>
  );
};

export default ArtworkGrid;
