export interface Category {
  name: string;
  faIcon: string;
  communityIcon: string;
}
export const Categories: Category[] = [
  {
    name: 'Finance',
    faIcon: 'money',
    communityIcon: 'currency-usd',
  },
  {
    name: 'Food',
    faIcon: 'cutlery',
    communityIcon: 'food-fork-drink',
  },
  {
    name: 'Housing',
    faIcon: 'home',
    communityIcon: 'home',
  },
  {
    name: 'Health',
    faIcon: 'medkit',
    communityIcon: 'medical-bag',
  },
  {
    name: 'Sport',
    faIcon: 'futbol-o',
    communityIcon: 'soccer',
  },
];

export const getCategory = (categoryName: string): Category => {
  const category = Categories.find((x) => x.name === categoryName);
  if (category) return category;

  throw Error(`Unable to find category for ${categoryName}`);
};
