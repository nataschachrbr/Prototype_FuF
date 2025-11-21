# Prototype FuF - CRM Interface

A modern CRM deal management interface built with Next.js, React, and Tailwind CSS.

## Features

- **Deal Management**: View and manage comprehensive project deals
- **Contact Management**: Track contacts and their details
- **Project Scoring**: Automated project fit scoring system
- **Sources Tracking**: Keep track of all project-related sources and documents
- **Action Center**: Quick access to calls, emails, and outreach activities
- **Responsive Design**: Modern, clean interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── components/
│   ├── Sidebar.tsx      # Left navigation sidebar
│   ├── Header.tsx       # Top navigation header
│   ├── MainContent.tsx  # Main content area
│   ├── ContactCard.tsx  # Contact information card
│   ├── ActionTabs.tsx   # Action tabs navigation
│   └── RightSidebar.tsx # Right sidebar with deal details
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## License

MIT
