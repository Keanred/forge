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
