import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

// Define the Job interface matching your schema
interface Job {
  id: string;
  title: string;
  description: string;
  application_deadline?: string;
  first_seen: string;
  domain: string;
}

export async function GET(context: APIContext) {
  // 1. Read your data file (since it exists in public/data)
  const dataPath = path.join(process.cwd(), 'public', 'data', 'jobs.json');
  const fileContent = await fs.readFile(dataPath, 'utf-8');
  const jobs: Job[] = JSON.parse(fileContent);

  // 2. Filter for active jobs only (optional)
  // const activeJobs = jobs.filter(job => job.active);

  return rss({
    // The title and description of your RSS feed
    title: 'AI Training Job Board',
    description: 'Daily curated AI training and annotation jobs.',
    site: context.site ?? 'https://your-domain.com',
    
    // 3. Map your jobs to RSS items
    items: jobs.map((job) => ({
      title: `${job.title} (${job.domain})`,
      pubDate: new Date(job.first_seen),
      description: job.description,
      // Link to your specific job detail page
      link: `/jobs/${job.id}`,
      // Custom data (optional, helpful for advanced parsers)
      customData: `<guid isPermaLink="true">${job.id}</guid>`
    })),
    
    // Optional: stylesheet for pretty viewing in browser
    stylesheet: '/rss/styles.xsl',
  });
}