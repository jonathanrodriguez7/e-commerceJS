//e-commerce wordpress
document.addEventListener('DOMContentLoaded', function(){
  //VIEW_ITEM
  if(window.location.href.includes('product')){
    
    gtag('event', 'view_item', {
              "items": [
                {
                  "name": document.querySelector('.summary .product_title').innerText,
                  "price": Number(document.querySelector('.summary .price .amount').innerText.replace('R$','').replaceAll('.','').replace(',','.'))
                }
              ]
            });
    
    //ADD_TO_CART PAGINA PRODUTO
    document.querySelector('.single_add_to_cart_button').addEventListener('click', function(){
        gtag('event', 'add_to_cart', {
              "items": [
                {
                  "name": document.querySelector('.summary .product_title').innerText,
                  "price": Number(document.querySelector('.summary .price .amount').innerText.replace('R$','').replaceAll('.','').replace(',','.'))
                }
              ]
            })
    })

    }
  //ADD TO CART TODAS AS PAGINAS
  if(!window.location.href.includes('checkout')){
      document.querySelectorAll('.add_to_cart_button').forEach(function(btn){
        btn.addEventListener('click', function(){
            gtag('event', 'add_to_cart', {
                  "items": [
                    {
                      "name": btn.parentElement.querySelector('.woocommerce-loop-product__title').innerText,
                      "price": Number(btn.parentElement.querySelector('.price .amount').innerText.replace('R$','').replaceAll('.','').replace(',','.'))
                    }
                  ]
                });
        })
    })
  } 
  
  //BEGIN_CHECKOUT
  if(window.location.href.includes('checkout') && !window.location.href.includes('order-received')){
        var googleItems = []

        document.querySelectorAll('.cart_item').forEach(function(item){
            googleItems.push({
                name: item.querySelector('.product-name').innerText.split('×')[0].trim(),
                quantity: Number(item.querySelector('.product-name').innerText.split('×')[1].trim()),
                price: Number(item.querySelector('.product-total').innerText.replace('R$','').replaceAll('.','').replace(',','.'))
            })

        })
        gtag('event', 'begin_checkout', {
              "items": googleItems,
            });
    }
  
  //PURCHASE
  if(window.location.href.includes('order-received')){
        var googleItems = []

        document.querySelectorAll('.order_item').forEach(function(item){
            googleItems.push({
                name: item.querySelector('.product-name').innerText.split('×')[0].trim(),
                quantity: Number(item.querySelector('.product-name').innerText.split('×')[1].trim()),
                price: Number(item.querySelector('.product-total').innerText.replace('R$','').replaceAll('.','').replace(',','.'))
            })
        })

        gtag('event', 'purchase', {
              "transaction_id": document.querySelector('.order strong').innerText,
              "value": Number(document.querySelector('.total .amount').innerText.replace('R$','').replaceAll('.','').replace(',','.')),
              "items": googleItems
            });
    }
})
