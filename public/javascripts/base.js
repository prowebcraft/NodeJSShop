$(document).ready(function () {
    $(".models-container").find('li button.btn-cart').click(function () {
        var $item = $(this).closest('li'),
            itemID = $item.data('id'),
            price = parseInt($item.find('div.price').text());
        $img = $item.find('img').first(),
            $cart = $('.shopping-cart');
        if ($img.length) {
            var $imgClone = $img.clone()
                .offset({
                    top: $img.offset().top,
                    left: $img.offset().left
                })
                .css({
                    'opacity': '0.8',
                    'position': 'absolute',
                    'width': $img.outerWidth() + "px",
                    'height': $img.outerHeight() + "px",
                    'z-index': '100'
                })
                .appendTo($('body'))
                .animate({
                    'top': $cart.offset().top,
                    'left': $cart.offset().left,
                    'width': "50px",
                    'height': "50px"
                }, 500, 'easeInOutCubic');

            setTimeout(function () {
                $imgClone.detach();
                $cart.stop().fadeOut('fast', function () {
                    addToCart(itemID, price);
                    $cart.stop().fadeIn();
                });
            }, 800);

            /*
            $imgClone.animate({
                'width': 0,
                'height': 0
            }, function () {
                $(this).detach()
            });
            */
        }
    });

    $(".shopping-cart").find('.cart-clear').click(function(e){
        e.preventDefault();
        var $cart = $('.shopping-cart');
        localStorage.removeItem('cart');
        $cart.fadeOut(function(){
            updateCartState();
            $cart.fadeIn();
        });
        return false;
    });

    updateCartState();
});

function updateCartState(cart) {

    var cart = cart || getCart(),
        $cart = $('.shopping-cart');
    if (cart.length) {
        var cartSum = 0;
        for (var i = 0; i < cart.length; i++) {
            cartSum += cart[i][1];
        }
        $cart.addClass('active').removeAttr('disabled');
        $cart.find('.cart-count').text(cart.length);
        $cart.find('.cart-sum').text(cartSum.formatMoney(2, ' ', ',', ' руб.'));
    } else {
        $cart.removeClass('active').attr('disabled', 'disabled');
        $cart.find('.cart-count').text(0);
        $cart.find('.cart-sum').text('');
    }
}

function getCart() {
    var cart = localStorage.getItem('cart');
    return (cart && (cart = JSON.parse(cart)) ? cart : []);
}

function saveCart(cart) {
    if (!cart) localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartState();
}

function removeFromCart(id) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i][0] == id)
            cart.splice(i);
    }
    saveCart(cart);
    return cart;
}

function addToCart(id, price) {
    var cart = getCart();
    cart.push([ id, price ]);
    saveCart(cart);
    return cart;
}

Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator, currencySymbol) {
    // check the args and supply defaults:
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
    decSeparator = decSeparator == undefined ? "." : decSeparator;
    thouSeparator = thouSeparator == undefined ? "," : thouSeparator;
    currencySymbol = currencySymbol == undefined ? "$" : currencySymbol;

    var n = this,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;

    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "") + currencySymbol;
};