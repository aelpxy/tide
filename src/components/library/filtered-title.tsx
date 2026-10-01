import { Filter, FilterToggle } from "../ui/filter-toggle";

export function FilteredTitle({
  title,
  filter,
  onChange,
}: {
  title: string;
  filter: Filter;
  onChange: (value: Filter) => void;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">My Collection</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight">{title}</h1>
      </div>
      <FilterToggle label={`Filter ${title.toLowerCase()}`} value={filter} onChange={onChange} />
    </div>
  );
}
