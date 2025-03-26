import Table from "@/components/table";

import { columnsFormatter } from "@/helpers/tableHelpers";

interface UserSelectProps {
  users?: usersView[];
  headers?: string[];
  handleUserSelection: (user: usersView) => void;
}

export default function UserSelect({
  users,
  headers,
  handleUserSelection,
}: UserSelectProps) {
  if (!users) return null;

  const columns = columnsFormatter<usersView>(headers);
  if (!columns) return null;

  return (
    <div className="table-container">
      <Table
        columns={columns}
        data={users}
        onRowClick={handleUserSelection}
        pageSize={17}
      />
    </div>
  );
}
