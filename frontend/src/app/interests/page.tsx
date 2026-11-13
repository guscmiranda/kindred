import { InterestsView } from "@/features/interests/interests-view";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

export default function InterestsPage() {
    return (
        <AuthenticatedLayout>
            <InterestsView />
        </AuthenticatedLayout>
    );
}