
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { InterestsView } from "@/features/interests/interests-view";

export default function InterestsPage() {
    return (
        <AuthGuard>
            <InterestsView />
        </AuthGuard>
    );
}