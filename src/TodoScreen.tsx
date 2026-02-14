import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from './ThemeContext';
import { Todo, Category, CATEGORIES, CATEGORY_COLORS } from './Types';

export default function TodoScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('개인');
  const [filterCategory, setFilterCategory] = useState<Category>('전체');

  // Todo 추가
  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      category: selectedCategory,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput('');
  };

  // 완료 토글
  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 삭제
  const deleteTodo = (id: string) => {
    Alert.alert('삭제', '정말 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => setTodos((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);
  };

  // 필터링된 목록
  const filteredTodos =
    filterCategory === '전체'
      ? todos
      : todos.filter((t) => t.category === filterCategory);

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Todo</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>
            {completedCount}/{todos.length} 완료
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeButton, { backgroundColor: colors.card }]}
        >
          <Text style={{ fontSize: 22 }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      {/* 카테고리 필터 */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setFilterCategory(cat)}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  filterCategory === cat ? CATEGORY_COLORS[cat] : colors.card,
                borderColor:
                  filterCategory === cat ? CATEGORY_COLORS[cat] : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: filterCategory === cat ? '#FFF' : colors.subText,
                  fontWeight: filterCategory === cat ? '700' : '400',
                },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 입력 영역 */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <View style={styles.inputCategoryRow}>
          {CATEGORIES.filter((c) => c !== '전체').map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.smallChip,
                {
                  backgroundColor:
                    selectedCategory === cat
                      ? CATEGORY_COLORS[cat]
                      : 'transparent',
                  borderColor: CATEGORY_COLORS[cat],
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: selectedCategory === cat ? '#FFF' : CATEGORY_COLORS[cat],
                  fontWeight: selectedCategory === cat ? '700' : '400',
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="할 일을 입력하세요"
            placeholderTextColor={colors.subText}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addTodo}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={addTodo}
            style={[styles.addButton, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Todo 리스트 */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              {filterCategory === '전체'
                ? '할 일을 추가해보세요! ✨'
                : `'${filterCategory}' 카테고리에 할 일이 없어요`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleTodo(item.id)}
            onLongPress={() => deleteTodo(item.id)}
            style={[
              styles.todoItem,
              {
                backgroundColor: colors.card,
                borderLeftColor: CATEGORY_COLORS[item.category],
                opacity: item.completed ? 0.6 : 1,
              },
            ]}
          >
            {/* 체크박스 */}
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: item.completed
                    ? colors.accent
                    : colors.border,
                  backgroundColor: item.completed
                    ? colors.accent
                    : 'transparent',
                },
              ]}
            >
              {item.completed && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>

            {/* 텍스트 */}
            <View style={styles.todoTextContainer}>
              <Text
                style={[
                  styles.todoText,
                  {
                    color: colors.text,
                    textDecorationLine: item.completed
                      ? 'line-through'
                      : 'none',
                  },
                ]}
              >
                {item.text}
              </Text>
              <Text style={[styles.todoCategoryLabel, { color: colors.subText }]}>
                {item.category}
              </Text>
            </View>

            {/* 삭제 버튼 */}
            <TouchableOpacity
              onPress={() => deleteTodo(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: colors.subText, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
  },
  inputContainer: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputCategoryRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  smallChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 15,
    fontWeight: '500',
  },
  todoCategoryLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
