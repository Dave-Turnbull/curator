import { useState } from "react";
import { Button, Flex, Heading, Input, Separator } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { MuseumKey } from "@/types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiData from "@/utils/apiData";
import { OrderBy } from "./components/OrderBy";
import { Collapsible } from "@chakra-ui/react";

export const NavigationBar = () => {
  const [mainSearchInput, setMainSearchInput] = useState<string>("");
  const [titleSearchInput, setTitleSearchInput] = useState<string>("");
  const [creatorInput, setCreatorInput] = useState<string>("");
  const [dateRangeFrom, setDateRangeFrom] = useState("");
  const [dateRangeTo, setDateRangeTo] = useState("");
  const [museumsToSearch, setMuseumsToSearch] = useState<MuseumKey[]>(
    Object.keys(apiData) as MuseumKey[]
  );
  const [isTitleSearch, setIsTitleSearch] = useState<boolean>(false);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState<boolean>(false);
  const [currentOrderBy, setCurrentOrderBy] = useState<string>();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(true);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleMuseumCheckboxChange = (key: any) => {
    setMuseumsToSearch((prev) =>
      prev.includes(key)
        ? prev.filter((museum) => museum !== key)
        : [...prev, key]
    );
  };
  const handleDateRangeChange = (e: any, fromOrTo: string) => {
    if (fromOrTo === "from") {
      setDateRangeFrom(e.target.value);
    }
    if (fromOrTo === "to") {
      setDateRangeTo(e.target.value);
    }
  };
  function handleSearch() {
    const buildQueryString = () => {
      const params = new URLSearchParams();

      if (museumsToSearch.length > 0) {
        params.append("museums_to_search", museumsToSearch.join(","));
      }
      if (mainSearchInput && !isTitleSearch) {
        params.append("search_all", mainSearchInput);
      } else if (isTitleSearch) {
        params.append("search_titles", mainSearchInput);
      }
      if (isAdvancedSearch) {
        if (mainSearchInput) params.append("search_all", mainSearchInput);
        if (titleSearchInput) params.append("search_titles", titleSearchInput);
        if (dateRangeFrom) params.append("date_from", dateRangeFrom);
        if (dateRangeTo) params.append("date_to", dateRangeTo);
        if (creatorInput) params.append("creator", creatorInput);
      }
      if (currentOrderBy) {
        params.append("order_by", currentOrderBy);
      }

      return `?${params.toString()}`;
    };

    navigate(`/search${buildQueryString()}`);
  }

  return (
    <>
      <nav>
        <Collapsible.Root
          open={isSearchOpen}
          onOpenChange={() => setIsSearchOpen((prev) => !prev)}
        >
          <Flex gap={2} marginBottom={1} alignItems={"center"}>
            <Heading marginRight={5}>Curator.</Heading>
            <Button
              size={"sm"}
              flexGrow={1}
              asChild
              variant={pathname === "/saved" ? "surface" : "outline"}
            >
              <Link to="/saved">Saved Artworks</Link>
            </Button>
            <Collapsible.Trigger flexGrow={1}>
              <Flex>
                <Button
                  size={"sm"}
                  flexGrow={1}
                  variant={isSearchOpen ? "subtle" : "outline"}
                >
                  Search Artworks
                </Button>
              </Flex>
            </Collapsible.Trigger>
          </Flex>
          <Collapsible.Content>
            <Input
              onChange={(e) => setMainSearchInput(e.target.value)}
              value={mainSearchInput}
              placeholder="Search for Artwork"
            />
            {isAdvancedSearch && (
              <>
                <Input
                  onChange={(e) => setTitleSearchInput(e.target.value)}
                  value={titleSearchInput}
                  placeholder="Search Titles"
                />
                <Input
                  onChange={(e) => setCreatorInput(e.target.value)}
                  value={creatorInput}
                  placeholder="Search Artist/Maker"
                />
                <Input
                  onChange={(e) => handleDateRangeChange(e, "from")}
                  value={dateRangeFrom}
                  placeholder="Date Range From"
                />
                <Input
                  onChange={(e) => handleDateRangeChange(e, "to")}
                  value={dateRangeTo}
                  placeholder="Date Range to"
                />
              </>
            )}
            <Separator marginTop={1} marginBottom={1} />
            <Flex justifyContent={"space-between"}>
              <OrderBy
                currentOrderBy={currentOrderBy}
                setCurrentOrderBy={setCurrentOrderBy}
                museumsToSearch={museumsToSearch}
              />
              <Flex gap={5}>
                {!isAdvancedSearch && (
                  <Switch
                    checked={isTitleSearch}
                    onCheckedChange={(e) => setIsTitleSearch(e.checked)}
                  >
                    Search Title Only
                  </Switch>
                )}
                <Switch
                  checked={isAdvancedSearch}
                  onCheckedChange={(e) => setIsAdvancedSearch(e.checked)}
                >
                  Advanced Search
                </Switch>
              </Flex>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Flex gap={5}>
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
              </Flex>
              <Button onClick={handleSearch} variant="solid">
                Search
              </Button>
            </Flex>
          </Collapsible.Content>
        </Collapsible.Root>
      </nav>
      <Separator marginTop={2} marginBottom={2} />
    </>
  );
};

export default NavigationBar;
