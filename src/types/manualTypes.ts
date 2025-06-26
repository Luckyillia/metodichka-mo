export type NavItem = {
  id: string;
  title: string;
  icon: string;
};

// Удаляем тип Section, так как он больше не нужен
// Вместо этого используем только NavItem