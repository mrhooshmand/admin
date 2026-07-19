import {TableSkeleton} from "@/shared/components/skeleton/tableSkeleton";
import {Page} from "@/shared/components/page/Page.tsx";
import {PageFilters} from "@/shared/components/page-filters";
import {RolesToolbar} from "@/features/roles/components/RolesToolbar.tsx";
import {RolesFilterForm} from "@/features/roles/components/RolesFilterForm.tsx";

export default function Roles() {
    return (
        <Page>
            <PageFilters actions={
                <RolesToolbar onAdd={() => null} onExport={() => console.log('123')}/>}
            >
                <RolesFilterForm onSubmit={() => null}/>
            </PageFilters>
            <TableSkeleton/>
        </Page>
    );
}