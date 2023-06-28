document.addEventListener('DOMContentLoaded', function() {
  const getProductData = (element) => {
    const productName = element.querySelector('.product-name').innerText.split('×')[0].trim();
    const itemQuantity = Number(element.querySelector('.product-name').innerText.split('×')[1].trim());
    const itemPrice = Number(element.querySelector('.product-total').innerText.replace('R$', '').replaceAll('.', '').replace(',', '.'));

    return {
      name: productName,
      quantity: itemQuantity,
      price: itemPrice
    };
  };

  if (window.location.href.includes('product')) {
    const productName = document.querySelector('.summary .product_title').innerText;
    const productPrice = Number(document.querySelector('.summary .price .amount').innerText.replace('R$', '').replaceAll('.', '').replace(',', '.'));

    gtag('event', 'view_item', {
      "items": [{
        "name": productName,
        "price": productPrice
      }]
    });

    document.querySelector('.single_add_to_cart_button').addEventListener('click', function() {
      gtag('event', 'add_to_cart', {
        "items": [{
          "name": productName,
          "price": productPrice
        }]
      });
    });
  }

  if (!window.location.href.includes('checkout')) {
    document.querySelectorAll('.add_to_cart_button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const productElement = btn.parentElement;
        const productData = getProductData(productElement);

        gtag('event', 'add_to_cart', {
          "items": [productData]
        });
      });
    });
  }

  if (window.location.href.includes('checkout') && !window.location.href.includes('order-received')) {
    const googleItems = [];

    document.querySelectorAll('.cart_item').forEach(function(item) {
      const productData = getProductData(item);
      googleItems.push(productData);
    });

    gtag('event', 'begin_checkout', {
      "items": googleItems
    });
  }

  if (window.location.href.includes('order-received')) {
    const googleItems = [];

    document.querySelectorAll('.order_item').forEach(function(item) {
      const productData = getProductData(item);
      googleItems.push(productData);
    });

    const transactionId = document.querySelector('.order strong').innerText;
    const transactionValue = Number(document.querySelector('.total .amount').innerText.replace('R$', '').replaceAll('.', '').replace(',', '.'));

    gtag('event', 'purchase', {
      "transaction_id": transactionId,
      "value": transactionValue,
      "items": googleItems
    });
  }
});
