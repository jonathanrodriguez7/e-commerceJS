if (pageCategory === "catalogo") {
  var g_items = {{listProducts}}.map(function(product, index) {
    return {
      'item_id': product.idProduct,
      'item_name': product.nameProduct,
      'discount': Number(product.price) - Number(product.sellPrice),
      'index': index,
      'item_brand': product.brand,
      'item_category': category,
      'price': Number(product.price)
    };
  });

  dataLayer.push({
    'ecommerce': {
      'items': g_items
    }
  });
}

if (pageCategory === "Produto") {
  dataLayer.push({
    'ecommerce': {
      'items': [
        {
          'item_id': idProduct,
          'item_name': nameProduct,
          'currency': "BRL",
          'discount': Number(price) - Number(priceSell),
          'item_brand': brand,
          'item_category': category,
          'price': Number(price)
        }
      ]
    }
  });
}

if (pageCategory === "EasyCheckout_OrderPlaced") {
  var googleEcommerce = Object.assign({}, ecommerce);
  delete googleEcommerce.checkout;
  window.dataLayer.push({
    'event': 'purchase_fix',
    'ecommerce': googleEcommerce,
    'fix': true
  });
}
///separar em scripts
var googleItems = [];
var googleIDs = [];
var googleGetValue = 0;
var googleGetCategory = '';

//PRODUCT PAGE
//view_item
if (pageCategory === "Produto") {
  var googleGetEvent = 'view_item';
  var googlePageType = 'product';
  var googleGetValue = Number(price);
  var googleGetProductID = idProduct;
  var googleGetCategory = dataLayer[0].category;

  googleItems.push({
    'id': googleGetProductID,
    'google_business_vertical': 'retail'
  });
  googleIDs.push(googleGetProductID);
}

//CATEGORY PAGE and SEARCH PAGE
//view_item_list
//view_search_results
if (pageCategory === "catalogo" || pageCategory === "Busca") {
  var googleGetProductID = listProducts;
  if (pageCategory === "catalogo") {
    var googleGetEvent = 'view_item_list';
    var googlePageType = 'category';
    var googleGetCategory = dataLayer[0].category;
  } else if (pageCategory === "Busca") {
    var googleGetEvent = 'view_search_results';
    var googlePageType = 'search';
  }

  googleGetProductID.forEach(function(product) {
    googleItems.push({
      'id': product.idProduct,
      'google_business_vertical': 'retail'
    });
    googleIDs.push(product.idProduct);
    googleGetValue += Number(product.price);
  });
}

//CART and PURCHASE
//add_to_cart
//purchase
if (pageCategory === "Carrinho" || pageCategory === "EasyCheckout_OrderPlaced") {
  if (pageCategory === "Carrinho") {
    var googleGetEvent = 'add_to_cart';
    var googlePageType = 'cart';
  }
  if (pageCategory === "EasyCheckout_OrderPlaced") {
    var googleGetEvent = 'purchase';
    var googlePageType = 'purchase';
  }
  var googleGetProductID = [];
  var googleGetValue = [];

  for (var i = 0; i < dataLayer.length; i++) {
    if (dataLayer[i].ecommerce) {
      googleGetProductID.push(dataLayer[i].ecommerce);
    }
  }

  googleGetProductID[0].checkout.products.forEach(function(product) {
    googleItems.push({
      'id': product.id,
      'google_business_vertical': 'retail'
    });
    googleIDs.push(product.id);
    googleGetValue += Number(product.price * product.quantity);
  });
}

if (googleGetEvent || googleGetValue || googleItems.length > 0) {
  dataLayer.push({
    'event': googleGetEvent,
    'remarketing': true,
    'value': Number(googleGetValue),
    'items': googleItems
  });
}
