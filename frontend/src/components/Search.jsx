export default function Search({ search, setSearch }) {
  return (
    <div className="user-search-area">
      <input
        type="text"
        className="user-search-text"
        placeholder="Search for a user..."
        value={search}
        onChange={setSearch}
      />
      <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
    </div>
  );
}
