const express = require('express')
const app = express()
const { products } = require('./data')

app.get('/', (req, res) => {
  res.send('<h1> Home Page</h1><a href="/api/products">products</a>')
})

app.get('/api/products', (req, res) => {
  const newProducts = products.map((product) => {
    const { id, name, image } = product
    return { id, name, image }
  })

  res.json(newProducts)
})
app.get('/api/products/:productID', (req, res) => {
  // console.log(req)
  // console.log(req.params)
  const { productID } = req.params

  const singleProduct = products.find(
    (product) => product.id === Number(productID)
  )
  if (!singleProduct) {
    return res.status(404).send('Product Does Not Exist')
  }

  return res.json(singleProduct)
})

app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
  console.log(req.params)
  res.send('hello world')
})

app.get('/api/v1/query', (req, res) => {
  // console.log(req.query)
  const { search, limit } = req.query
  let sortedProducts = [...products]

  if (search) {
    sortedProducts = sortedProducts.filter((product) => {
      return product.name.startsWith(search)
    })
  }
  if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit))
  }
  if (sortedProducts.length < 1) {
    // res.status(200).send('no products matched your search');
    return res.status(200).json({ sucess: true, data: [] })
  }
  res.status(200).json(sortedProducts)
})

app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})





// some important and most used ways in javascript to iterate over thing and perform some operations 

// const new_product = products.map((product)=>{
// 	const {id,name,image}=product;
// 	return {id,name,image};
// });

// this way we create a new array and assign the value of the new array to the value that is pointing to the map function here new_product


// //next is using the find function this ends when we find any one of the instance that satisfy the given condition and return the given value

// const singleProduct = products.find((product) => product.id === Number(productId));

// // here a single product whose id id equal to productId is returned and assigned to singleProduct


// //filter is used to filter the value in a given array based on some filtering 
// eg : 
// //starts with function is used to check if the given string starts with the given value or not

// var sortedProducts = products.filter((product)=>{
// 	return product.name.startsWith(search);
// })


// //slice is used to return a new array with element between the (start,end) excluding the end index 


//writting custom sort and normal sort in javascript
// to do so 

// const points = [1,2,3,4,5];
// points.sort() function is used to sort the array points and
// point.sort(function(a,b){
  // return a>b
// })
//like this a custom function needs to be mentioned inside the sort function to sort the array in a arbitrary way 

