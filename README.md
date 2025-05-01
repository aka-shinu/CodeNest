# CodeNest - Code Snippet Sharing Platform

A modern platform for sharing and discovering code snippets, built with Next.js, TypeScript, and Prisma.

## Features

- 🚀 Modern tech stack: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- 🔐 Authentication with NextAuth.js (Google & GitHub)
- 💾 PostgreSQL database with Prisma ORM
- 🎨 Beautiful UI with dark mode support
- 📱 Fully responsive design
- 🔍 Search and filter snippets
- 💬 Comments and likes system
- 📊 User profiles and analytics

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- GitHub OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/codenest.git
cd codenest
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/codenest"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
codenest/
├── prisma/           # Database schema and migrations
├── public/           # Static assets
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # React components
│   ├── lib/         # Utility functions
│   └── types/       # TypeScript type definitions
├── .env             # Environment variables
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/) 