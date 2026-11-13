
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

interface PlacesLayoutProps {
    children: React.ReactNode;
}

export default function PlacesLayout({
    children,
}: PlacesLayoutProps) {
    return (
        <AuthenticatedLayout>
            {children}
        </AuthenticatedLayout>
    );
}
