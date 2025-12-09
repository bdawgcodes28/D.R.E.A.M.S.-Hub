import { COLORS_CONSTANTS } from "../../styles/StyleConstants";

export function Footer() {
  return (
    <footer className="bg-[black] text-[white] flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between pr-[40px] pl-[20px]">
      <p className="text-blue-gray-600 font-normal">
        &copy; 2024 Dreams Hub
      </p>
      <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
        <li>
          <a
            href="/about"
            className="text-blue-gray-600 font-normal transition-colors"
            style={{
              '--hover-color': COLORS_CONSTANTS.DREAMS_PINK,
              '--focus-color': COLORS_CONSTANTS.DREAMS_PINK
            }}
            onMouseEnter={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onMouseLeave={(e) => e.target.style.color = ''}
            onFocus={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onBlur={(e) => e.target.style.color = ''}
          >
            about us
          </a>
        </li>
        {/* <li>
          <a
            href="#"
            className="text-blue-gray-600 font-normal transition-colors"
            onMouseEnter={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onMouseLeave={(e) => e.target.style.color = ''}
            onFocus={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onBlur={(e) => e.target.style.color = ''}
          >
            license
          </a>
        </li> */}
        {/* <li>
          <a
            href="#"
            className="text-blue-gray-600 font-normal transition-colors"
            onMouseEnter={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onMouseLeave={(e) => e.target.style.color = ''}
            onFocus={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onBlur={(e) => e.target.style.color = ''}
          >
            contribute
          </a>
        </li> */}
        <li>
          <a
            href="#"
            className="text-blue-gray-600 font-normal transition-colors"
            onMouseEnter={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onMouseLeave={(e) => e.target.style.color = ''}
            onFocus={(e) => e.target.style.color = COLORS_CONSTANTS.DREAMS_PINK}
            onBlur={(e) => e.target.style.color = ''}
          >
            contact us
          </a>
        </li>
      </ul>
    </footer>
  );
}