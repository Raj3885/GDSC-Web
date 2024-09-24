document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

let cart = {};

function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => displayProducts(products))
        .catch(error => showError("Error fetching products: " + error));
}

function displayProducts(products) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
    });
}

function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "product";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    productCard.appendChild(img);

    const productName = document.createElement("h4");
    productName.textContent = product.title;
    productCard.appendChild(productName);

    const price = document.createElement("p");
    price.textContent = `₹${product.price}`;
    productCard.appendChild(price);

    const ratingContainer = document.createElement("div");
    ratingContainer.className = "rating-container";
    const ratingIcon = document.createElement("span");
    ratingIcon.className = "star";
    ratingIcon.innerHTML = "&#9733;";
    const ratingValue = document.createElement("span");
    ratingValue.textContent = ` ${product.rating.rate}`;
    ratingValue.className = "rating-value";

    ratingContainer.appendChild(ratingIcon);
    ratingContainer.appendChild(ratingValue);
    productCard.appendChild(ratingContainer);

    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.className = "add-to-cart-btn";
    addToCartBtn.onclick = () => addToCart(product);
    productCard.appendChild(addToCartBtn);

    return productCard;
}

function addToCart(product) {
    cart[product.id] = cart[product.id] ? { ...cart[product.id], quantity: cart[product.id].quantity + 1 } : { ...product, quantity: 1 };
    updateCart();
}

function removeFromCart(productId) {
    delete cart[productId];
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = '';

    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    }

    let totalMRP = 0;

    Object.values(cart).forEach(item => {
        totalMRP += item.price * item.quantity;
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });

    updatePriceDetails(totalMRP);
}

function createCartItem(item) {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.style.width = '50px'; // Adjust image size in cart
    cartItem.appendChild(img);

    const name = document.createElement("h4");
    name.textContent = item.title;
    cartItem.appendChild(name);

    const qtyContainer = document.createElement("div");
    qtyContainer.className = "qty-container";

    const minusBtn = createQuantityButton("-", () => {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(item.id);
        }
        updateCart();
    });
    qtyContainer.appendChild(minusBtn);

    const qtyDisplay = document.createElement("span");
    qtyDisplay.textContent = item.quantity;
    qtyContainer.appendChild(qtyDisplay);

    const plusBtn = createQuantityButton("+", () => {
        item.quantity += 1;
        updateCart();
    });
    qtyContainer.appendChild(plusBtn);

    cartItem.appendChild(qtyContainer);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-from-cart-btn";
    removeBtn.onclick = () => removeFromCart(item.id);
    cartItem.appendChild(removeBtn);

    return cartItem;
}

function createQuantityButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClick;
    return button;
}

function updatePriceDetails(totalMRP) {
    const priceDetails = document.getElementById("price-details");

    let totalMRPElement = document.getElementById("total-mrp") || createPriceDetailElement("total-mrp", priceDetails);
    let couponDiscountElement = document.getElementById("coupon-discount") || createPriceDetailElement("coupon-discount", priceDetails);
    let totalAmountElement = document.getElementById("total-amount") || createPriceDetailElement("total-amount", priceDetails);

    const couponDiscount = (totalMRP * 0.05).toFixed(2);
    const platformFee = 10;
    const shippingCharges = 20;
    const totalAmount = totalMRP - couponDiscount + platformFee + shippingCharges;

    totalMRPElement.textContent = `Total MRP: ₹${totalMRP.toFixed(2)}`;
    couponDiscountElement.textContent = `Coupon Discount: ₹${couponDiscount}`;
    totalAmountElement.textContent = `Total Amount: ₹${totalAmount.toFixed(2)}`;
}

function createPriceDetailElement(id, parent) {
    const element = document.createElement("p");
    element.id = id;
    parent.appendChild(element);
    return element;
}

function showError(message) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = `<p>${message}</p>`;
}
