import { PlaceDetailView } from "@/features/places/place-detail-view";

interface PlacePageProps {
    params: Promise<{
        placeId: string;
    }>;
}

export default async function PlacePage({ params }: PlacePageProps) {
    const { placeId } = await params;

    return <PlaceDetailView placeId={placeId} />;
}