export const fetchQuery = `*[_type == 'products'] | order(__createdAt){
  _id,
  title,
  productType,
  mainImage{
    asset -> {
      url
    }
  },
  bgImage{
    asset -> {
      url
    }
  },
  shortDescription,
  description,
  price,
  categories[]->{
    _id,
    title,
    mainImage{
      asset -> {
        url
      }
    }
  },
  username
}`;
