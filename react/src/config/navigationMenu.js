export const navigation = {
    categories: [
      {
        id: 'women',
        name: 'Women',
        featured: [],
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Tops', id:"top", href: `{women/clothing/tops}` },
              { name: 'Dresses', id:"women_dress", href: '#' },
              { name: 'Women Jeans', id: 'women_jeans' },
              { name: 'Lengha Choli', id: 'lengha_choli' },
              { name: 'Sweaters', id: 'sweater' },
              { name: 'T-Shirts', id: 't-shirts' },
              { name: 'Jackets', id: 'jacket' },
              { name: 'Gouns', id: 'gouns' },
              { name: 'Sarees', id: 'saree' },
              { name: 'Kurtas', id: 'kurtas' },
            ],
          },
          {
            id: 'accessories',
            name: 'Accessories',
            items: [
              { name: 'Watches', id: 'watch' },
              { name: 'Wallets', id: 'wallet' },
              { name: 'Bags', id: 'bag' },
              { name: 'Sunglasses', id: 'sunglasse' },
              { name: 'Hats', id: 'hat' },
              { name: 'Belts', id: 'belt' },
            ],
          },
          {
            id: 'shoes',
            name: 'Shoes',
            items: [
              { name: 'Sneakers', id: 'sneakers' },
              { name: 'Boots', id: 'boots' },
              { name: 'Heels', id: 'heels' },
              { name: 'Flats', id: 'flats' },
            ],
          },
        ],
      },
      {
        id: 'men',
        name: 'Men',
        featured: [],
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Mens Kurtas', id: 'mens_kurta' },
              { name: 'Shirt', id: 'shirt' },
              { name: 'Men Jeans', id: 'men_jeans' },
              { name: 'Sweaters', id: 'sweater' },
              { name: 'T-Shirts', id: 't-shirts' },
              { name: 'Jackets', id: 'jacket' },
              { name: 'Activewear', id: 'activewear' },
              
            ],
          },
          {
            id: 'accessories',
            name: 'Accessories',
            items: [
                { name: 'Watches', id: 'watch' },
                { name: 'Wallets', id: 'wallet' },
                { name: 'Bags', id: 'bag' },
                { name: 'Sunglasses', id: 'sunglass' },
                { name: 'Hats', id: 'hat' },
                { name: 'Belts', id: 'belt' },
            ],
          },
          {
            id: 'shoes',
            name: 'Shoes',
            items: [
              { name: 'Sneakers', id: 'sneakers' },
              { name: 'Oxfords', id: 'oxfords' },
              { name: 'Loafers', id: 'loafers' },
              { name: 'Boots', id: 'boots' },
            ],
          },

        ],
      },
      {
        id: 'kids',
        name: 'Kids',
        featured: [],
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Shirts', id: 'shirt' },
              { name: 'T-Shirts', id: 't-shirts' },
              { name: 'Jeans', id: 'kids_jeans' },
              { name: 'Sweaters', id: 'sweater' },
              { name: 'Jackets', id: 'jacket' },
            ],
          },
          {
            id: 'accessories',
            name: 'Accessories',
            items: [
              { name: 'Watches', id: 'watch' },
              { name: 'Bags', id: 'bag' },
              { name: 'Hats', id: 'hat' },
            ],
          },
          {
            id: 'shoes',
            name: 'Shoes',
            items: [
              { name: 'Sneakers', id: 'sneakers' },
              { name: 'School Shoes', id: 'school_shoes' },
              { name: 'Sandals', id: 'sandals' },
            ],
          },
        ],
      },
    ],
    pages: [
      { name: 'About Us', id: 'about', href: '/about' },
      { name: 'Track Order', id: 'track-order', href: '/account/order' },
    ],
  }