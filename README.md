# Shopping API



# Motivation
my project is an api to seamlessly:
  - CREATE.
  - READ.
  - UPDATE.
  - DELETE.

products and preparing them to the frontend.

#  Features!

  - creating new products.
  - updating alreading created products.
        - the api can update a product in two ways: new purchase or update last purchase.
  - delete one or many products using id in the url param.
  - getting all or one product using id in the url param.



### Installation

Shopping API [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd FWE­-WS18-­754297-­­HA1
$ npm install -d
$ npm start
```

# How to use? / How it works?

- Post request to 'product/create' will create a new product for you if it doesn't exist, the software will also create some automatically generated properties for the document like 'updatedAt', 'createdAt', this 2 properties are generated using a plugin in models/plugins/timestamp.js. Other properties like 'averageQuantity', 'totalQuantities', 'NumberOfPurchases', 'lastPurchase' are generated in 'models/product.model.js'. But if the product already exists, making a post request will update this product (new purchase). Thus, the number of purchases will be incremented by 1 and the 'averageQuantity', 'totalQuantity', 'NumberOfPurchases', and 'lastPurchase' will be updated. 
- Put request to 'product/update/:id' will update an already existing product, but this one doesn't count as new purchase. The software will update 'averageQuantity', 'totalQuantity', 'updated at', 'lastPurchase', 'description'... The 'NumberOfPurchases' remains unchangeable because we are just updating the last purchase of this product and not buying a new one. The method 'downgradeAverageQuantity' will bring the product document to the prior state so that the new 'AverageQuantity' and 'totalQuantity' will be recalculated (updateAverageQuantity and updateTotalQuantity method) using the 'quantity' of the new product.
- Get request to 'product/get' without any query parameter will deliver all the products back for you. If the id of the product is given in the url, that specified product will be returned. You can do more by giving a query "curr" in the url: The returned price will be converted to the given currency using forex API that delivers real time currency conversion rate. The software will check first if the entered currency symbol is available in Forex and then it will make an http get request to make the conversion rate available for the coming tasks. All the stored prices in the database are in EUR. After fetching the conversion rate, 'updatePrices' function will be fired to convert the price of each product. After all this hustle, the product will be send back.
- Delete request to 'product/delete' without any query parameter will delete all products in the database. If a parameter is giver which has to be an id of an already existing product, This specified product will be deleted.
- To understand the math behind 'updateAverageQuantity' and 'downgradeAverageQuantity', please check this post in StackExchange: https://math.stackexchange.com/questions/106313/regular-average-calculated-accumulatively


### Tests
- Mocha test suites are available in 'test' folder.

### License
MIT
