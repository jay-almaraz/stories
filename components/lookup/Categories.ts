export interface Category {
  name: string;
  icon: string;
}
export const Categories: Category[] = [
  {
    name: 'Finance',
    icon: 'money',
  },
  {
    name: 'Food',
    icon: 'cutlery',
  },
  {
    name: 'Housing',
    icon: 'home',
  },
  {
    name: 'Health',
    icon: 'medkit',
  },
  {
    name: 'Sport',
    icon: 'futbol-o',
  },
];

export const getCategory = (categoryName: string): Category => {
  const category = Categories.find((x) => x.name === categoryName);
  if (category) return category;

  throw Error(`Unable to find category for ${categoryName}`);
};
