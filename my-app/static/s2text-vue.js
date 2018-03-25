var products = [
  {title: "sample", elapsed: '00:00', date_created: '2018-01-30T08:05:10.351Z', script: "..."},
];

function findProduct (title) {
  return products[findProductKey(title)];
};

function findProductKey (title) {
  for (var key = 0; key < products.length; key++) {
    if (products[key].title == title) {
      return key;
    }
  }
};

var base_url = 'http://35.200.40.38:3000';
// var base_url = 'http://localhost:8080/stt';

var List = Vue.extend({
  template: '#product-list',
  data: function () {
    return {products: products, searchKey: '', message: ''};
  },
  mounted () {
    // return {
      axios({ method: 'GET', 'url': base_url + '/api/showall'
      }).then(result => {
        //console.log( "OK" + JSON.stringify(result));
        //console.log( "response = " + result.data.response );
	this.products.length = 0;
	for ( var item of result.data.data ) {
	  this.products.push( item );
	}
        console.log( "products.length = " + this.products.length );
	this.message = result.response + " " + result.msg;
      }, error => { 
        this.message = "error : " + error;
        console.error(error) 
      })
    // }
  }, 
  computed: {
    filteredProducts() {
      return this.products.filter( (product) => {
      	return product.title.indexOf(this.searchKey) > -1
        //return !product.name.indexOf(this.searchKey)
      })
    },
    sortedArray() {
      return this.arrays.sort((a, b) => a.name < b.name );
    }
  }
});

var Product = Vue.extend({
  template: '#product',
  data: function () {
    return {product: findProduct(this.$route.params.title)};
  }
});

var ProductEdit = Vue.extend({
  template: '#product-edit',
  data: function () {
    return {product: findProduct(this.$route.params.title)};
  },
  mounted () {
    // return {
      axios({ method: 'GET', 'url': base_url + '/api/show/' + this.$route.params.title
      }).then(result => {
        //console.log( "OK" + JSON.stringify(result));
	this.product = result.data.data;
	this.message = result.response + " " + result.msg;
        //console.log( "product = " + this.product.script );
	
      }, error => { 
        this.message = "error : " + error;
        console.error(error) 
      })
    // }
  }, 
  methods: {
    updateProduct: function () {
      //Obsolete, product is available directly from data...
      let product = this.product; //var product = this.$get('product');
      products[findProductKey(product.title)] = {
        title: product.title,
        elapsed: product.elapsed,
        date_created: product.date_created,
        data: product.data
      };
      router.push('/');
    }
  }
});

var ProductDelete = Vue.extend({
  template: '#product-delete',
  data: function () {
    return {product: findProduct(this.$route.params.title)};
  },
  methods: {
    deleteProduct: function () {
      axios({ method: 'GET', 'url': base_url + '/api/remove/' + this.product.title
      }).then(result => {
        console.log( JSON.stringify(result.data));
	//this.product = result.data.data;
	//this.message = result.response + " " + result.msg;
        //console.log( "product = " + this.product.script );
	alert( "Removed OK: " + this.product.title );
      }, error => { 
        this.message = "error : " + error;
        console.error(error) 
	alert( error );
      })
      router.push('/');
    }
  }
});

var ProductAdd = Vue.extend({
  template: '#product-add',
  data: function () {
    return {product: {title: 'sermon.flac'}, message: ''}
  },
  methods: {
    createProduct: function() {
      axios({ method: 'GET', 'url': base_url + '/api/add/' + this.product.title
      }).then(result => {
        console.log( JSON.stringify(result.data));
	//this.product = result.data.data;
	//this.message = result.response + " " + result.msg;
        //console.log( "product = " + this.product.script );
	alert( "Added OK: " + this.product.title );
      }, error => { 
        this.message = "error : " + error;
        console.error(error) 
	alert( error );
      })
      router.push('/');
    }
  }
});

var router = new VueRouter({
	routes: [
		{path: '/', component: List},
		{path: '/product/show/:title', component: Product, name: 'product'},
		{path: '/product/add', component: ProductAdd, name: 'product-add'},
		{path: '/product/show/:title', component: ProductEdit, name: 'product-edit'},
		{path: '/product/remove/:title', component: ProductDelete, name: 'product-delete'}
	]
});


var App = {}

new Vue({
  data: {
    message: "..."
  },
  router
}).$mount('#app')

