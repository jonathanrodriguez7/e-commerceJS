var aux = true;
  dataLayer.forEach(function(data){
    if(data.pageCategory== 'Product'){
      var items = [{
        'item_name': data.productName,
        'price': data.productPriceTo,
        'item_id': data.productId,
        'currency': 'BRL',
        'item_category':data.productCategoryName
        }]
      dataLayer.push({
        'event': 'view_item',
        'currency': 'BRL',
        'items': items
      })
  
    }else if(data.event == "productView" || data.event == "productDetail" && aux === true){
      if(data.event == "productDetail"){
        dataLayer.push({
          'event': 'view_item',
          'currency': 'BRL',
          'items': data.ecommerce.detail.products
        })
        aux = false;
      }
    }else if(window.location.pathname.includes('/p')){
      var items = [{
          name: document.querySelector('.productName').innerText,
          price: parseFloat(document.querySelector('.productPrice strong').innerText.match(/\d+/g).join('')/100),
          currency: 'BRL'
      }];
      dataLayer.push({
          'event': 'view_item',
          'currency': 'BRL',
          'items': items
      })  
    }
  })


var intervalo = setInterval(function(){
      dataLayer.forEach(function(data){
        if(data.event == "payment" ){
          dataLayer.push({
            'event': 'begin_checkout',
            'currency': 'BRL',
            'items': data.ecommerce.checkout.products
          })
          clearInterval(intervalo);
          console.log('stop time')
  
        }
      })
    },4000)
    
var aux = true;
  dataLayer.forEach(function(data){
    if(data.event == "cart" || data.event == "cartLoaded" && aux === true){
      if(data.event == "cart" && aux === true){
        dataLayer.push({
          'event': 'add_to_cart',
          'currency': 'BRL',
          'items': data.ecommerce.checkout.products
        })
        aux === false
      }else if(data.event == "cartLoaded" && aux === true){
        dataLayer.push({
          'event': 'add_to_cart',
          'currency': 'BRL',
          'items': data.ecommerce.checkout.products
        })
        aux === false
      }
      aux = false;
    }
  })

