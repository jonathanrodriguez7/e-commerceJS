// Utility function to calculate discount
function calculateDiscount(price, sellPrice) {
  return Number(price) - Number(sellPrice);
}

// Utility function to extract product information
function extractProductInfo(product) {
  return {
    'id': product.idProduct,
    'google_business_vertical': 'retail'
  };
}

// Utility function to extract product IDs and calculate total value
function extractProductIDsAndValue(products) {
  var productIDs = [];
  var value = 0;

  products.forEach(function (product) {
    var price = Number(product.price);

    productIDs.push(product.idProduct);
    value += price;
  });

  return {
    productIDs: productIDs,
    value: value
  };
}

//PRODUCT PAGE
if (pageCategory === "Produto") {
  var googleItems = [
    {
      'id': idProduct,
      'google_business_vertical': 'retail'
    }
  ];

  dataLayer.push({
    'ecommerce': {
      'items': [
        {
          'item_id': idProduct,
          'item_name': nameProduct,
          'currency': "BRL",
          'discount': calculateDiscount(price, priceSell),
          'item_brand': brand,
          'item_category': category,
          'price': Number(price)
        }
      ]
    }
  });
}

//CATEGORY PAGE and SEARCH PAGE
if (pageCategory === "catalogo" || pageCategory === "Busca") {
  var googleItems = [];
  var googleGetValue = 0;

  listProducts.forEach(function (product) {
    googleItems.push(extractProductInfo(product));
    googleGetValue += Number(product.price);
  });

  if (pageCategory === "catalogo") {
    dataLayer.push({
      'ecommerce': {
        'items': googleItems
      }
    });
  } else if (pageCategory === "Busca") {
    dataLayer.push({
      'event': 'view_search_results',
      'ecommerce': {
        'items': googleItems
      }
    });
  }
}

//CART and PURCHASE
if (pageCategory === "Carrinho" || pageCategory === "EasyCheckout_OrderPlaced") {
  var googleItems = [];
  var googleGetEvent;
  var googlePageType;
  var googleGetProductID = [];
  var googleGetValue = 0;

  for (var i = 0; i < dataLayer.length; i++) {
    if (dataLayer[i].ecommerce) {
      googleGetProductID.push(dataLayer[i].ecommerce);
    }
  }

  googleGetProductID[0].checkout.products.forEach(function (product) {
    googleItems.push(extractProductInfo(product));
    googleGetValue += Number(product.price * product.quantity);
  });

  if (pageCategory === "Carrinho") {
    googleGetEvent = 'add_to_cart';
    googlePageType = 'cart';
  } else if (pageCategory === "EasyCheckout_OrderPlaced") {
    googleGetEvent = 'purchase';
    googlePageType = 'purchase';

    var googleEcommerce = Object.assign({}, ecommerce);
    delete googleEcommerce.checkout;

    dataLayer.push({
      'event': 'purchase_fix',
      'ecommerce': googleEcommerce,
      'fix': true
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
}
