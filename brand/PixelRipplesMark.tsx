import type { SVGProps } from "react";

type PixelRipplesMarkProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

/**
 * Pixel Ripples · Split Arc
 * Color comes from CSS `color` via currentColor. Works with Tailwind text-*.
 * There is no embedded font, image, or raster asset.
 */
export function PixelRipplesMark({
  size = 36,
  className,
  ...props
}: PixelRipplesMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M34 22 A54 54 0 0 1 88 76" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" />
      <path d="M34 39 A37 37 0 0 1 71 76" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" />
      <path d="M34 56 A20 20 0 0 1 54 76" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" />
      <rect x="8" y="80" width="9" height="9" fill="currentColor" />
      <rect x="19" y="68" width="9" height="9" fill="currentColor" />
      <rect x="30" y="56" width="9" height="9" fill="currentColor" />
    </svg>
  );
}
