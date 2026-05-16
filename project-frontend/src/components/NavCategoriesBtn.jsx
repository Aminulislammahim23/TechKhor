export default function NavCategoriesBtn({ fillNavbarPosition = false }) {
  const wrapperClass = fillNavbarPosition
    ? "navbar sticky top-0 z-50 min-h-16 w-full border-b border-base-300/70 bg-base-100/90 px-4 shadow-sm backdrop-blur-md"
    : "sticky top-0 z-40 w-full border-b border-base-300/70 bg-base-100/90 px-4 py-2 shadow-sm backdrop-blur-md";

  return (
    <div className={wrapperClass}>
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-sm">
          Categories
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content menu z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow"
        >
          <li>
            <a>Computers</a>
          </li>
          <li>
            <a>Mobile Phones</a>
          </li>
          <li>
            <a>Gaming Consoles</a>
          </li>
          <li>
            <a>Accessories</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
