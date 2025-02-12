import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/utils/miscUtils";
import { orderByIndex } from "@/utils/fetchData";

export const OrderBy = ({
  currentOrderBy,
  setCurrentOrderBy,
  museumsToSearch,
}) => {
  const listOrderCollection = {
    items: Object.keys(orderByIndex).map((orderIndexItem) => {
      return {
        label: capitalizeFirstLetter(orderIndexItem),
        value: orderIndexItem,
      };
    }),
  };
  const orderByItem = createListCollection(listOrderCollection);
  return (
    <SelectRoot
      collection={orderByItem}
      width="120px"
      value={currentOrderBy}
      onValueChange={(e) => setCurrentOrderBy(e.value)}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Order by..." />
      </SelectTrigger>
      <SelectContent>
        {orderByItem.items.map((item) => (
          <SelectItem item={item} key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};
