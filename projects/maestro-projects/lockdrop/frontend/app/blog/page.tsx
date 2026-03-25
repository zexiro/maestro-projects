import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const metadata = {
  title: 'Blog | LockDrop',
  description: 'Insights on freelancing, payments, and file delivery.',
};

async function getBlogPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  try {
    const filenames = await fs.readdir(postsDirectory);
    const posts = await Promise.all(
      filenames
        .filter(filename => filename.endsWith('.md'))
        .map(async (filename) => {
          const filePath = path.join(postsDirectory, filename);
          const fileContents = await fs.readFile(filePath, 'utf8');
          const { data } = matter(fileContents);
          return {
            slug: data.slug || filename.replace('.md', ''),
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
          };
        })
    );
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="container mx-auto px-4 py-6">
        <Link href="/" className="text-white hover:text-purple-300 transition-colors">
          ← Back to LockDrop
        </Link>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-xl text-purple-200 mb-12">
          Insights on freelancing, payments, and building better tools.
        </p>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-purple-200">No posts yet. Check back soon!</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-white mb-2 hover:text-purple-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-purple-200 text-sm mb-3">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-purple-100">{post.excerpt}</p>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
