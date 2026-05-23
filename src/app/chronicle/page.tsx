import { getChronicle, getPlaces } from "@/lib/content";
import { ChronicleScroll } from "@/components/chronicle/ChronicleScroll";

export default function ChroniclePage() {
  const chapters = getChronicle();
  const places = getPlaces();
  return <ChronicleScroll chapters={chapters} places={places} />;
}
