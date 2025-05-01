# CodeNest - Where Code Meets Community

> A modern code snippet sharing platform built with Next.js 14, TypeScript, and Prisma. Share your code, get feedback, and learn from the community. Features include syntax highlighting, comments, likes, and real-time updates.

Welcome to CodeNest, a modern platform where developers can share, discover, and collaborate on code snippets. Built with the latest web technologies, CodeNest offers a seamless experience for sharing your code with the world.

## What Makes CodeNest Special?

CodeNest isn't just another code sharing platform. It's a community-driven space where developers can:

- Share their code snippets with beautiful syntax highlighting
- Get feedback through comments and likes
- Discover code from other developers
- Build their coding portfolio
- Learn from real-world examples

## Tech Stack

We've built CodeNest using cutting-edge technologies to ensure a smooth and modern experience:

- **Next.js 14**: For a blazing-fast, SEO-friendly web application
- **TypeScript**: For type-safe, maintainable code
- **Tailwind CSS**: For a beautiful, responsive design
- **Prisma**: For type-safe database operations
- **PostgreSQL**: For reliable data storage
- **NextAuth.js**: For secure authentication
- **shadcn/ui**: For a consistent and modern UI

## Getting Started

Ready to dive in? Here's how to get CodeNest running on your machine:

1. First, clone the repository:
```bash
git clone https://github.com/yourusername/codenest.git
cd codenest
```

2. Install the dependencies:
```bash
npm install
```

3. Set up your environment variables by creating a `.env` file in the root directory:
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

4. Set up your database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser and start exploring!

## Project Structure

CodeNest follows a clean and organized structure:

```
codenest/
├── prisma/           # Database schema and migrations
├── public/           # Static assets
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # React components
│   ├── lib/         # Utility functions
│   └── types/       # TypeScript type definitions
```

## Contributing

We love contributions! Whether it's a bug fix, feature addition, or documentation improvement, your help makes CodeNest better for everyone. Here's how you can contribute:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

CodeNest is open-source software licensed under the MIT License. Feel free to use it for your own projects!

## Acknowledgments

A big thank you to all the amazing open-source projects that made CodeNest possible:

- [Next.js](https://nextjs.org/) for the incredible React framework
- [Prisma](https://www.prisma.io/) for the powerful database toolkit
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [NextAuth.js](https://next-auth.js.org/) for the authentication solution

## Support

If you run into any issues or have questions, feel free to:

- Open an issue on GitHub
- Join our community discussions
- Reach out to us directly

Happy coding! 🚀 