import { IQvConfig, RuleCallBack } from "../contracts";
import { QvConfig } from "../qv.config";
import { QvBag } from "./qv-bag";
import { QvForm } from "./qv-form";
/**
 *
 * Initializes Quickv and applies form validation to all forms in the document.
 * @param config Optional configuration object for Quickv.
 * Example:
 * ```
 * const quickv = new Quickv();
 * quickv.init();
 * ```
 * @author Claude Fassinou
 */
export class Quickv {
  /**
   * Default configuration
   */
  protected config: IQvConfig = QvConfig;
  /**
   * Select all the form in the document and apply QvForm for them
   * @param config
   */
  init(config?: IQvConfig) {
    this.setConfig(config);
    document
      .querySelectorAll<HTMLFormElement>("form")
      .forEach((formElement) => {
        new QvForm(formElement).init();
      });
  }
  /**
   * Adds a new validation rule to Quickv's rule bag.
   * @param ruleName The name of the rule.
   * @param call The rule callback function.
   * @param message Optional error message for the rule.
   * Example:
   * ```
   * quickv.rule('customRule', (value) => value === 'foo', 'Value must be "foo"');
   * ```
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    QvBag.rule(ruleName, call, message);
  }
  /**
   * Set default configuration
   * @param config
   */
  protected setConfig(config?: IQvConfig) {
    this.config = QvConfig;
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
    }
  }

  static Rule(ruleName: string, call: RuleCallBack, message?: string) {
    QvBag.rule(ruleName, call, message);
  }
}
