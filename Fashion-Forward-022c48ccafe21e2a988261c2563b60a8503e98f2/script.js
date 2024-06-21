document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('#product-list');
    const productDetail = document.querySelector('#product-detail');
    const productDetailContent = document.querySelector('#product-detail-content');
    const cart = document.querySelector('#cart');
    const cartItems = document.querySelector('#cart-items');
    const cartCount = document.querySelector('#cart-count');
    const closeCartBtn = document.querySelector('#close-cart');
    const closeProductDetailBtn = document.querySelector('#close-product-detail');
    const cartIcon = document.querySelector('#cart-icon');
   
    

    let shoppingCart = [];


    // Fetch products from API
    async function fetchProducts() {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        displayProducts(data);
        console.log(data);
    }

    // Display products in the product list
    function displayProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.setAttribute('data-id', product.id);
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <div class="product-buttons">
                    <button class="details-btn" data-id="${product.id}">Details</button>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    <button class="checkout-btn" data-id="${product.id}">Checkout</button>
                </div>
            `;
            productList.appendChild(productElement);

            // Add event listener for details button
            const detailsBtn = productElement.querySelector('.details-btn');
            detailsBtn.addEventListener('click', () => {
                console.log(`Details button clicked for product ID: ${product.id}`);
                showProductDetail(product.id);
            });

            // Add event listener for add to cart button
            const addToCartBtn = productElement.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => {
                console.log(`Add to Cart button clicked for product ID: ${product.id}`);
                addToCart(product.id);
            });

            // Add event listener for checkout button
            const checkoutBtn = productElement.querySelector('.checkout-btn');
            checkoutBtn.addEventListener('click', () => {
                console.log(`Checkout button clicked for product ID: ${product.id}`);
                checkoutProduct(product.id);
            });
        });
    }

    // Show product details in the product detail section
    async function showProductDetail(productId) {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await response.json();
        productDetailContent.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
            <p><strong>$${product.price.toFixed(2)}</strong></p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;
        productDetail.classList.add('visible');

        // Add event listener for "Add to Cart" button in product detail
        const addToCartBtn = productDetailContent.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            console.log(`Add to Cart button clicked for product ID: ${product.id}`);
            addToCart(product.id);
        });
    }

    // Close product detail section
    closeProductDetailBtn.addEventListener('click', () => {
        console.log('Close Product Detail button clicked');
        productDetail.classList.remove('visible');
    });

    // Add product to shopping cart
    async function addToCart(productId) {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await response.json();
        const cartItem = shoppingCart.find(item => item.id === product.id);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            product.quantity = 1;
            shoppingCart.push(product);
        }

        console.log(`Product added to cart:`, product);
        updateCart();
    }

    // Update cart  
    function updateCart() {
        cartCount.textContent = shoppingCart.length;
        cartItems.innerHTML = '';
        let totalPrice = 0;

        shoppingCart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <p>${item.title}</p>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItemElement);

            // Add event listeners for quantity controls
            const decreaseBtn = cartItemElement.querySelector('.decrease-quantity');
            decreaseBtn.addEventListener('click', () => {
                decreaseQuantity(item.id);
            });

            const increaseBtn = cartItemElement.querySelector('.increase-quantity');
            increaseBtn.addEventListener('click', () => {
                increaseQuantity(item.id);
            });

            // Calculate total price
            totalPrice += item.price * item.quantity;
        });

        // Add total price to the cart
        const totalPriceElement = document.createElement('div');
        totalPriceElement.classList.add('total-price');
        totalPriceElement.innerHTML = `<strong>Total: $${totalPrice.toFixed(2)}</strong>`; 
        cartItems.appendChild(totalPriceElement);

        // Add checkout button to the cart
        const checkoutBtn = document.createElement('button');
        checkoutBtn.classList.add('checkout-btn');
        checkoutBtn.innerText = 'Checkout';
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
        cartItems.appendChild(checkoutBtn);

        console.log('Cart updated', shoppingCart);
    }

    // Increase quantity in the cart
    function increaseQuantity(productId) {
        const cartItem = shoppingCart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
            updateCart();
        }
    }

    // Decrease quantity in the cart
    function decreaseQuantity(productId) {
        const cartItem = shoppingCart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity--;
            if (cartItem.quantity === 0) {
                shoppingCart = shoppingCart.filter(item => item.id !== productId);
            }
            updateCart();
        }
    }

    // Handle checkout button click
    async function checkoutProduct(productId) {
        console.log(`Checkout button clicked for product ID: ${productId}`);
        // Redirect to checkout page
        window.location.href = `checkout.html?productId=${productId}`;
    }

    // Open/close cart
    cartIcon.addEventListener('click', () => {
        console.log('Cart icon clicked');
        cart.classList.toggle('visible');
    });

    closeCartBtn.addEventListener('click', () => {
        console.log('Close Cart button clicked');
        cart.classList.remove('visible');
    });
    

  

    // Init: Fetch products from API
    fetchProducts();
});
