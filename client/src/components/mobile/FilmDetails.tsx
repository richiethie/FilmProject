import { useState } from "react";
import { format } from "date-fns";
import { Collapsible } from "@chakra-ui/react";
import { Film } from "../../types/Film";

interface FilmDetailProps {
  film: Film; // Ensure Film is the correct type from your project
}

const FilmDetails = ({ film }: FilmDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getFirstWords = (text: string, maxWords: number = 5) => {
    const words = text.split(" ");
    return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")} ` : text;
  };

  return (
    <Collapsible.Root className="bg-darkCharcoal my-4 rounded-xl px-4 pb-2">
      <Collapsible.Trigger onClick={() => setIsOpen(!isOpen)} paddingY="3" className="w-ful">
        <div className="flex flex-col items-start text-start">
            <h2 className="text-lg font-bold mb-2">Description</h2>
            {!isOpen && (
                <p className="text-sm text-steelGray">
                    {getFirstWords(film.description || "No description provided.")}
                    <span className="text-crispWhite text-xs"> ...see more</span>
                </p>
            )}
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="flex flex-col">
          <p className="text-sm">{film.description || "No description provided."}</p>
          <p className="text-sm text-steelGray">Uploaded on {format(new Date(film.createdAt), "MMMM d, yyyy")}</p>

          <h3 className="text-lg mt-2">Genre</h3>
          <p className="text-sm text-steelGray">{film.genre || "Not specified."}</p>

          <h3 className="text-lg mt-2">Duration</h3>
          <p className="text-sm text-steelGray">{film.duration ? `${film.duration} seconds` : "Not available."}</p>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default FilmDetails;
