import { ProfileView } from "@/features/profile/profile-view";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

export default function ProfilePage() {
    return (
        <AuthenticatedLayout>
            <ProfileView />
        </AuthenticatedLayout>
    );
}