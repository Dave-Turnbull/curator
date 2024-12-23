
import  { formatResponseIndex } from '../utils/fetchData';
import { Button, Card, Image, Flex } from "@chakra-ui/react";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { ArtworkRecord } from '@/types';

type ArtworkGridProps = {
    data: ArtworkRecord[];
    saveItem: (record: ArtworkRecord) => void;
    deleteItem: (arg0: number) => void;
    isLocalStorage: boolean;
  };

const ArtworkGrid: React.FC<ArtworkGridProps> = ({ data, saveItem, deleteItem, isLocalStorage = false }) => {
    return (
    <div>
        <Flex gap="4" wrap="wrap"> 
          {data.map((record: ArtworkRecord, index) => (
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
                {isLocalStorage?
                <Button variant="solid" onClick={() => deleteItem(index)}>Delete from Collection</Button>
                :<Button variant="solid" onClick={() => saveItem(record)}>Save to Collection</Button>}
              </Card.Footer>
            </Card.Root>
          ))}
        </Flex>
        </div>
    )
}

export default ArtworkGrid