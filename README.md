# EcoFinds - Sustainable Marketplace

EcoFinds is a full-stack web application built with Next.js that allows users to buy and sell pre-owned goods in a sustainable marketplace. It features a clean, modern interface with a "Black and Gold" theme and is designed to be fully responsive across all devices.

## Features

- *User Authentication*: Secure user sign-up and login functionality.
- *Product Management*: Users can create, view, edit, and delete their own product listings.
- *Marketplace*: Browse, search, and filter products by category.
- *Shopping Cart*: Add items to a cart for purchase.
- *Checkout System*: A simulated checkout process to "purchase" items.
- *User Account Page*: A dedicated section for users to manage their listings, view purchase history, and update their profile.
- *Theme Toggle*: Switch between light and dark modes for a personalized viewing experience.
- *Responsive Design*: Fully optimized for a seamless experience on desktop, tablet, and mobile devices.

## Tech Stack

- *Framework*: [Next.js](https://nextjs.org/)
- *Language*: [TypeScript](https://www.typescriptlang.org/)
- *UI Library*: [React](https://react.dev/)
- *Styling*: [Tailwind CSS](https://tailwindcss.com/)
- *Components*: [ShadCN UI](https://ui.shadcn.com/)
- *Generative AI*: [Firebase Genkit](https://firebase.google.com/docs/genkit)

## Getting Started

Follow these steps to get the development environment running.

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 20 or later) and npm installed on your machine.

### 2. Install Dependencies

In your project terminal, run the following command to install all the necessary packages:

bash
npm install


### 3. Run the Development Server

Once the dependencies are installed, you can start the Next.js development server:

bash
npm run dev


This will start the application on http://localhost:9002. You can now open this URL in your web browser to see the application running.

### 4. Project Structure

- **src/app**: Contains all the pages and routing for the application, following the Next.js App Router structure.
- **src/components**: Reusable React components used throughout the application, including UI components from ShadCN.
- **src/context**: The AppContext provides global state management for user data, products, and the shopping cart.
- **src/lib**: Includes type definitions (types.ts), initial data (data.ts), and utility functions (utils.ts).
- **src/ai**: Genkit flows and configuration for generative AI features.
- **public**: Static assets like images and fonts.
- **tailwind.config.ts**: Configuration for Tailwind CSS.