var faker = require('faker');

var database = {products: []};

for (var i = 1; i <= 100; i++) {
    database.products.push({
        id: i,
        name: faker.commerce.productName(),
        description: faker.lorem.sentences(),
        price: faker.commerce.price(),
        quantity: Math.floor((Math.random() * 50) + 10),
        imageUrl: `${faker.image.technics()}?random=${Math.round(Math.random() * 1000)}` // "https://source.unsplash.com/1600x900/?product"
    });
}

console.log(JSON.stringify(database)); // stringify() konvertuje JS objekat u JSON string.
