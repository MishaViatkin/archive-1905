import { getChronicle, getPeople, getPlaces } from "@/lib/content";
import { ChronicleScroll } from "@/components/chronicle/ChronicleScroll";

export default function ChroniclePage() {
  const chapters = getChronicle();
  const places = getPlaces();
  const people = getPeople();
  return (
    <ChronicleScroll chapters={chapters} places={places} people={people} />
  );
}
