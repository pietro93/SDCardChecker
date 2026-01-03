import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import jobs from '../../public/data/jobs.json';

export const GET: APIRoute = async (context) => {
  return rss({
    title: 'AI Training Jobs | Your Job Board',
    description: 'Latest AI training, data annotation, and expert labeling opportunities',
    site: context.site ?? 'https://aitrainer.work',
    items: jobs
      .filter(job => job.active) // Only active jobs
      .slice(0, 50) // Limit to 50 most recent
      .map((job) => ({
        title: job.title,
        description: job.description,
        link: `https://aitrainer.work/jobs/${job.id}`,
        pubDate: new Date(job.first_seen),
        categories: [job.domain, job.platform],
        customData: `
          <salary>${job.pay_amount} ${job.pay_currency} ${job.pay_rate_unit}</salary>
          <jobType>${job.pay_model}</jobType>
          <location>${job.geographic_restrictions?.join(', ') || 'Remote'}</location>
          <applyLink>${job.apply_url}</applyLink>
        `,
      })),
    customData: `<language>en-us</language>`,
  });
};