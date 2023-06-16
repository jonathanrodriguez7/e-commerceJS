document.addEventListener('DOMContentLoaded', function() {
  // VIEW_ITEM
  if (window.location.href.includes('product')) {
    const productName = document.querySelector('.summary .product_title').innerText;
    const productPrice = Number(document.querySelector('.summary .price .amount').innerText.replace('R$', '').replaceAll('.', '').replace(',', '.'));

    gtag('event', 'view_item', {
      "items": [{
        "name": productName,
        "price": productPrice
      }]
    });

    // ADD_TO_CART PAGINA PRODUTO
    document.querySelector('.single_add_to_cart_button').addEventListener('click', function() {
      gtag('event', 'add_to_cart', {
        "items": [{
          "name": productName,
          "price": productPrice
        }]
      });
    });
  }

  // ADD TO CART TODAS AS PAGINAS
  if (!window.location.href.includes('checkout')) {
    document.querySelectorAll('.add_to_cart_button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const productName = btn.parentElement.querySelector('.woocommerce-loop-product__title').innerText;
        const productPrice = Number(btn.parentElement.querySelector('.price .amount').innerText.replace('R$', '').replaceAll('.', '').replace(',', '.'));

        gtag('event', 'add_to_cart', {
          "items": [{
            "name": productName,
            "price": productPrice
          }]
        });
      });
    });
  }

  // BEGIN_CHECKOUT
  if (window.location.href.includes('checkout') && !window.location.href.includes('order-received')) {
    const googleItems = [];

    document.querySelectorAll('.cart_item').forEach(function(item) {
      const itemName = item.querySelector('.product-name').innerText.split('×')[0].trim();
      const itemQuantity = Number(item.querySelector('.product-name').innerText.split('×')[1].trim());
      const itemPrice = Number(item.querySelector('.product-total').innerText.replace('R$', '').replaceAll('.', '').replace(',', '.'));

      googleItems.push({
        name: itemName,
        quantity: itemQuantity,
        price: itemPrice
      });
    });

    gtag('event', 'begin_checkout', {
      "items": googleItems
    });
  }

  // PURCHASE
  if (window.location.href.includes('order-received')) {
    const googleItems = [];

    document.querySelectorAll('.order_item').forEach(function(item) {
      const itemName = item.querySelector('.product-name').innerText.split('×')[0].trim();
      const itemQuantity = Number(item.querySelector('.product-name').innerText.split('×')[1].trim());
      const itemPrice = Number(item.querySelector('.product-total').innerText.replace('R$', '').replaceAll('.', '').replace(',', '.'));

      googleItems.push({
        name: itemName,
        quantity: itemQuantity,
        price: itemPrice
      });
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
