export class ContrastUtils {
  private static hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace(/^#/, "");
    const bigint = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16
    );
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  private static srgbToLin(v: number): number {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }

  private static luminance(r: number, g: number, b: number): number {
    return (
      0.2126 * this.srgbToLin(r) +
      0.7152 * this.srgbToLin(g) +
      0.0722 * this.srgbToLin(b)
    );
  }

  private static contrast(l1: number, l2: number): number {
    const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (a + 0.05) / (b + 0.05);
  }

  private static adjust(color: string, darken: boolean, amount = 0.1): string {
    const [r, g, b] = this.hexToRgb(color);
    const mod = (v: number) =>
      Math.max(0, Math.min(255, v + (darken ? -1 : 1) * 255 * amount));
    return `#${[mod(r), mod(g), mod(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  }

  static idealTextColor(bgHex: string, threshold = 4.5): string {
    const bgLum = this.luminance(...this.hexToRgb(bgHex));
    let txt = "#000000";
    let txtLum = 0;
    let ratio = this.contrast(bgLum, txtLum);
    if (ratio < threshold) {
      txt = "#ffffff";
      txtLum = 1;
      ratio = this.contrast(bgLum, txtLum);
    }
    if (ratio >= threshold) return txt;
    let darken = bgLum > 0.5;
    let candidate = txt;
    for (let i = 0; i < 20 && ratio < threshold; i++) {
      candidate = this.adjust(candidate, darken);
      txtLum = this.luminance(...this.hexToRgb(candidate));
      ratio = this.contrast(bgLum, txtLum);
    }
    return candidate;
  }

  static applyContrastToButton(button: HTMLElement): void {
    const computedStyle = window.getComputedStyle(button);
    const backgroundColor = computedStyle.backgroundColor;

    let bgHex = backgroundColor;
    if (backgroundColor.startsWith("rgb")) {
      const rgbMatch = backgroundColor.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0]);
        const g = parseInt(rgbMatch[1]);
        const b = parseInt(rgbMatch[2]);
        bgHex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      }
    }

    if (bgHex && bgHex !== "rgba(0, 0, 0, 0)" && bgHex !== "transparent") {
      const idealColor = this.idealTextColor(bgHex);
      button.style.color = idealColor;
    }
  }
}
