import { AuthGuard } from "@/features/auth/components/auth-guard";
import { ManagedPlacesView } from "@/features/places/managed-places-view";

export default function ManagedPlacesPage() {
    return (
        <AuthGuard>
            <ManagedPlacesView />
        </AuthGuard>
    );
}