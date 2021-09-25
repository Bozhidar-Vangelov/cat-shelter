let cats = [
  {
    id: 1,
    name: 'Pesho',
    description: 'Persian cat Pesho',
    breed: 'Persian',
    image: 'cat1.jpg',
  },
  {
    id: 2,
    name: 'Gosho',
    description: 'Bengal cat Gosho',
    breed: 'Bengal',
    image: 'cat2.jpg',
  },
  {
    id: 3,
    name: 'Mariya',
    description: 'Siamese cat Mariya',
    breed: 'Siamese',
    image: 'cat3.jpg',
  },
];

let id = 2;

let filteredCats = cats.filter((cat) => cat.id === id);

console.log(filteredCats);
