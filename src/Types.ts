export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
  createdAt: number;
}

export type Category = '전체' | '개인' | '업무' | '공부' | '기타';

export const CATEGORIES: Category[] = ['전체', '개인', '업무', '공부', '기타'];

export const CATEGORY_COLORS: Record<Category, string> = {
  '전체': '#6C63FF',
  '개인': '#FF6B6B',
  '업무': '#4ECDC4',
  '공부': '#FFD93D',
  '기타': '#A8A8A8',
};
