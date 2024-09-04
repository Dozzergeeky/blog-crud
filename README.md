# Blogging Website

Welcome to our modern, smooth, and fast blogging website! This project leverages the power of Next.js, shadcn, and SQLite to deliver a seamless user experience. Whether you're a developer looking to contribute or just curious about how it works, this guide will help you get started.

## Getting Started

Follow these instructions to set up the project locally.
### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v14.x or later)
- npm, yarn, pnpm, or bun (choose one package manager)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Dozzergeeky/blog-crud.git
    cd blog-crud
    ```

2. **Install dependencies:**

    ```bash
    # Using npm
    npm install

    # Using yarn
    yarn install

    # Using pnpm
    pnpm install

    # Using bun
    bun install
    
    #Basic Test Database is already created in the project. You can use it to test the project.
    ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Folder Structure
Here's an overview of the project's folder structure:
blog-crud/
├── app/
│   ├── components/
│   │   ├── BlogCard.tsx
│   │   ├── Header.tsx
│   ├── page.tsx
├── public/
│   ├── favicon.ico
│   ├── vercel.svg
├── styles/
│   ├── globals.css
├── database.sqlite
├── package.json
├── README.md
├── vercel.json

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more detail.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Contributing
We welcome contributions! Please read our Contributing Guide to learn how you can help.

## License

This project is licensed under the MIT License - see the LICENSE file for details.