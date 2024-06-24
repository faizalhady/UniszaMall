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
          { title: 'Stationery', value: 'stationery' },
          { title: 'Electronics', value: 'electronics' },
          { title: 'Textbooks', value: 'textbooks' },
          { title: 'Backpacks & Bags', value: 'bags' },
          { title: 'Health & Wellness Products', value: 'healthWellness' },
          { title: 'Dorm Room Essentials', value: 'dormEssentials' },
          { title: 'Snacks & Beverages', value: 'snacks' },
          { title: 'Clothing & Accessories', value: 'clothing' },
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
