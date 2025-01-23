import { Button, DataList as ChakraDataList, Stack } from "@chakra-ui/react";
import { InfoTip } from "./toggle-tip";
import { useState } from "react";
import * as React from "react";

export const DataListRoot = ChakraDataList.Root;

interface ItemProps extends ChakraDataList.ItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  info?: React.ReactNode;
  grow?: boolean;
}

export const DataListItem = React.forwardRef<HTMLDivElement, ItemProps>(
  function DataListItem(props, ref) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { label, info, value, children, grow, ...rest } = props;

    const handleToggle = () => setIsExpanded((prev) => !prev);

    const renderValue = () => {
      if (typeof value === "string" && value.length > 200) {
        return isExpanded ? (
          <Stack>
            <p>{value}</p>
            <Button variant="outline" size="xs" onClick={handleToggle}>
              Show less.
            </Button>
          </Stack>
        ) : (
          <Stack>
            <p>{value.substring(0, 150)}... </p>
            <Button variant="outline" size="xs" onClick={handleToggle}>
              Show more.
            </Button>
          </Stack>
        );
      }
      return value;
    };

    return (
      <ChakraDataList.Item ref={ref} {...rest}>
        <ChakraDataList.ItemLabel flex={grow ? "1" : undefined}>
          {label}
          {info && <InfoTip>{info}</InfoTip>}
        </ChakraDataList.ItemLabel>
        <ChakraDataList.ItemValue flex={grow ? "1" : undefined}>
          {renderValue()}
        </ChakraDataList.ItemValue>
        {children}
      </ChakraDataList.Item>
    );
  }
);
