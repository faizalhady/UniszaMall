import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'products',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'string',
      options: {
        list: [
          { title: 'Stationery & Supplies', value: 'stationery' },
          { title: 'Electronics & Gadgets', value: 'electronics' },
          { title: 'Books & Study Materials', value: 'books' },
          { title: 'Bags & Accessories', value: 'bags' },
          { title: 'Health & Wellness', value: 'health' },
          { title: 'Home & Living', value: 'home' },
          { title: 'Food & Beverages', value: 'food' },
          { title: 'Clothing & Apparel', value: 'clothing' },

        ],
        layout: 'radio'
      }
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'The price of the product in RM',
      validation: (Rule) => Rule.required().positive(),
      options: {
        format: 'currency'
      }
    }),
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
    }),
  ],

})
