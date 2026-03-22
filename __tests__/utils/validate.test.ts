import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateProjectName } from '../../src/utils/validate';
import fs from 'fs-extra';

vi.mock('fs-extra');

describe('validateProjectName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept valid project names', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    await expect(validateProjectName('my-app')).resolves.toBeUndefined();
    await expect(validateProjectName('myApp')).resolves.toBeUndefined();
    await expect(validateProjectName('my_app')).resolves.toBeUndefined();
    await expect(validateProjectName('my-app-123')).resolves.toBeUndefined();
  });

  it('should reject project names with spaces', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    await expect(validateProjectName('my app')).rejects.toThrow(/spaces/i);
  });

  it('should reject project names with invalid characters', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    await expect(validateProjectName('my@app')).rejects.toThrow();
    await expect(validateProjectName('my#app')).rejects.toThrow();
    await expect(validateProjectName('my$app')).rejects.toThrow();
  });

  it('should reject existing directories', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);

    await expect(validateProjectName('existing-dir')).rejects.toThrow(/already exists/i);
  });

  it('should reject names starting with a dot or dash', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    await expect(validateProjectName('.hidden')).rejects.toThrow();
    await expect(validateProjectName('-app')).rejects.toThrow();
  });

  it('should check if directory exists', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    await validateProjectName('test-app');

    expect(fs.pathExists).toHaveBeenCalledWith(expect.stringContaining('test-app'));
  });
});
