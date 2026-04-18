import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@umar-abdullah.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@umar-abdullah.com',
      password: hashedPassword,
      name: 'Umar Abdullah',
    },
  });
  console.log('Admin user created');

  // Blog Posts
  const blogPosts = [
    {
      slug: 'building-ai-agents-with-langchain',
      title: 'Building Production-Ready AI Agents with LangChain',
      excerpt: 'Learn how to build robust AI agents that handle real-world tasks autonomously, from customer support to data analysis.',
      content: `# Building Production-Ready AI Agents with LangChain

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

const model = new OpenAI({
  temperature: 0,
  modelName: "gpt-4",
});

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
Create modular tools that agents can combine.

### 2. Memory Management
Implement proper conversation memory for context retention.

### 3. Error Handling
Build resilient agents with proper error handling and retry mechanisms.

## Production Considerations

- Use **queue systems** (BullMQ) for high-volume processing
- Implement **rate limiting** to respect API quotas
- **Cache responses** for common queries
- Track **token usage** and costs
- **Sanitize inputs** to prevent prompt injection

## Results

Our AI support agent now:
- **Resolves 92%** of queries automatically
- **Reduces response time** from hours to seconds
- **Handles 10,000+** queries daily
- **Maintains 98%** customer satisfaction

Building production AI agents requires careful consideration of architecture, error handling, and scalability.`,
      tags: ['AI', 'LangChain', 'Automation', 'TypeScript'],
      category: 'AI Engineering',
      author: 'Umar Abdullah',
      publishedAt: new Date('2024-01-15'),
      featured: true,
      readingTime: 8,
      status: 'published',
    },
    {
      slug: 'nextjs-performance-optimization',
      title: 'Next.js 15 Performance Optimization Strategies',
      excerpt: 'Comprehensive guide to optimizing Next.js applications for maximum performance and user experience.',
      content: `# Next.js 15 Performance Optimization Strategies

Performance is critical for user experience and SEO. Here's my comprehensive guide to optimizing Next.js applications based on real-world projects.

## Core Optimization Techniques

### 1. Image Optimization
Use Next.js Image component with priority for above-the-fold images and lazy loading for others.

### 2. Code Splitting
Use dynamic imports to lazy load heavy components.

### 3. Font Optimization
Use next/font for optimal font loading with display swap.

## Advanced Techniques

### Server-Side Optimization
Use generateStaticParams for dynamic routes and implement proper caching with revalidation.

### Database Optimization
Use connection pooling and select only needed fields.

## Results

After implementing these optimizations:
- **Lighthouse score**: 95+ across all metrics
- **First Contentful Paint**: Under 1.2s
- **Largest Contentful Paint**: Under 2.5s
- **Bundle size**: Reduced by 40%`,
      tags: ['Next.js', 'Performance', 'React', 'Web Development'],
      category: 'Web Development',
      author: 'Umar Abdullah',
      publishedAt: new Date('2024-02-01'),
      featured: false,
      readingTime: 6,
      status: 'published',
    },
    {
      slug: 'web-scraping-at-scale',
      title: 'Web Scraping at Scale: Architecture and Best Practices',
      excerpt: 'Building a distributed web scraping system that processes 500K+ pages daily with 99.9% uptime.',
      content: `# Web Scraping at Scale: Architecture and Best Practices

Web scraping becomes exponentially more complex as you scale from hundreds to hundreds of thousands of pages. Here's how I built a system that handles 500K+ pages daily.

## Architecture Overview

Our scraping infrastructure consists of:
- **Queue System**: BullMQ with Redis
- **Worker Nodes**: Puppeteer clusters
- **Proxy Rotation**: Smart proxy management
- **Data Pipeline**: Real-time processing and storage

## Core Components

### 1. Queue Management
Use BullMQ with priority, delay, and exponential backoff retry strategies.

### 2. Puppeteer Cluster
Run multiple browser contexts with concurrency control.

### 3. Anti-Detection Strategies
Stealth mode, random delays, and user agent rotation.

## Scaling Strategies

Deploy multiple worker instances with Docker and monitor memory usage for graceful restarts.

## Results

- **Throughput**: 500K+ pages/day
- **Success Rate**: 98.5%
- **Uptime**: 99.9%
- **Average Processing Time**: 2.3 seconds per page`,
      tags: ['Web Scraping', 'Puppeteer', 'Node.js', 'Distributed Systems'],
      category: 'Backend Engineering',
      author: 'Umar Abdullah',
      publishedAt: new Date('2024-01-28'),
      featured: true,
      readingTime: 10,
      status: 'published',
    },
    {
      slug: 'typescript-patterns-for-better-apis',
      title: 'Advanced TypeScript Patterns for Better APIs',
      excerpt: 'Explore advanced TypeScript patterns that make your APIs more type-safe, maintainable, and developer-friendly.',
      content: `# Advanced TypeScript Patterns for Better APIs

TypeScript's type system is incredibly powerful when used effectively. Here are advanced patterns I use to build better APIs.

## Conditional Types
Create types that adapt based on their input type parameters.

## Template Literal Types
Build compile-time validated API endpoint types.

## Branded Types
Create distinct types for IDs to prevent accidental misuse.

## Result Types for Error Handling
Type-safe error handling with discriminated unions.

## Builder Pattern with Fluent Interface
Create query builders with full type safety.

## Mapped Types for API Validation
Use RequireFields and PartialExcept for request validation.

These patterns help create APIs that are not just functional, but truly type-safe and maintainable at scale.`,
      tags: ['TypeScript', 'API Design', 'Type Safety', 'Software Architecture'],
      category: 'Software Engineering',
      author: 'Umar Abdullah',
      publishedAt: new Date('2024-02-10'),
      featured: false,
      readingTime: 7,
      status: 'published',
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`${blogPosts.length} blog posts created`);

  // Projects
  const projects = [
    {
      title: 'AI Customer Support Agent',
      description: 'Autonomous multi-agent system that handles customer queries, escalates issues, and learns from interactions. Built with LangChain agents, OpenAI GPT-4, and a custom RAG pipeline. Handles 10,000+ queries/day with 92% auto-resolution rate.',
      techStack: ['LangChain', 'Node.js', 'OpenAI', 'MongoDB', 'BullMQ'],
      githubUrl: '#',
      liveUrl: '#',
      featured: true,
      sortOrder: 1,
    },
    {
      title: 'SaaS Analytics Platform',
      description: 'Multi-tenant analytics dashboard with real-time data pipelines and AI-powered insights. Full-stack SaaS with Next.js frontend, Node.js microservices, PostgreSQL, and Redis. Features Stripe billing and 50K MAU.',
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
      githubUrl: '#',
      liveUrl: '#',
      featured: true,
      sortOrder: 2,
    },
    {
      title: 'Web Scraping Automation Engine',
      description: 'Scalable scraping infrastructure with anti-detection, proxy rotation, and structured data extraction. Distributed system with Puppeteer clusters, BullMQ job queues. Processes 500K+ pages daily with 99.9% uptime.',
      techStack: ['Puppeteer', 'Node.js', 'BullMQ', 'Docker', 'MongoDB'],
      githubUrl: '#',
      featured: false,
      sortOrder: 3,
    },
    {
      title: 'RAG Knowledge Base System',
      description: 'Enterprise document intelligence platform with semantic search and LLM-powered Q&A. Full RAG pipeline that ingests PDFs, embedds chunks via OpenAI embeddings, stores in vector DB. Used in production at 3 enterprises.',
      techStack: ['Python', 'LangChain', 'OpenAI', 'PostgreSQL', 'FastAPI'],
      githubUrl: '#',
      liveUrl: '#',
      featured: false,
      sortOrder: 4,
    },
  ];

  for (const project of projects) {
    const existing = await prisma.project.findFirst({ where: { title: project.title } });
    if (!existing) {
      await prisma.project.create({ data: project });
    }
  }
  console.log(`${projects.length} projects created`);

  // Experiences
  const experiences = [
    {
      company: 'TechCorp Inc.',
      role: 'Senior AI Engineer',
      period: '2023 – Present',
      description: 'Architected and deployed multi-agent AI systems handling 10K+ daily conversations. Built custom RAG pipelines reducing support ticket volume by 40%. Led a team of 4 engineers building LLM-powered product features.',
      location: 'Remote',
      type: 'work',
      current: true,
      sortOrder: 1,
    },
    {
      company: 'StartupXYZ',
      role: 'Senior Full-Stack Engineer',
      period: '2021 – 2023',
      description: 'Built and scaled a multi-tenant SaaS platform from 0 to 50K monthly active users. Designed microservices architecture with Node.js, PostgreSQL, and Redis. Implemented Stripe billing, automated onboarding, and real-time dashboards.',
      location: 'Remote',
      type: 'work',
      current: false,
      sortOrder: 2,
    },
    {
      company: 'Digital Agency Co.',
      role: 'Software Engineer',
      period: '2019 – 2021',
      description: 'Delivered 15+ client projects across web scraping, automation, and web apps. Built Puppeteer-based scraping infrastructure processing 200K pages/day. Developed RESTful APIs and integrated third-party services.',
      location: 'On-site',
      type: 'work',
      current: false,
      sortOrder: 3,
    },
    {
      company: 'University of Technology',
      role: 'B.Sc. Computer Science',
      period: '2015 – 2019',
      description: 'Graduated with honors — specialization in Software Engineering. Capstone project: AI-powered plagiarism detection system. Active member of the Computer Science Society.',
      location: 'On-campus',
      type: 'education',
      current: false,
      sortOrder: 4,
    },
  ];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({ where: { company: exp.company, role: exp.role } });
    if (!existing) {
      await prisma.experience.create({ data: exp });
    }
  }
  console.log(`${experiences.length} experiences created`);

  // Skills
  const skills = [
    // Frontend
    { name: 'Next.js', category: 'Frontend', proficiency: 95, sortOrder: 1 },
    { name: 'React', category: 'Frontend', proficiency: 95, sortOrder: 2 },
    { name: 'TypeScript', category: 'Frontend', proficiency: 90, sortOrder: 3 },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, sortOrder: 4 },
    // Backend
    { name: 'Node.js', category: 'Backend', proficiency: 97, sortOrder: 5 },
    { name: 'Express', category: 'Backend', proficiency: 95, sortOrder: 6 },
    { name: 'Python', category: 'Backend', proficiency: 88, sortOrder: 7 },
    { name: 'REST / GraphQL', category: 'Backend', proficiency: 90, sortOrder: 8 },
    // AI / ML
    { name: 'LangChain', category: 'AI / ML', proficiency: 90, sortOrder: 9 },
    { name: 'OpenAI / GPT APIs', category: 'AI / ML', proficiency: 93, sortOrder: 10 },
    { name: 'RAG Pipelines', category: 'AI / ML', proficiency: 88, sortOrder: 11 },
    { name: 'AI Agents', category: 'AI / ML', proficiency: 85, sortOrder: 12 },
    // Infrastructure
    { name: 'Docker', category: 'Infrastructure', proficiency: 88, sortOrder: 13 },
    { name: 'MongoDB', category: 'Infrastructure', proficiency: 92, sortOrder: 14 },
    { name: 'PostgreSQL', category: 'Infrastructure', proficiency: 87, sortOrder: 15 },
    { name: 'Bull / BullMQ', category: 'Infrastructure', proficiency: 90, sortOrder: 16 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name, category: skill.category } });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log(`${skills.length} skills created`);

  // Site Settings
  const settings = [
    { key: 'hero_name', value: 'Umar Abdullah' },
    { key: 'hero_title', value: 'Senior Software Engineer & AI Engineer' },
    { key: 'hero_description', value: 'I build AI-powered automation systems and scalable SaaS platforms that solve real-world problems. From LLM pipelines to full-stack applications — I turn complex ideas into production-ready software.' },
    { key: 'hero_badge', value: 'Available for new opportunities' },
    { key: 'about_bio_1', value: "I'm Umar Abdullah, a Senior Software Engineer & AI Engineer with a passion for building systems that matter. With over 5 years of experience, I specialize in architecting AI-powered applications and scalable SaaS platforms that drive real business value." },
    { key: 'about_bio_2', value: 'My journey started with full-stack web development, but quickly evolved into the fascinating world of AI engineering — building RAG systems, autonomous agents, and LLM-powered workflows that automate complex business processes.' },
    { key: 'about_bio_3', value: "When I'm not coding, I'm exploring the latest in AI research, contributing to open-source projects, or sharing knowledge with the developer community. I believe the best software is built at the intersection of technical excellence and human-centered design." },
    { key: 'about_subtitle', value: 'Passionate engineer who loves turning ambitious ideas into production systems.' },
    { key: 'stat_years', value: '5+' },
    { key: 'stat_years_label', value: 'Years Experience' },
    { key: 'stat_projects', value: '30+' },
    { key: 'stat_projects_label', value: 'Projects Shipped' },
    { key: 'stat_ai', value: '10+' },
    { key: 'stat_ai_label', value: 'AI Systems Built' },
    { key: 'stat_satisfaction', value: '99%' },
    { key: 'stat_satisfaction_label', value: 'Client Satisfaction' },
    { key: 'contact_email', value: 'umar@example.com' },
    { key: 'social_github', value: 'https://github.com/umarabdullahtech' },
    { key: 'social_linkedin', value: 'https://linkedin.com/in/umarabdullahtech' },
    { key: 'footer_tagline', value: 'Senior Software Engineer & AI Engineer. Building the future with code and AI.' },
    { key: 'tech_badges', value: JSON.stringify(['Node.js', 'Express', 'Next.js', 'React', 'TypeScript', 'Python', 'LangChain', 'OpenAI', 'Puppeteer', 'BullMQ', 'MongoDB', 'PostgreSQL', 'Docker', 'Redis', 'Prisma', 'Stripe', 'AWS', 'GitHub Actions']) },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`${settings.length} site settings created`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
