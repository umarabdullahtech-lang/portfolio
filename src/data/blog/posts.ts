import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-ai-agents-with-langchain',
    title: 'Building Production-Ready AI Agents with LangChain',
    excerpt: 'Learn how to build robust AI agents that handle real-world tasks autonomously, from customer support to data analysis.',
    content: `
# Building Production-Ready AI Agents with LangChain

AI agents are transforming how we approach automation and problem-solving in software engineering. In this post, I'll share my experience building production-grade AI agents that handle thousands of queries daily.

## What Are AI Agents?

AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. Unlike simple chatbots, they can:

- **Plan and execute** complex multi-step tasks
- **Use tools** and external APIs
- **Learn and adapt** from interactions
- **Handle errors** gracefully

## The LangChain Framework

LangChain provides the building blocks for creating sophisticated AI workflows:

\`\`\`typescript
import { OpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";

// Initialize the model
const model = new OpenAI({
  temperature: 0,
  modelName: "gpt-4",
});

// Create an agent with tools
const agent = await createOpenAIFunctionsAgent({
  llm: model,
  tools: [searchTool, calculatorTool, emailTool],
  prompt: await pull("hwchase17/openai-functions-agent"),
});

const executor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
});
\`\`\`

## Key Architecture Patterns

### 1. Tool-Based Design
Create modular tools that agents can combine:

\`\`\`typescript
const searchTool = new DynamicTool({
  name: "web_search",
  description: "Search the web for current information",
  func: async (input: string) => {
    // Implementation here
    return await searchAPI(input);
  },
});
\`\`\`

### 2. Memory Management
Implement proper conversation memory:

\`\`\`typescript
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});
\`\`\`

### 3. Error Handling
Build resilient agents with proper error handling:

\`\`\`typescript
const executor = new AgentExecutor({
  agent,
  tools,
  maxIterations: 5,
  handleParsingErrors: (error) => {
    return \`I encountered an error: \${error.message}. Let me try a different approach.\`;
  },
});
\`\`\`

## Production Considerations

### Scaling
- Use **queue systems** (BullMQ) for high-volume processing
- Implement **rate limiting** to respect API quotas
- **Cache responses** for common queries

### Monitoring
- Track **token usage** and costs
- Monitor **response times** and error rates
- Log **agent decisions** for debugging

### Security
- **Sanitize inputs** to prevent prompt injection
- **Validate outputs** before executing actions
- **Implement access controls** for sensitive tools

## Real-World Example

Here's a simplified version of a customer support agent I built:

\`\`\`typescript
const supportAgent = new AgentExecutor({
  agent: await createOpenAIFunctionsAgent({
    llm: model,
    tools: [
      knowledgeBaseTool,
      ticketCreationTool,
      escalationTool,
    ],
    prompt: supportPrompt,
  }),
  tools,
  memory,
});

// Handle customer query
const response = await supportAgent.call({
  input: "I can't access my account",
  chat_history: previousMessages,
});
\`\`\`

## Results

Our AI support agent now:
- **Resolves 92%** of queries automatically
- **Reduces response time** from hours to seconds
- **Handles 10,000+** queries daily
- **Maintains 98%** customer satisfaction

## Conclusion

Building production AI agents requires careful consideration of architecture, error handling, and scalability. Start simple, test thoroughly, and iterate based on real-world usage.

The future of software engineering is increasingly autonomous, and AI agents are leading that transformation.
    `,
    publishedAt: '2024-01-15',
    readingTime: 8,
    tags: ['AI', 'LangChain', 'Automation', 'TypeScript'],
    featured: true,
    author: {
      name: 'Umar Abdullah',
    },
  },
  {
    slug: 'nextjs-performance-optimization',
    title: 'Next.js 15 Performance Optimization Strategies',
    excerpt: 'Comprehensive guide to optimizing Next.js applications for maximum performance and user experience.',
    content: `
# Next.js 15 Performance Optimization Strategies

Performance is critical for user experience and SEO. Here's my comprehensive guide to optimizing Next.js applications based on real-world projects.

## Core Optimization Techniques

### 1. Image Optimization

\`\`\`tsx
import Image from 'next/image';

// Use priority for above-the-fold images
<Image
  src="/hero-image.jpg"
  alt="Hero"
  priority
  width={1200}
  height={800}
  className="w-full h-auto"
/>

// Lazy load other images
<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  loading="lazy"
/>
\`\`\`

### 2. Code Splitting

\`\`\`tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const Chart = dynamic(() => import('../components/Chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Skip server-side rendering if needed
});
\`\`\`

### 3. Font Optimization

\`\`\`tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
\`\`\`

## Advanced Techniques

### Server-Side Optimization

\`\`\`tsx
// Use generateStaticParams for dynamic routes
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Implement proper caching
export const revalidate = 3600; // Revalidate every hour
\`\`\`

### Database Optimization

\`\`\`typescript
// Use connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
});

// Implement query optimization
const posts = await db.select({
  id: posts.id,
  title: posts.title,
  // Only select needed fields
}).from(posts)
.where(eq(posts.published, true))
.limit(10);
\`\`\`

## Monitoring and Measurement

Use Next.js built-in analytics:

\`\`\`typescript
import { unstable_noStore as noStore } from 'next/cache';

export default async function Page() {
  noStore(); // Opt out of caching for dynamic data

  const data = await fetchData();

  return <div>{/* Component */}</div>;
}
\`\`\`

## Results

After implementing these optimizations:
- **Lighthouse score**: 95+ across all metrics
- **First Contentful Paint**: Under 1.2s
- **Largest Contentful Paint**: Under 2.5s
- **Bundle size**: Reduced by 40%
    `,
    publishedAt: '2024-02-01',
    readingTime: 6,
    tags: ['Next.js', 'Performance', 'React', 'Web Development'],
    featured: false,
    author: {
      name: 'Umar Abdullah',
    },
  },
  {
    slug: 'web-scraping-at-scale',
    title: 'Web Scraping at Scale: Architecture and Best Practices',
    excerpt: 'Building a distributed web scraping system that processes 500K+ pages daily with 99.9% uptime.',
    content: `
# Web Scraping at Scale: Architecture and Best Practices

Web scraping becomes exponentially more complex as you scale from hundreds to hundreds of thousands of pages. Here's how I built a system that handles 500K+ pages daily.

## Architecture Overview

Our scraping infrastructure consists of:

- **Queue System**: BullMQ with Redis
- **Worker Nodes**: Puppeteer clusters
- **Proxy Rotation**: Smart proxy management
- **Data Pipeline**: Real-time processing and storage

## Core Components

### 1. Queue Management

\`\`\`typescript
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
});

const scrapeQueue = new Queue('scraping', { connection });

// Add jobs with priority and delay
await scrapeQueue.add(
  'scrape-product',
  { url: 'https://example.com/product/1' },
  {
    priority: 1,
    delay: 1000,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  }
);
\`\`\`

### 2. Puppeteer Cluster

\`\`\`typescript
import { Cluster } from 'puppeteer-cluster';

const cluster = await Cluster.launch({
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: 10,
  puppeteerOptions: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  },
});

await cluster.task(async ({ page, data }) => {
  await page.goto(data.url, { waitUntil: 'networkidle0' });

  // Extract data
  const result = await page.evaluate(() => ({
    title: document.querySelector('h1')?.textContent,
    price: document.querySelector('.price')?.textContent,
    // ... more selectors
  }));

  return result;
});
\`\`\`

### 3. Anti-Detection Strategies

\`\`\`typescript
// Stealth mode
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';

puppeteer.use(StealthPlugin());

// Random delays
const randomDelay = () => Math.floor(Math.random() * 3000) + 1000;

// Rotate user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  // ... more user agents
];

await page.setUserAgent(
  userAgents[Math.floor(Math.random() * userAgents.length)]
);
\`\`\`

## Scaling Strategies

### Horizontal Scaling

Deploy multiple worker instances:

\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  scraper:
    image: scraper:latest
    deploy:
      replicas: 5
    environment:
      - REDIS_URL=redis://redis:6379
      - WORKER_CONCURRENCY=10
\`\`\`

### Resource Management

\`\`\`typescript
// Monitor memory usage
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, gracefully shutting down');
  await cluster.close();
  process.exit(0);
});

// Memory cleanup
setInterval(() => {
  if (process.memoryUsage().heapUsed > 1024 * 1024 * 500) { // 500MB
    console.log('Memory usage high, restarting worker');
    process.exit(0);
  }
}, 30000);
\`\`\`

## Error Handling and Resilience

\`\`\`typescript
const worker = new Worker(
  'scraping',
  async (job: Job) => {
    try {
      const result = await scrapeWithRetry(job.data);
      return result;
    } catch (error) {
      console.error(\`Job \${job.id} failed:\`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 100,
      duration: 60000, // 100 jobs per minute
    },
  }
);

async function scrapeWithRetry(data: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await performScrape(data);
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
\`\`\`

## Results and Metrics

Our production system achieves:

- **Throughput**: 500K+ pages/day
- **Success Rate**: 98.5%
- **Uptime**: 99.9%
- **Average Processing Time**: 2.3 seconds per page
- **Cost**: $0.001 per page processed

## Key Takeaways

1. **Queue everything** - Use robust queue systems for reliability
2. **Respect rate limits** - Implement proper delays and throttling
3. **Monitor actively** - Track success rates and error patterns
4. **Plan for failure** - Build comprehensive retry mechanisms
5. **Scale horizontally** - Distribute load across multiple workers

Web scraping at scale requires careful engineering, but the results are worth the effort when done right.
    `,
    publishedAt: '2024-01-28',
    readingTime: 10,
    tags: ['Web Scraping', 'Puppeteer', 'Node.js', 'Distributed Systems'],
    featured: true,
    author: {
      name: 'Umar Abdullah',
    },
  },
  {
    slug: 'typescript-patterns-for-better-apis',
    title: 'Advanced TypeScript Patterns for Better APIs',
    excerpt: 'Explore advanced TypeScript patterns that make your APIs more type-safe, maintainable, and developer-friendly.',
    content: `
# Advanced TypeScript Patterns for Better APIs

TypeScript's type system is incredibly powerful when used effectively. Here are advanced patterns I use to build better APIs.

## Conditional Types

\`\`\`typescript
type ApiResponse<T> = T extends string
  ? { message: T }
  : { data: T };

// Usage
type StringResponse = ApiResponse<string>; // { message: string }
type DataResponse = ApiResponse<User>; // { data: User }
\`\`\`

## Template Literal Types

\`\`\`typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = \`/api/v1/\${string}\`;

interface Request<M extends HttpMethod, E extends ApiEndpoint> {
  method: M;
  endpoint: E;
  body?: M extends 'GET' | 'DELETE' ? never : unknown;
}

// Compile-time validation
const validRequest: Request<'POST', '/api/v1/users'> = {
  method: 'POST',
  endpoint: '/api/v1/users',
  body: { name: 'John' }, // ✅ Valid
};

const invalidRequest: Request<'GET', '/api/v1/users'> = {
  method: 'GET',
  endpoint: '/api/v1/users',
  body: { name: 'John' }, // ❌ Type error: body not allowed for GET
};
\`\`\`

## Branded Types

\`\`\`typescript
// Create distinct types for IDs
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }
function getProduct(id: ProductId) { /* ... */ }

const userId = createUserId('user-123');
const productId = 'product-456' as ProductId;

getUser(userId); // ✅ Valid
getUser(productId); // ❌ Type error: Cannot assign ProductId to UserId
\`\`\`

## Result Types for Error Handling

\`\`\`typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: UserId): Promise<Result<User, 'NOT_FOUND' | 'NETWORK_ERROR'>> {
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: 'NOT_FOUND' };
    }
    return { success: true, data: user };
  } catch {
    return { success: false, error: 'NETWORK_ERROR' };
  }
}

// Usage with type narrowing
const result = await fetchUser(userId);
if (result.success) {
  console.log(result.data.name); // ✅ TypeScript knows this is User
} else {
  console.error(result.error); // ✅ TypeScript knows this is the error type
}
\`\`\`

## Builder Pattern with Fluent Interface

\`\`\`typescript
class QueryBuilder<T = unknown> {
  private _select?: string[];
  private _where?: Record<string, unknown>;
  private _limit?: number;

  select<K extends keyof T>(fields: K[]): QueryBuilder<Pick<T, K>> {
    this._select = fields as string[];
    return this as any;
  }

  where(conditions: Partial<T>): this {
    this._where = conditions;
    return this;
  }

  limit(count: number): this {
    this._limit = count;
    return this;
  }

  build(): string {
    // Build SQL query from accumulated state
    return \`SELECT \${this._select?.join(', ') || '*'} FROM table\`;
  }
}

// Usage with full type safety
const query = new QueryBuilder<User>()
  .select(['name', 'email']) // Only User properties allowed
  .where({ active: true })
  .limit(10)
  .build();
\`\`\`

## Mapped Types for API Validation

\`\`\`typescript
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

// Create user requires name and email
type CreateUserRequest = PartialExcept<User, 'name' | 'email'>;

// Update user requires id but everything else is optional
type UpdateUserRequest = RequireFields<Partial<User>, 'id'>;

function createUser(data: CreateUserRequest): Promise<User> { /* ... */ }
function updateUser(data: UpdateUserRequest): Promise<User> { /* ... */ }
\`\`\`

## Discriminated Unions for API Events

\`\`\`typescript
type ApiEvent =
  | { type: 'USER_CREATED'; payload: { user: User } }
  | { type: 'USER_UPDATED'; payload: { user: User; changes: Partial<User> } }
  | { type: 'USER_DELETED'; payload: { userId: string } };

function handleEvent(event: ApiEvent) {
  switch (event.type) {
    case 'USER_CREATED':
      console.log(\`Created user: \${event.payload.user.name}\`);
      break;
    case 'USER_UPDATED':
      console.log(\`Updated user: \${event.payload.user.name}\`);
      console.log('Changes:', event.payload.changes);
      break;
    case 'USER_DELETED':
      console.log(\`Deleted user: \${event.payload.userId}\`);
      break;
    default:
      // TypeScript ensures all cases are handled
      const _exhaustive: never = event;
  }
}
\`\`\`

## Generic Utilities for API Responses

\`\`\`typescript
// Pagination wrapper
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// API endpoint type generation
type Endpoints = {
  '/users': {
    GET: { response: PaginatedResponse<User> };
    POST: { body: CreateUserRequest; response: User };
  };
  '/users/:id': {
    GET: { params: { id: string }; response: User };
    PUT: { params: { id: string }; body: UpdateUserRequest; response: User };
    DELETE: { params: { id: string }; response: { success: boolean } };
  };
};

// Type-safe API client
class ApiClient {
  async request<
    Path extends keyof Endpoints,
    Method extends keyof Endpoints[Path]
  >(
    path: Path,
    method: Method,
    options?: Endpoints[Path][Method] extends { body: infer B; params: infer P }
      ? { body: B; params: P }
      : Endpoints[Path][Method] extends { body: infer B }
      ? { body: B }
      : Endpoints[Path][Method] extends { params: infer P }
      ? { params: P }
      : never
  ): Promise<Endpoints[Path][Method] extends { response: infer R } ? R : never> {
    // Implementation here
    return {} as any;
  }
}

// Usage with full type safety
const client = new ApiClient();
const user = await client.request('/users/:id', 'GET', { params: { id: '123' } });
// user is typed as User
\`\`\`

These patterns help create APIs that are not just functional, but truly type-safe and maintainable at scale.
    `,
    publishedAt: '2024-02-10',
    readingTime: 7,
    tags: ['TypeScript', 'API Design', 'Type Safety', 'Software Architecture'],
    featured: false,
    author: {
      name: 'Umar Abdullah',
    },
  },
];

// Helper functions
export function getBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}