/**
 * Generic In-Memory Store for Mock Data
 * Provides CRUD operations similar to a real database
 */

export class BaseStore<T> {
  private data: T[] = [];
  private idCounter = 1;
  private idField: keyof T;

  constructor(initialData: T[] = [], idField: keyof T = 'id' as keyof T) {
    this.idField = idField;
    this.data = [...initialData];
    
    // Set counter based on numeric IDs
    const numericIds = initialData
      .map(d => Number(d[this.idField]))
      .filter(id => !isNaN(id));
    this.idCounter = Math.max(...numericIds, 0) + 1;
  }

  getAll(): T[] {
    return [...this.data];
  }

  getById(id: number | string): T | undefined {
    return this.data.find(item => item[this.idField] === id);
  }

  search(
    filter: (item: T) => boolean,
    page: number = 1,
    limit: number = 20
  ): { data: T[]; total: number } {
    const filtered = this.data.filter(filter);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return { data: paginated, total };
  }

  create(item: Omit<T, typeof this.idField>): T {
    const newItem = { 
      ...item, 
      [this.idField]: this.idCounter++ 
    } as T;
    this.data.push(newItem);
    return newItem;
  }

  update(id: number | string, updates: Partial<T>): T | undefined {
    const index = this.data.findIndex(item => item[this.idField] === id);
    if (index >= 0) {
      this.data[index] = { ...this.data[index], ...updates };
      return this.data[index];
    }
    return undefined;
  }

  void(id: number | string, updates: Partial<T>): T | undefined {
    // Same as update but specifically for void operations
    return this.update(id, updates);
  }

  delete(id: number | string): boolean {
    const index = this.data.findIndex(item => item[this.idField] === id);
    if (index >= 0) {
      this.data.splice(index, 1);
      return true;
    }
    return false;
  }
}
