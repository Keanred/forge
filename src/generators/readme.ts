import { ProjectConfig } from 'types';

const stackDescriptions: Record<string, string> = {
  express: 'A Node.js REST API built with Express',
  react: 'A React web application',
  'express-react': 'A full-stack application with Express API and React frontend',
};

const installCommands: Record<ProjectConfig['packageManager'], string> = {
  npm: 'npm install',
  yarn: 'yarn install',
  pnpm: 'pnpm install',
};

const devCommands: Record<ProjectConfig['packageManager'], string> = {
  npm: 'npm run dev',
  yarn: 'yarn dev',
  pnpm: 'pnpm dev',
};

const testCommands: Record<ProjectConfig['packageManager'], string> = {
  npm: 'npm test',
  yarn: 'yarn test',
  pnpm: 'pnpm test',
};

export const generateReadme = (config: ProjectConfig): string => {
  const { name, template, typescript, testing, packageManager } = config;

  const templateKey = template.toLowerCase();
  const baseDescription = stackDescriptions[templateKey] ?? 'A scaffolded project';
  const tsNote = typescript ? ' with TypeScript' : '';
  const description = `${baseDescription}${tsNote}.`;

  const installCmd = installCommands[packageManager];
  const devCmd = devCommands[packageManager];
  const testCmd = testCommands[packageManager];

  const testingSection = testing
    ? `\n## Testing\n\n\`\`\`bash\n${testCmd}\n\`\`\`\n`
    : '';

  if (templateKey === 'express-react') {
    return `# ${name}

${description}

## Tech Stack

- **Backend:** Express 5 + TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Frontend:** React + TypeScript + Material UI
- **Validation:** Shared Zod schemas (\`@${name}/schemas\`)
- **Tooling:** Vite, Vitest, ESLint, Prettier, Just

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- [Just](https://github.com/casey/just) command runner

## Quick Start

\`\`\`bash
cp .env.example .env
# Edit .env — at minimum set POSTGRES_PASSWORD
just install
just dev
\`\`\`

- Backend: http://localhost:3001
- Frontend: http://localhost:5173

## Development Commands

\`\`\`bash
just              # List available recipes
just dev          # Start Postgres + dev servers
just build        # Build all workspaces
just lint         # Lint all workspaces
just format       # Format with Prettier
just db-up        # Start Postgres container
just db-down      # Stop Postgres container
just db-push      # Push schema to DB (dev)
just db-generate  # Generate Drizzle migration files
just db-migrate   # Apply Drizzle migrations
\`\`\`
`;
  }

  return `# ${name}

${description}

## Setup

\`\`\`bash
${installCmd}
\`\`\`

## Development

\`\`\`bash
${devCmd}
\`\`\`
${testingSection}`;
};
