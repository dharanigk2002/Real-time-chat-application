import { useState } from "react";
import Search from "./Search";
import UserList from "./UserList";

export default function Sidebar() {
  const [search, setSearch] = useState("");

  return (
    <div className="app-sidebar">
      <Search search={search} setSearch={(e) => setSearch(e.target.value)} />
      <UserList search={search} />
    </div>
  );
}
