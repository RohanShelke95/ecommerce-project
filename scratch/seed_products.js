const axios = require('axios');

const API_BASE_URL = 'http://localhost:5454';
const jwt = 'YOUR_JWT_TOKEN_HERE'; // The user should replace this or I can try to get it from local storage if I were in the browser

const products = [
    // Men's Kurta
    {
        title: "Embroidered Cotton Kurta", brand: "Manyavar", color: "Blue", price: 2999, discountedPrice: 2499, discountPersent: 16, quantity: 50,
        topLavelCategory: "men", secondLavelCategory: "clothing", thirdLavelCategory: "mens_kurta",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/g/6/k/m-sk-kurta-112-blue-sk-avish-original-imags3atfyhgzghy.jpeg?q=70",
        size: [{ name: "S", quantity: 10 }, { name: "M", quantity: 20 }, { name: "L", quantity: 20 }]
    },
    {
        title: "Silk Blend Festive Kurta", brand: "Manyavar", color: "Gold", price: 3999, discountedPrice: 3499, discountPersent: 12, quantity: 40,
        topLavelCategory: "men", secondLavelCategory: "clothing", thirdLavelCategory: "mens_kurta",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/l/m/y/m-maw21-kp-004-mustard-manyavar-original-imagbgvshygfhxyg.jpeg?q=70",
        size: [{ name: "S", quantity: 10 }, { name: "M", quantity: 15 }, { name: "L", quantity: 15 }]
    },
    {
        title: "Casual Cotton Kurta", brand: "FabIndia", color: "Green", price: 1599, discountedPrice: 1299, discountPersent: 18, quantity: 60,
        topLavelCategory: "men", secondLavelCategory: "clothing", thirdLavelCategory: "mens_kurta",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/i/v/x/m-kurta-green-sk-avish-original-imags3atfyhgzghy.jpeg?q=70",
        size: [{ name: "S", quantity: 20 }, { name: "M", quantity: 20 }, { name: "L", quantity: 20 }]
    },
    {
        title: "White Pure Cotton Kurta", brand: "Peter England", color: "White", price: 1299, discountedPrice: 999, discountPersent: 23, quantity: 100,
        topLavelCategory: "men", secondLavelCategory: "clothing", thirdLavelCategory: "mens_kurta",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/w/h/i/m-kurta-white-sk-avish-original-imags3atfyhgzghy.jpeg?q=70",
        size: [{ name: "S", quantity: 30 }, { name: "M", quantity: 40 }, { name: "L", quantity: 30 }]
    },
    {
        title: "Black Ethnic Kurta", brand: "Junaid Jamshed", color: "Black", price: 2599, discountedPrice: 1999, discountPersent: 23, quantity: 30,
        topLavelCategory: "men", secondLavelCategory: "clothing", thirdLavelCategory: "mens_kurta",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/b/l/k/m-kurta-black-sk-avish-original-imags3atfyhgzghy.jpeg?q=70",
        size: [{ name: "S", quantity: 10 }, { name: "M", quantity: 10 }, { name: "L", quantity: 10 }]
    },
    // Men's Shoes
    {
        title: "Nike Air Max 270", brand: "Nike", color: "White", price: 12995, discountedPrice: 9995, discountPersent: 23, quantity: 20,
        topLavelCategory: "men", secondLavelCategory: "shoes", thirdLavelCategory: "shoes",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/g/i/n/10-ah8050-100-nike-white-black-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "7", quantity: 5 }, { name: "8", quantity: 5 }, { name: "9", quantity: 10 }]
    },
    {
        title: "Adidas Ultraboost 22", brand: "Adidas", color: "Black", price: 17999, discountedPrice: 14999, discountPersent: 16, quantity: 15,
        topLavelCategory: "men", secondLavelCategory: "shoes", thirdLavelCategory: "shoes",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/b/l/k/10-gz0127-adidas-black-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "8", quantity: 5 }, { name: "9", quantity: 5 }, { name: "10", quantity: 5 }]
    },
    {
        title: "Puma Running Shoes", brand: "Puma", color: "Red", price: 4999, discountedPrice: 2999, discountPersent: 40, quantity: 40,
        topLavelCategory: "men", secondLavelCategory: "shoes", thirdLavelCategory: "shoes",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/r/e/d/10-puma-red-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "7", quantity: 10 }, { name: "8", quantity: 15 }, { name: "9", quantity: 15 }]
    },
    // T-Shirts
    {
        title: "Cotton Crew Neck T-Shirt", brand: "Levi's", color: "Navy", price: 1299, discountedPrice: 899, discountPersent: 30, quantity: 80,
        topLavelCategory: "men", secondLavelCategory: "clothing", thirdLavelCategory: "t-shirts",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/n/v/y/m-levis-navy-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "S", quantity: 20 }, { name: "M", quantity: 30 }, { name: "L", quantity: 30 }]
    },
    // Women's Dresses
    {
        title: "Floral Maxi Dress", brand: "Zara", color: "Pink", price: 4999, discountedPrice: 3499, discountPersent: 30, quantity: 25,
        topLavelCategory: "women", secondLavelCategory: "clothing", thirdLavelCategory: "women_dress",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/dress/p/n/k/s-zara-pink-maxi-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "S", quantity: 8 }, { name: "M", quantity: 10 }, { name: "L", quantity: 7 }]
    },
    {
        title: "A-Line Party Dress", brand: "H&M", color: "Black", price: 2999, discountedPrice: 1999, discountPersent: 33, quantity: 35,
        topLavelCategory: "women", secondLavelCategory: "clothing", thirdLavelCategory: "women_dress",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/dress/b/l/k/s-hm-black-aline-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "S", quantity: 10 }, { name: "M", quantity: 15 }, { name: "L", quantity: 10 }]
    },
    // Sarees
    {
        title: "Kanjivaram Silk Saree", brand: "Kalyan", color: "Red", price: 9999, discountedPrice: 7999, discountPersent: 20, quantity: 15,
        topLavelCategory: "women", secondLavelCategory: "clothing", thirdLavelCategory: "saree",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/saree/r/e/d/kanjivaram-silk-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "FS", quantity: 15 }]
    },
    {
        title: "Cotton Handloom Saree", brand: "FabIndia", color: "Yellow", price: 3599, discountedPrice: 2899, discountPersent: 19, quantity: 20,
        topLavelCategory: "women", secondLavelCategory: "clothing", thirdLavelCategory: "saree",
        imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/saree/y/e/l/cotton-handloom-original-imags5fhzfhzfhzf.jpeg?q=70",
        size: [{ name: "FS", quantity: 20 }]
    }
];

async function seed() {
    for (const product of products) {
        try {
            await axios.post(`${API_BASE_URL}/api/admin/products/`, product, {
                headers: { 'Authorization': `Bearer ${jwt}` }
            });
            console.log(`Added: ${product.title}`);
        } catch (error) {
            console.error(`Failed: ${product.title}`, error.message);
        }
    }
}

seed();
