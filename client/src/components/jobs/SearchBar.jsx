import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, value }) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <FaSearch className="text-sm text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search jobs by title, company, or location..."
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-500/10 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
