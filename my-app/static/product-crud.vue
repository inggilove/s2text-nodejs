<!-- VUE template -->
<template id="product">
<div>
  <h2>{{ product.name }}</h2>
  <b>Description: </b>
  <div>{{ product.description }}</div>
  <b>Price:</b>
  <div>{{ product.price }}<span class="glyphicon glyphicon-euro"></span></div>
  <br/>
  <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
  <a><router-link to="/">Back to product list</router-link></a>
</div>
</template>

<template id="product-list"><div>
  <div class="actions">
    <a class="btn btn-default" >
	  <router-link :to="{path: '/add-product'}">
      <span class="glyphicon glyphicon-plus"></span>
      Add product
	  </router-link>
    </a>
  </div>
  <div class="filters row">
    <div class="form-group col-sm-3">
      <label for="search-element">Product name</label>
      <input v-model="searchKey" class="form-control" id="search-element" requred/>
    </div>
  </div>
  <table class="table">
    <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Price</th>
      <th class="col-sm-2">Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="product in filteredProducts">
      <!-- tr v-for="product in products" -->
      <!-- tr v-for="product in products | filterBy searchKey in 'name'" -->
      <td>
        <a><router-link :to="{name: 'product', params: {product_id: product.id}}">{{ product.name }}</router-link></a>
      </td>
      <td>{{ product.description }}</td>
      <td>
        {{ product.price }}
        <span class="glyphicon glyphicon-euro" aria-hidden="true"></span>
      </td>
      <td>
	    <a class="btn btn-warning btn-xs"><router-link :to="{name: 'product-edit', params: {product_id: product.id}}">Edit</router-link></a>
        <a class="btn btn-danger btn-xs"><router-link :to="{name: 'product-delete', params: {product_id: product.id}}">Delete</router-link></a>
      </td>
    </tr>
    </tbody>
  </table>
</div></template>


<template id="add-product">
  <div>
  <h2>Add new product</h2>
  <form v-on:submit="createProduct">
    <div class="form-group">
      <label for="add-name">Name</label>
      <input class="form-control" id="add-name" v-model="product.name" required/>
    </div>
    <div class="form-group">
      <label for="add-description">Description</label>
      <textarea class="form-control" id="add-description" rows="10" v-model="product.description"></textarea>
    </div>
    <div class="form-group">
      <label for="add-price">Price, <span class="glyphicon glyphicon-euro"></span></label>
      <input type="number" class="form-control" id="add-price" v-model="product.price"/>
    </div>
    <button type="submit" class="btn btn-primary">Create</button>
    <a class="btn btn-default"><router-link to="/">Cancel</router-link></a>
  </form>
  </div>
</template>

<template id="product-edit">
  <div>
  <h2>Edit product</h2>
  <form v-on:submit="updateProduct">
    <div class="form-group">
      <label for="edit-name">Name</label>
      <input class="form-control" id="edit-name" v-model="product.name" required/>
    </div>
    <div class="form-group">
      <label for="edit-description">Description</label>
      <textarea class="form-control" id="edit-description" rows="3" v-model="product.description"></textarea>
    </div>
    <div class="form-group">
      <label for="edit-price">Price, <span class="glyphicon glyphicon-euro"></span></label>
      <input type="number" class="form-control" id="edit-price" v-model="product.price"/>
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
    <a class="btn btn-default"><router-link to="/">Cancel</router-link></a>
  </form>
  </div>
</template>

<template id="product-delete">
  <div>
  <h2>Delete product {{ product.name }}</h2>
  <form v-on:submit="deleteProduct">
    <p>The action cannot be undone.</p>
    <button type="submit" class="btn btn-danger">Delete</button>
    <a class="btn btn-default"><router-link to="/">Cancel</router-link></a>
  </form>
  </div>
</template>

<script>
var products = [
  {id: 1, name: 'Angular', description: 'Superheroic JavaScript MVW Framework.', price: 100},
  {id: 2, name: 'Ember', description: 'A framework for creating ambitious web applications.', price: 100},
  {id: 3, name: 'React', description: 'A JavaScript Library for building user interfaces.', price: 100}
];

function findProduct (productId) {
  return products[findProductKey(productId)];
};

function findProductKey (productId) {
  for (var key = 0; key < products.length; key++) {
    if (products[key].id == productId) {
      return key;
    }
  }
};

var List = Vue.extend({
  template: '#product-list',
  data: function () {
    return {products: products, searchKey: ''};
  },
  computed: {
    filteredProducts() {
      return this.products.filter( (product) => {
      	return product.name.indexOf(this.searchKey) > -1
        //return !product.name.indexOf(this.searchKey)
      })
    }
  }
});

var Product = Vue.extend({
  template: '#product',
  data: function () {
    return {product: findProduct(this.$route.params.product_id)};
  }
});

var ProductEdit = Vue.extend({
  template: '#product-edit',
  data: function () {
    return {product: findProduct(this.$route.params.product_id)};
  },
  methods: {
    updateProduct: function () {
      //Obsolete, product is available directly from data...
      let product = this.product; //var product = this.$get('product');
      products[findProductKey(product.id)] = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price
      };
      router.push('/');
    }
  }
});

var ProductDelete = Vue.extend({
  template: '#product-delete',
  data: function () {
    return {product: findProduct(this.$route.params.product_id)};
  },
  methods: {
    deleteProduct: function () {
      products.splice(findProductKey(this.$route.params.product_id), 1);
      router.push('/');
    }
  }
});

var AddProduct = Vue.extend({
  template: '#add-product',
  data: function () {
    return {product: {name: '', description: '', price: ''}
    }
  },
  methods: {
    createProduct: function() {
      //Obsolete, product is available directly from data...
      let product = this.product; //var product = this.$get('product');
      products.push({
        id: Math.random().toString().split('.')[1],
        name: product.name,
        description: product.description,
        price: product.price
      });
      router.push('/');
    }
  }
});

var router = new VueRouter({
	routes: [
		{path: '/', component: List},
		{path: '/product/:product_id', component: Product, name: 'product'},
		{path: '/add-product', component: AddProduct},
		{path: '/product/:product_id/edit', component: ProductEdit, name: 'product-edit'},
		{path: '/product/:product_id/delete', component: ProductDelete, name: 'product-delete'}
	]
});


var App = {}

new Vue({
  router
}).$mount('#app')

</script>
