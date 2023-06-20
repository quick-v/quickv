# Quickv
Quickv is a user-friendly JavaScript library for HTML form validation. It allows you to quickly add validation rules to your form fields using custom HTML attributes, without the need to write additional JavaScript code. Quickv's custom HTML attributes are easy to understand and use, enabling you to quickly set up a robust validation system without spending a lot of time creating custom validation functions or writing complex JavaScript code.

## Quickv Features

1. Lightweight and easy to install.
2. Supports a wide range of validation rules, including required, email, number, date, and more.
3. Highly customizable. You can change the default validation messages, the style of feedback divs, and even the behavior of Quickv.
4. Quickv is an open-source and free library.


To get started with Quickv, please refer to the comprehensive documentation available [here](https://quickv.vercel.app/). You can also follow a quick tutorial of less than 5 minutes [here](https://quickv.vercel.app/docs/tutorial) to familiarize yourself with Quickv.

[Documentation](https://quickv.vercel.app)

## Development
If you would like to contribute to the development of Quickv or customize the library, here's what you need:

### Prerequisites

- Node.js >= 16
- Installed npm
- Knowledge of TypeScript

### Installation

Here are the steps to clone and install the Quickv project:

1. Clone the project using the following command:
```bash
git clone https://github.com/quick-v/quickv.git
```
2. Navigate to the project's root directory.
3. Install the dependencies by running the following command:
```bash
npm install
```
4. If the installation is successful, start the development server with the following command:
```bash
npm run dev
```
This will start a local development server, and a link to the Quickv homepage (e.g., `http://localhost:5173`) will be displayed in your terminal.

To create the bundles, run the following command:
```bash
npm run build
```
This command will generate the `index.mjs` and `index.umd.js` files in the `./dist` folder. The first file is intended for use as an ES6 module, while the second file is suitable for UMD systems.
You can also use the `npm run build:watch` command to automatically compile files while you work.
The directory structure of the Quickv project is organized as follows:
- `src`: contains the main code of Quickv.
- `src/contracts`: contains interfaces and types used in Quickv.
- `src/locale`: contains internationalization files for different supported languages.
- `src/messages`: contains message generation files based on validation rules.
- `src/rules`: contains various validation rules available in Quickv.
- `src/utils`: contains utility files for Quickv.
- `src/validation`: contains the validation logic of Quickv.
- `dist`: contains the bundle files.
- `types`: contains TypeScript declarations.

### Contribution

The Quickv library is available on [GitHub](https://github.com/quick-v/quickv) under an open-source license.

We would be delighted to receive your contributions to the Quickv project. Please refer to our [contribution guidelines](https://quickv.vercel.app/docs/contribution) for more information. Also, make sure to review our [code of conduct](https://quickv.vercel.app/docs/contribution#code-de-conduite) before contributing.

Thank you to all the contributors who are involved in the development of Quickv.

Useful links:
- Discord: [https://discord.gg/wPPAfq5n](https://discord.gg/wPPAfq5n) 

If you have any questions or concerns, you can contact us via email at dev.claudy@gmail.com.



Quickv is released under our [license](https://quickv.vercel.app/docs/license) and developed by [Claude Fassinou](https://github.com/Claudye) and contributors.

Best regards

## Security

If you discover any security-related issues, please contact me directly at dev.claudy@gmail.com instead of using the issue tracker