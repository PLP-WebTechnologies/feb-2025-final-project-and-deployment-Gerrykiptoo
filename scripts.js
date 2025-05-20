document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Popular Food Items
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        const foodItems = [
            { 
                name: 'Classic Burger', 
                price: '$12.99', 
                rating: 4.8,
                description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            },
            { 
                name: 'Margherita Pizza', 
                price: '$14.99', 
                rating: 4.7,
                description: 'Traditional pizza with tomato sauce, mozzarella, and fresh basil',
                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            },
            { 
                name: 'Chicken Alfredo Pasta', 
                price: '$16.99', 
                rating: 4.6,
                description: 'Creamy alfredo sauce with grilled chicken and fettuccine pasta',
                image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            },
            { 
                name: 'Vegetable Stir Fry', 
                price: '$13.99', 
                rating: 4.5,
                description: 'Fresh vegetables stir-fried with tofu in a savory sauce',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            },
            { 
                name: 'Chocolate Brownie', 
                price: '$6.99', 
                rating: 4.9,
                description: 'Rich chocolate brownie served with vanilla ice cream',
                image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80'
            },
            { 
                name: 'Fresh Fruit Smoothie', 
                price: '$7.99', 
                rating: 4.7,
                description: 'Blend of seasonal fruits with yogurt and honey',
                image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1208&q=80'
            }
        ];

        foodItems.forEach(item => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Create star rating HTML
            let starsHTML = '';
            const fullStars = Math.floor(item.rating);
            const hasHalfStar = item.rating % 1 >= 0.5;
            
            for (let i = 0; i < fullStars; i++) {
                starsHTML += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            }
            
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                starsHTML += '<i class="far fa-star"></i>';
            }
            
            productCard.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="product-info">
                    <h3>${item.name}</h3>
                    <span class="price">${item.price}</span>
                    <div class="rating">${starsHTML}</div>
                    <p>${item.description}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    // Shopping Cart Functionality
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount();

    // Add to Cart Button Functionality
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const image = card.querySelector('img').src;
            
            // Check if item is already in cart
            const existingItem = cartItems.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update cart count
            updateCartCount();
            
            // Show notification
            showNotification(`${name} added to cart!`);
        });
    });

    // Function to update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Function to show notification
    function showNotification(message) {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Add notification styles if not already in CSS
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .notification {
            background-color: var(--primary-color);
            color: white;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            animation: slideIn 0.5s forwards;
        }
        
        .notification i {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .notification.fade-out {
            animation: fadeOut 0.5s forwards;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
