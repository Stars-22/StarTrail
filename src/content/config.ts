import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// projects collection 的 zod schema（frontmatter 字段与校验）
const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    // 保留 `.zh` / `.en` 后缀（默认生成器会去掉点号）
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      start: z.string().regex(/^\d{4}-\d{2}$/, 'start 必须为 YYYY-MM'),
      end: z
        .string()
        .regex(/^\d{4}-\d{2}$/, 'end 必须为 YYYY-MM')
        .nullable()
        .optional(),
      tech: z.array(z.string()).default([]),
      repo: z
        .string()
        .regex(/^[^/\s]+\/[^/\s]+$/, 'repo 必须为 owner/repo')
        .optional(),
      url: z.string().url().optional(),
      openSource: z.boolean(),
      cover: z.string().optional(),
      stars: z.number().optional(),
      forks: z.number().optional(),
    })
    .refine((d) => !(d.openSource && !d.repo), {
      message: 'openSource: true 时 repo 必填',
      path: ['repo'],
    })
    .refine((d) => !(d.end && d.end < d.start), {
      message: 'end 不能早于 start',
      path: ['end'],
    }),
});

export const collections = { projects };
