(function () {
  if (typeof dataLayer === "undefined") {
    window.dataLayer = [];
  }

  var g_product = document.querySelector('[name="product"]');
  if (g_product) {
    var productObject = {
      name: g_product.value,
      price: g_product.dataset.price
    };

    var pushViewItemEvent = function () {
      dataLayer.push({
        'event': 'view_item',
        ecommerce: {
          items: [
            {
              item_name: productObject.name,
              currency: "BRL",
              price: parseFloat(productObject.price),
              quantity: 1
            }
          ]
        }
      });
    };

    pushViewItemEvent();

    document.addEventListener("click", function (e) {
      if (e.target.innerText && e.target.innerText == 'COMPRAR') {
        dataLayer.push({
          'event': 'add_to_cart',
          ecommerce: {
            items: [
              {
                item_name: productObject.name,
                currency: "BRL",
                price: parseFloat(productObject.price),
                quantity: 1
              }
            ]
          }
        });
      }
    });
  }

  if (window.location.pathname.includes('/checkout/onepage/')) {
    document.addEventListener("click", function (e) {
      if (e.target.innerText == 'Finalização de Compra') {
        var g_items = [];
        var g_total = parseFloat(document.querySelector("#checkout-review-table strong .price").innerText.replace(/[^0-9.-]+/g, "")) / 100;
        var cartObject = JSON.parse(localStorage.getItem('cartObject')) || {};

        Object.keys(cartObject).forEach(function (key) {
          var item = {
            'quantity': +cartObject[key].qty,
            'price': parseFloat(cartObject[key].price),
            'item_name': cartObject[key].name
          };

          g_items.push(item);
        });

        localStorage.setItem('g_items', JSON.stringify(g_items));
        localStorage.setItem('g_total', g_total);

        dataLayer.push({
          'event': 'begin_checkout',
          ecommerce: {
            items: g_items
          }
        });
      }
    });
  }

  if (window.location.href.includes('checkout/onepage/success/')) {
    var transaction_id = document.querySelector(".order-number .number span").innerText;
    var value = parseFloat(localStorage.getItem('g_total')) || 0;
    var items = JSON.parse(localStorage.getItem('g_items')) || [];

    dataLayer.push({
      'event': 'purchase',
      ecommerce: {
        transaction_id: transaction_id,
        affiliation: "cmdmanipulados",
        value: value,
        currency: "BRL",
        items: items
      }
    });
  }
})();
