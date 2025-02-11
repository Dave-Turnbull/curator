import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./Homepage/Homepage";
import NotFound from "./NotFound/NotFound";
import SearchResults from "./Search/Search";
import Saved from "./Saved/Saved";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
