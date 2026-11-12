import { AuthGuard } from "@/features/auth/components/auth-guard";
import { CreatePlaceView } from "@/features/places/create-place-view";

export default function NewPlacePage() {
    return (
        <AuthGuard>
            <CreatePlaceView />
        </AuthGuard>
    );
}