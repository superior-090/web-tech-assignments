(() => {
    const params = new URLSearchParams(location.search);
    const message =
        params.get("error") || params.get("success");

    // Display flash messages
    document
        .querySelectorAll(".flash-message")
        .forEach((box) => {
            if (message) {
                box.textContent = message;

                box.classList.add(
                    params.has("error")
                        ? "error"
                        : "success"
                );
            }
        });

    // Mobile menu toggle
    const toggle = document.querySelector(".menu-toggle");

    if (toggle) {
        toggle.addEventListener("click", () => {
            document
                .querySelector(".main-nav")
                .classList.toggle("open");
        });
    }

    // Check user session
    fetch("/api/session")
        .then((res) => res.json())
        .then(async ({ loggedIn, user }) => {
            if (!loggedIn) return;

            // Hide guest navigation
            document
                .querySelectorAll(".guest-nav")
                .forEach((el) => {
                    el.hidden = true;
                });

            // Show user navigation
            document
                .querySelectorAll(".user-nav")
                .forEach((el) => {
                    el.hidden = false;

                    el.querySelector(".welcome").textContent =
                        `Hi, ${user.name.split(" ")[0]}`;

                    // Add cart link if it doesn't already exist
                    if (!el.querySelector(".cart-link")) {
                        const link =
                            document.createElement("a");

                        link.href = "/cart";
                        link.className = "cart-link";

                        link.innerHTML =
                            'Cart <span class="cart-count">0</span>';

                        el.prepend(link);
                    }

                    if (!el.querySelector(".orders-link")) {
                        const link = document.createElement("a");
                        link.href = "/orders";
                        link.className = "orders-link";
                        link.textContent = "Orders";
                        el.querySelector(".cart-link").after(link);
                    }
                });

            // Load cart
            const cart = await fetch("/api/cart").then(
                (r) => (r.ok ? r.json() : [])
            );

            // Calculate cart item count
            const count = cart.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            // Update all cart counters
            document
                .querySelectorAll(".cart-count")
                .forEach((el) => {
                    el.textContent = count;
                });
        })
        .catch(() => {});
})();
