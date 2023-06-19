## Contribute to our project

We welcome contributions from the community to improve our project. If you encounter problems, have ideas for improvements or would like to make changes to the code, please follow the steps below to contribute.

### Open issues

If you encounter problems or have ideas for improvement, feel free to open an issue on our GitHub repository. Be sure to provide as much detail as possible, including screenshots or sample code, to help us understand and resolve the issue.

### Submit Pull Requests

If you'd like to make changes to the code, we encourage you to propose a pull request. Please follow the steps below:

1. Fork the repository and clone it locally on your machine.
2. Switch to the `2.0.0` branch you wish to work on.
3. Install the project's dependencies locally by running the following command:

```bash
   npm install
```

4. Make any necessary changes and test them thoroughly. For example, you can add a new rule (see below for details).
5. Commit your changes using the command `git commit -m "Description of changes"`.
6. Transfer your changes to your forked repository.
7. Open a pull request on our GitHub repository and provide a detailed description of the changes you've made.

We'll review your request as soon as possible and provide feedback. Be sure to respond to all comments and update your pull request accordingly.

### Participate in discussions

We also have ongoing discussions on various topics related to the project. We invite you to participate in these discussions and share your ideas, suggestions or comments. Your perspective and knowledge can help steer the project in the right direction.

### Code of conduct

We ask you to respect our code of conduct when participating in the project. Please respect other contributors and maintain a collaborative and inclusive environment.

We look forward to working with you and moving this project forward together. Thank you for your interest and commitment!

The development team

---

## Adding a new rule to Quickv

### Step 1

A Quickv rule is simply a callback function that handles validation according to your needs and must return a boolean value. It should implement the `RuleCallBack` interface defined in `./src/contracts/rule-callback.ts`.

Based on the type of data your callback will validate, you should categorize it under one of the following files:

- `./src/rules` (global, number, phone, string, date, file, etc.)

Here's an example implementation of a callback for the `in` rule:

```ts
/**
 * Checks if the input is in the specified list.
 *
 * @param input - The input to be checked.
 * @param params - The list of values to check against. Comma-separated string.
 * @returns `true` if the input is in the list, `false` otherwise.
 */
export const inInput: RuleCallBack = (input, params) => {
  if (!params) {
    throwEmptyArgsException("in");
  }
  const list = splitParam(params as string);
  return list.includes(input);
};
```

Explanation:

1. The first argument, `input`, corresponds to the current value of the field to be validated. It can be of types such as `string`, `Blob`, `File`, `number`, `null`, `boolean`, `undefined`, `FileList`.
2. The second argument, `params`, corresponds to the possible arguments. The arguments are comma-separated strings. You can individually retrieve them using the `splitParam` function.
   For example, if you have an HTML field like this:

```html
<input data-qv-rules="in:active, inactive, suspended" />
```

The values after the colon (`:`) are the parameters. In this case, the second argument would be a string like `"active, inactive, suspended"`. You can use the `splitParam(params ?? "")` function to get an array of individual values, for example, `['active', 'inactive', 'suspended']`.

3. The rest of the code represents the logic of the callback. In this example, we check if the current value of the field is in the specified list and return the result.

**_The callback must return a boolean value._**

#### Naming Convention

As a general convention, it is recommended to give the callback the same name as the rule you want to add. However, this is not mandatory if it causes any issues.

In this example, the rule name is normally `in`, but we had to use `inInput` because the keyword `in` is reserved in JavaScript/TypeScript.

### Step 2: Test the callback

Once you have written your callback, you need to test it to ensure that it works as expected. For this, you can use the Jest testing tool.

Depending on the file where you wrote your callback, you need to go to the corresponding test file to write your test. In this example, the test file is `global.test.ts`.

Here's an example test for the `inInput` callback:

```ts
describe("inInput rule callback", () => {
  it("should return true if the input is in the list", () => {
    const input = "active";
    const params = "active, inactive, suspended";
    const result = inInput(input, params);
    expect(result).toBe(true);
  });

  it("should return false if the input is not in the list", () => {
    const input = "pending";
    const params = "active, inactive, suspended";
    const result = inInput(input, params);
    expect(result).toBe(false);
  });

  it("should throw an error if the params argument is empty", () => {
    const input = "active";
    const params = "";
    expect(() => inInput(input, params)).toThrow();
  });
});
```

