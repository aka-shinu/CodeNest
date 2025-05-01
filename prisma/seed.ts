import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      image: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  });

  // Create some sample snippets
  const snippets = [
    {
      title: "React useState Hook Example",
      description: "A simple example of using the useState hook in React",
      code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
      language: "typescript",
      tags: ["react", "hooks", "typescript"],
      visibility: "public",
      authorId: user.id,
    },
    {
      title: "Python List Comprehension",
      description: "Examples of list comprehension in Python",
      code: `# Basic list comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]

# List comprehension with condition
even_squares = [n**2 for n in numbers if n % 2 == 0]

# Nested list comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]`,
      language: "python",
      tags: ["python", "list-comprehension"],
      visibility: "public",
      authorId: user.id,
    },
    {
      title: "JavaScript Array Methods",
      description: "Common array methods in JavaScript",
      code: `const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);

// Filter
const even = numbers.filter(n => n % 2 === 0);

// Reduce
const sum = numbers.reduce((acc, curr) => acc + curr, 0);

// Find
const firstEven = numbers.find(n => n % 2 === 0);

// Some
const hasEven = numbers.some(n => n % 2 === 0);

// Every
const allPositive = numbers.every(n => n > 0);`,
      language: "javascript",
      tags: ["javascript", "arrays", "functional-programming"],
      visibility: "public",
      authorId: user.id,
    },
  ];

  for (const snippet of snippets) {
    await prisma.snippet.create({
      data: snippet,
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 