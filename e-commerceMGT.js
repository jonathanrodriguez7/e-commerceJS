    (function () {
        if (typeof dataLayer === "undefined") {
            window.dataLayer = [];
        }
        var g_product = document.querySelector('[name="product"]');
        if (g_product) {

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
                    alert()
                    var g_items = [];
                    var g_total = document.querySelector("#checkout-review-table  strong .price").innerText.match(/\d+/g).join('') / 100;

                    for (var index = 0; index < Object.keys(cartObject).length; index++) {
                        var item = {};

                        item = {
                            'quantity': +cartObject[Object.keys(cartObject)[index]].qty,
                            'price': parseFloat(cartObject[Object.keys(cartObject)[index]].price),
                            'item_name': cartObject[Object.keys(cartObject)[index]].name
                        }

                        g_items.push(item)

                    }



                    if (typeof localStorage !== "undefined") {
                        localStorage.g_items = JSON.stringify(g_items);
                        localStorage.g_total = g_total;
                    }
                    dataLayer.push({
                        'event': 'begin_checkout',
                        ecommerce: {
                            items: g_items
                        }
                    });
                }
            })

        }

        if (window.location.href.includes('checkout/onepage/success/')) {
            var transaction_id = document.querySelector(".order-number .number span").innerText;
            var value = 0;
            var items = [];
            if (typeof localStorage !== "undefined") {
                value = parseFloat(localStorage.g_total) || 0;
                items = JSON.parse(localStorage.g_items) || [];
            }
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
