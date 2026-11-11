import { ProfileView } from "@/features/profile/profile-view";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function ProfilePage() {
    return (
        <AuthGuard>
            <ProfileView />
        </AuthGuard>
    );
}