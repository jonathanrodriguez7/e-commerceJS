var aux = true;
function trackViewEvent(item) {
  var items = [{
    'item_name': item.productName,
    'price': item.productPriceTo,
    'item_id': item.productId,
    'currency': 'BRL',
    'item_category': item.productCategoryName
  }];

  dataLayer.push({
    'event': 'view_item',
    'currency': 'BRL',
    'items': items
  });
}

function trackDetailViewEvent(products) {
  dataLayer.push({
    'event': 'view_item',
    'currency': 'BRL',
    'items': products
  });
  aux = false;
}

function trackCheckoutEvent(products) {
  dataLayer.push({
    'event': 'begin_checkout',
    'currency': 'BRL',
    'items': products
  });
  clearInterval(intervalo);
  console.log('stop time');
}

function trackAddToCartEvent(products) {
  dataLayer.push({
    'event': 'add_to_cart',
    'currency': 'BRL',
    'items': products
  });
  aux = false;
}

dataLayer.forEach(function(data) {
  if (data.pageCategory === 'Product') {
    trackViewEvent(data);
  } else if ((data.event === "productView" || data.event === "productDetail") && aux) {
    if (data.event === "productDetail") {
      trackDetailViewEvent(data.ecommerce.detail.products);
    }
  } else if (window.location.pathname.includes('/p')) {
    var items = [{
      name: document.querySelector('.productName').innerText,
      price: parseFloat(document.querySelector('.productPrice strong').innerText.match(/\d+/g).join('')) / 100,
      currency: 'BRL'
    }];
    dataLayer.push({
      'event': 'view_item',
      'currency': 'BRL',
      'items': items
    });
  }
});

var intervalo = setInterval(function() {
  dataLayer.forEach(function(data) {
    if (data.event === "payment") {
      trackCheckoutEvent(data.ecommerce.checkout.products);
    }
  });
}, 4000);

aux = true;

dataLayer.forEach(function(data) {
  if ((data.event === "cart" || data.event === "cartLoaded") && aux) {
    trackAddToCartEvent(data.ecommerce.checkout.products);
  }
});
