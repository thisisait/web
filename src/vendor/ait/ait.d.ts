/* The slice of window.AIT the site uses (see README.md). */
export interface IrisDecision {
  top: string;
  probs: Record<string, number>;
  reasons: Array<{ axis: string; push: number }>;
}
export interface AitIrisEyeElement extends HTMLElement {
  state: string;
  setExpression(e: string | Record<string, number> | null): AitIrisEyeElement;
  setMood(params: Record<string, number>, holdSeconds?: number): AitIrisEyeElement;
  feel(text: string, role?: "user" | "iris"): IrisDecision | null;
  blink(): AitIrisEyeElement;
  lookAt(x: number, y: number, ms?: number): AitIrisEyeElement;
}
declare global {
  interface Window {
    AIT?: {
      IrisTone?: { decide(text: string, role: string, state: string): IrisDecision };
      IrisEye?: { new (): AitIrisEyeElement };
    };
  }
}
