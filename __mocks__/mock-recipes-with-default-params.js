import ShortRecipe from '../src/entities/classes/short-recipe';

const other1 = new ShortRecipe(
    'Напиток из брокколи, сельдерея и кормовой…',
    'https://img09.rl0.ru/eda/c285x285i/s2.eda.ru/StaticContent/Photos/120213181523/120213181609/p_O.jpg',
    '/recepty/napitki/napitok-iz-brokkoli-seldereja-kormovoj-kapusti-18950',
);

const default1 = new ShortRecipe(
    'Салат с кормовой капустой и клюквой',
    '../../assets/DefaultRecipeImage.png',
    '/recepty/salaty/salat-s-kormovoj-kapustoj-kljukvoj-18690',
);

const default2 = new ShortRecipe(
    'Салат из кормовой капусты',
    '../../assets/DefaultRecipeImage.png',
    '/recepty/salaty/salat-iz-kormovoj-kapusti-18689',
);

const other2 = new ShortRecipe(
    'Зеленый лимонад',
    'https://img01.rl0.ru/eda/c285x285i/s1.eda.ru/StaticContent/Photos/120213181523/120213181707/p_O.jpg',
    '/recepty/napitki/zelenij-limonad-18991',
);

const other3 = new ShortRecipe(
    'Салат из шинкованной капусты',
    'https://img09.rl0.ru/eda/c285x285i/s2.eda.ru/StaticContent/Photos/120213181135/120213181240/p_O.jpg',
    '/recepty/salaty/salat-iz-shinkovannoj-kapusti-18626',
);

export default [other1, default1, default2, other2, other3];
