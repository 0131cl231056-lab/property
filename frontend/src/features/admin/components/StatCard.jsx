const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  delay = 0,
}) => (
  <div
    className="
      group
      bg-white
      border border-stone-200
      rounded-2xl
      px-5 py-4
      transition-all duration-300
      hover:border-stone-300
      hover:shadow-md
    "
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-stone-500">
          {title}
        </p>

        <h2
          className="mt-1 text-3xl font-bold leading-none text-stone-900"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {typeof value === "number"
            ? value.toLocaleString("en-IN")
            : value}
        </h2>

        {change && (
          <p className="mt-1.5 text-xs text-stone-500">{change}</p>
        )}
      </div>

      <div
        className="
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl
          border border-stone-200
          bg-stone-100
          transition-colors duration-300
          group-hover:border-stone-900
          group-hover:bg-stone-900
        "
      >
        <Icon
          className="h-5 w-5 text-stone-600 transition-colors group-hover:text-white"
          strokeWidth={1.8}
        />
      </div>
    </div>
  </div>
);

export default StatCard;