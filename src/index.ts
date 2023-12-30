import { QvLocal } from "./locale/qv-local";
import { QvConfig } from "./qv.config";
import { Quickv, QvBag, QvForm, QvInput } from "./validation";

declare global {
  interface Window {
    QvInput: typeof QvInput;
    QvForm: typeof QvForm;
    Quickv: typeof Quickv;
    QvBag: typeof QvBag;
    QvLocal: typeof QvLocal;
  }
}

if (typeof window !== "undefined") {
  window.QvInput = window.QvInput ?? QvInput;
  window.QvForm = window.QvForm ?? QvForm;
  window.Quickv = window.Quickv ?? Quickv;
  window.QvBag = window.QvBag ?? QvBag;
  window.QvLocal = window.QvLocal ?? QvLocal;
}

export { Quickv, QvForm, QvInput, QvConfig, QvBag };
