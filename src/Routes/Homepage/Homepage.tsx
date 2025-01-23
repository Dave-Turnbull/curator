import { Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Homepage = () => {
  return (
    <main>
      <Center h="300px">
        <div>
          <h2>Welcome to Curator!</h2>
          <p>
            Search using the form above or view your{" "}
            <Link className="hyperlink" to={"/saved"}>
              saved artworks.
            </Link>
          </p>
        </div>
      </Center>
    </main>
  );
};

export default Homepage;
