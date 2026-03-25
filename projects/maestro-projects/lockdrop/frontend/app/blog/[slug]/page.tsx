import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  try {
    const filenames = await fs.readdir(postsDirectory);
    const filename = filenames.find(f => f.replace('.md', '') === slug || f.includes(slug));
    if (!filename) return null;

    const filePath = path.join(postsDirectory, filename);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      contentHtml,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostProps) {
  const post = await getPost(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found | LockDrop',
    };
  }
  return {
    title: `${post.title} | LockDrop Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="container mx-auto px-4 py-6">
        <Link href="/blog" className="text-white hover:text-purple-300 transition-colors">
          ← Back to Blog
        </Link>
      </nav>

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>
          <p className="text-purple-200">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <div
          className="prose prose-invert prose-purple max-w-none
            prose-headings:text-white
            prose-p:text-purple-100
            prose-a:text-purple-300 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-ul:text-purple-100
            prose-ol:text-purple-100
            prose-li:text-purple-100"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="mt-12 pt-8 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-3">Try LockDrop</h3>
            <p className="text-purple-100 mb-4">
              Stop chasing unpaid invoices. Get paid when you deliver.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
