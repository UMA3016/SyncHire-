import { JOB_TYPES } from '../../utils/constants';

const FilterBar = ({ onFilter, activeFilter }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {JOB_TYPES.map((type) => {
        const isActive = activeFilter === type;
        return (
          <button
            key={type}
            onClick={() => onFilter(type)}
            className={`shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-slate-600 text-white shadow-md shadow-slate-500/25'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
