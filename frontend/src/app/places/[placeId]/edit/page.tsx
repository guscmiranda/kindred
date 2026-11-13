import { EditPlaceView } from "@/features/places/edit-place-view";

interface EditPlacePageProps {
    params: Promise<{ placeId: string }>;
}

export default async function EditPlacePage({
    params,
}: EditPlacePageProps) {
    const { placeId } = await params;

    return <EditPlaceView placeId={placeId} />;
}