const content = document.querySelector("#orders-content");
const money = value => `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const escapeHtml = value => { const el = document.createElement("div"); el.textContent = value || ""; return el.innerHTML; };

async function loadOrders() {
    const response = await fetch("/api/orders");
    if (response.status === 401) { location.href = "/login?error=" + encodeURIComponent("Please login to view your orders."); return; }
    const orders = await response.json();
    if (!response.ok) throw new Error(orders.error);
    content.innerHTML = orders.length ? `<div class="orders-list">${orders.map(order => `
        <article class="order-card"><div class="order-meta"><div><p class="eyebrow">Order #${order.id}</p><h2>${new Date(order.createdAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" })}</h2></div><span class="order-status">${escapeHtml(order.status)}</span></div>
        <div class="order-items">${order.items.map(item => `<div><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.author)} · Quantity: ${item.quantity}</small></span><span>${money(item.unitPrice)} × ${item.quantity}</span></div>`).join("")}</div>
        <p class="order-total"><span>Total</span><strong>${money(order.total)}</strong></p></article>`).join("")}</div>` : `<div class="empty-cart"><h2>Your shelf is ready for its first story.</h2><p>Completed purchases will appear here.</p><a class="button" href="/catalogue">Browse books</a></div>`;
}
loadOrders().catch(error => { content.innerHTML = `<p class="empty">${escapeHtml(error.message || "Could not load your order history.")}</p>`; });
