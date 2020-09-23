/**
 * Lookup of categories to be utilised in the app
 */

export interface Category {
  name: string;
  faIcon: string;
  communityIcon: string;
}
export const Categories: Category[] = [
  {
    name: 'Art',
    faIcon: 'paint-brush',
    communityIcon: 'brush',
  },
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
    name: 'Nature',
    faIcon: 'tree',
    communityIcon: 'tree',
  },
  {
    name: 'People',
    faIcon: 'users',
    communityIcon: 'account-multiple',
  },
  {
    name: 'Services',
    faIcon: 'building',
    communityIcon: 'domain',
  },
  {
    name: 'Sport',
    faIcon: 'futbol-o',
    communityIcon: 'soccer',
  },
  {
    name: 'Other',
    faIcon: 'comment',
    communityIcon: 'message',
  },
];

export const getCategory = (categoryName: string): Category => {
  const category = Categories.find((x) => x.name === categoryName);
  if (category) return category;

  throw Error(`Unable to find category for ${categoryName}`);
};