You can run the tests using the following command:

```bash
npm test
```

Once your tests pass successfully, you can proceed to the next step.

### Step 3: Add the callback to the rules

All Quickv rules are listed in the `Rule` type, which can be found in the `./src/contracts/rule.ts` file. You need to add your rule to this type for it to be recognized.

Here's an example of adding the `in` rule:

```ts
/**
 * List of Quickv rules grouped by Rule type
 */
export type Rule = "contains" | "in" | "startWithLetter" /*...*/;
```

This also enables auto-completion in your code editor, but it's not the primary purpose of adding the rule to this type.

If you're using a good TypeScript-aware tool, you may notice an error in the `./src/validation/qv-bag.ts` file. This file is where the rules are actually added to Quickv. Until a rule is added to this file, it won't be part of Quickv.

In this file, the `QvBag` class is used to store the rules. You need to add your rule to the `rules` attribute of this class, like this:

```typescript
export class QvBag implements IQvBag {
  private static rules: RulesBag = {
    in: inInput,
  };
}
```

### Step 4: Assign a message

In general, your rule is ready to be used once you have added it. However, you also need to assign a message to the rule. Otherwise, a default message will be used.

To do this, you need to go to the `./src/local/lang` folder. There, you will find the two default languages supported by Quickv (English and French). You need to add the messages corresponding to your rule in these files.

Here's an example of adding messages for the `in` rule:

```ts
export const en_messages: RulesMessages = {
  default: "This field is invalid",
  in: "Please choose a correct value for the :field field",
};
```

You should do the same for the French language.

If you have followed these steps correctly, you can test your rule by using it in an HTML form to see if everything works correctly.

### Summary of the steps:

#### Step 1: Write the rule callback

Here's an example code to write the `in` rule callback:

```typescript
import {
  RuleCallBack,
  spliteParam,
  throwEmptyArgsException,
} from "../validation/quickv";

/**
 * Check if the input value is in the specified list.
 * @param input - The current value of the field to validate. It can be of types such as `string`, `Blob`, `File`, `number`, `null`, `boolean`, `undefined`, `FileList`.
 * @param params - The list of values to check against. Comma-separated string.
 * @returns `true` if the input is in the list, `false` otherwise.
 */
export const inInput: RuleCallBack = (input, params) => {
  if (!params) {
    throwEmptyArgsException("in");
  }
  const list = spliteParam(params as string);
  return list.includes(input);
};
```

#### Step 2: Test the callback with Jest tests

Here's an example test for the `inInput` callback:

```typescript
import { inInput } from "../src/validation/rules/inInput";

describe("inInput rule callback", () => {
  it("should return true if the input is in the list", () => {
    const input = "active";
    const params = "active, inactive, suspended";
    const result = inInput(input, params);
    expect(result).toBe(true);
  });

  it("should return false if the input is not in the list", () => {
    const input = "pending";
    const params = "active, inactive, suspended";
    const result = inInput(input, params);
    expect(result).toBe(false);
  });

  it("should throw an error if params argument is empty", () => {
    const input = "active";
    const params = "";
    expect(() => inInput(input, params)).toThrow();
  });
});
```

#### Step 3: Add the callback to the Rule type

In the `./src/contracts/rule.ts` file, add the `in` rule to the `Rule` type:

```typescript
export type Rule = "contains" | "in" | "startWithLetter";
```

#### Step 4: Add the callback to the QvBag class

In the `./src/validation/qv-bag.ts` file, add the `inInput` rule to the `rules` attribute of the `QvBag` class:

```typescript
import { inInput } from "./rules/inInput";

export class QvBag implements IQvBag {
  private static rules: RulesBag = {
    contains: contains,
    in: inInput,
  };
}
```

#### Step 5: Assign a message to the rule

In the language files `./src/locale/lang`, assign a message to the `in` rule for each supported language. Here's an example for English and French languages:

```typescript
// ./src/local/lang/en.ts
export const en_messages: RulesMessages = {
  default: "This field is invalid",
  contains: "The :field field must contain the value ':arg0'",
  in: "Please choose a correct value for the :field field",
};
```

Once you have completed these steps, you can push your changes and create a Pull Request to contribute to the project.
