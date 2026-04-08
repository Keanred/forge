import { eq } from 'drizzle-orm';
import { db } from '../client';
import { Item, NewItem, items } from '../schema';

export const dbGetItems = async (): Promise<Item[]> => {
  return await db.select().from(items);
};

export const dbGetItemById = async (id: string): Promise<Item | null> => {
  const [item] = await db.select().from(items).where(eq(items.id, id));
  return item ?? null;
};

export const dbInsertItem = async (item: NewItem): Promise<Item> => {
  const [newItem] = await db.insert(items).values(item).returning();
  return newItem;
};

export const dbUpdateItem = async (id: string, updates: Partial<NewItem>): Promise<Item | null> => {
  const [updatedItem] = await db.update(items).set(updates).where(eq(items.id, id)).returning();
  return updatedItem ?? null;
};

export const dbDeleteItem = async (id: string): Promise<void> => {
  await db.delete(items).where(eq(items.id, id));
};
