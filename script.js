// 1. Fungsi Pergantian Tab / Halaman
function switchPage(pageId, btnElement, event) {
    if (event) event.preventDefault();

    // Sembunyikan semua halaman
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(page => page.classList.remove('active'));

    // Reset status tombol navigasi
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // Tampilkan halaman target
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Aktifkan tombol yang sesuai
    if (btnElement) {
        btnElement.classList.add('active');
    } else {
        const matchingBtn = document.querySelector(`.nav-menu .nav-link[onclick*="'${pageId}'"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
    }

    // Gulir halus ke atas
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 2. Filter Kategori Objek Wisata
function filterDestinasi(category, clickedBtn) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    const cards = document.querySelectorAll('.dest-card');
    cards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (category === 'semua' || itemCat === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 3. Kalkulator Estimasi Biaya Pemesanan
function calculateSummary() {
    const packageSelect = document.getElementById('packageSelect');
    const jeepCountInput = document.getElementById('jeepCount');
    const addonSelect = document.getElementById('addonTransfer');
    const summaryDetail = document.getElementById('summaryDetail');
    const summaryTotal = document.getElementById('summaryTotal');

    if (!packageSelect || !packageSelect.value) {
        if (summaryDetail) summaryDetail.textContent = 'Silakan tentukan paket wisata terlebih dahulu.';
        if (summaryTotal) summaryTotal.textContent = 'Total: Rp 0';
        return;
    }

    const [packageName, pricePerJeep] = packageSelect.value.split('|');
    const basePrice = parseInt(pricePerJeep, 10);
    const qtyJeep = Math.max(1, parseInt(jeepCountInput.value, 10) || 1);
    const addonPrice = parseInt(addonSelect.value, 10) || 0;

    const subtotalJeep = basePrice * qtyJeep;
    const grandTotal = subtotalJeep + addonPrice;

    summaryDetail.innerHTML = `
        <strong>${packageName}</strong> (${qtyJeep} Unit Jip x Rp ${basePrice.toLocaleString('id-ID')}) = Rp ${subtotalJeep.toLocaleString('id-ID')}<br>
        Layanan Penjemputan: Rp ${addonPrice.toLocaleString('id-ID')}
    `;
    summaryTotal.textContent = `Total: Rp ${grandTotal.toLocaleString('id-ID')}`;
}

// 4. Form Submit ke WhatsApp
function handleBookingSubmit(event) {
    event.preventDefault();

    const clientName = document.getElementById('clientName').value.trim();
    const clientPhone = document.getElementById('clientPhone').value.trim();
    const tripDate = document.getElementById('tripDate').value;
    const packageSelect = document.getElementById('packageSelect').value;
    const jeepCount = document.getElementById('jeepCount').value;
    const addonSelect = document.getElementById('addonTransfer');
    const addonText = addonSelect.options[addonSelect.selectedIndex].text;
    const notes = document.getElementById('clientNotes').value.trim() || 'Tidak ada';

    if (!packageSelect) {
        alert('Mohon pilih paket wisata terlebih dahulu!');
        return;
    }

    const [packageName, pricePerJeep] = packageSelect.split('|');
    const basePrice = parseInt(pricePerJeep, 10);
    const qtyJeep = parseInt(jeepCount, 10) || 1;
    const addonPrice = parseInt(addonSelect.value, 10) || 0;
    const grandTotal = (basePrice * qtyJeep) + addonPrice;

    const message = `*FORMULIR RESERVASI TOUR MERAPI & MBAH MARIDJAN*
---------------------------------------
👤 *Nama Pemesan:* ${clientName}
📞 *Kontak HP/WA:* ${clientPhone}
📅 *Tanggal Trip:* ${tripDate}
🚙 *Pilihan Paket:* ${packageName}
🔢 *Jumlah Armada:* ${qtyJeep} Unit Jeep (Kapasitas ±${qtyJeep * 4} Pax)
🚐 *Antar Jemput:* ${addonText}
📝 *Catatan Khusus:* ${notes}
---------------------------------------
💰 *Estimasi Total:* Rp ${grandTotal.toLocaleString('id-ID')}

Halo Admin Operasional, mohon informasi ketersediaan slot armada jip untuk tanggal tersebut. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=6285219471864&text=${encodedMessage}`;
    window.open(waUrl, '_blank');
}

// Set tanggal minimal pemesanan hari ini
window.addEventListener('DOMContentLoaded', () => {
    const tripDateInput = document.getElementById('tripDate');
    if (tripDateInput) {
        const today = new Date().toISOString().split('T')[0];
        tripDateInput.min = today;
    }
});