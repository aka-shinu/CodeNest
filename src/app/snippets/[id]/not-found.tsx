import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SnippetNotFound() {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Snippet not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The snippet you're looking for doesn't exist or has been removed.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/snippets">
            <Button>Back to snippets</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 