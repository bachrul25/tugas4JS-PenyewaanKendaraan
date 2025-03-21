// CLASS PELANGGAN
class Pelanggan {
  constructor(nama, nomorTelepon, kendaraanDisewa) {
    this.nama = nama;
    this.nomorTelepon = nomorTelepon;
    this.kendaraanDisewa = kendaraanDisewa;
  }
}

let daftarPelanggan = JSON.parse(localStorage.getItem("daftarPelanggan")) || [];
let currentSortField = "";
let sortAscending = true;
let chartPenyewaan = null;

// LOCAL STORAGE
function saveToLocalStorage() {
  localStorage.setItem("daftarPelanggan", JSON.stringify(daftarPelanggan));
}

// IKON KENDARAAN
function getKendaraanIcon(kendaraan) {
  switch (kendaraan) {
    case "Mobil": return '<i class="bi bi-car-front-fill text-primary fs-4"></i>';
    case "Motor": return '<i class="bi bi-scooter text-success fs-4"></i>';
    case "Bus": return '<i class="bi bi-bus-front-fill text-warning fs-4"></i>';
    case "Truk": return '<i class="bi bi-truck-front-fill text-danger fs-4"></i>';
    default: return '<i class="bi bi-question-circle-fill"></i>';
  }
}

// TAMPILKAN PELANGGAN
function tampilkanPelanggan() {
  const tbody = document.querySelector("#tabelPelanggan tbody");
  const totalPelanggan = document.getElementById("totalPelanggan");
  const filterInput = document.getElementById("filterInput");

  if (!tbody || !totalPelanggan || !filterInput) return;

  const filterValue = filterInput.value.toLowerCase();
  tbody.innerHTML = "";

  const pelangganTersaring = daftarPelanggan.filter(p =>
    p.nama.toLowerCase().includes(filterValue) ||
    p.kendaraanDisewa.toLowerCase().includes(filterValue)
  );

  pelangganTersaring.forEach((pelanggan, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pelanggan.nama}</td>
      <td>${pelanggan.nomorTelepon}</td>
      <td>${pelanggan.kendaraanDisewa}</td>
      <td>${getKendaraanIcon(pelanggan.kendaraanDisewa)}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editPelanggan(${index})">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-danger btn-sm" onclick="hapusPelanggan(${index})">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalPelanggan.textContent = pelangganTersaring.length;
  updateChart(); // Update grafik setiap kali ada perubahan data
}

// HAPUS PELANGGAN
function hapusPelanggan(index) {
  const pelanggan = daftarPelanggan[index];
  if (confirm(`Yakin ingin menghapus ${pelanggan.nama}?`)) {
    daftarPelanggan.splice(index, 1);
    saveToLocalStorage();
    tampilkanPelanggan();
  }
}

// EDIT PELANGGAN
function editPelanggan(index) {
  const pelanggan = daftarPelanggan[index];

  document.getElementById("nama").value = pelanggan.nama;
  document.getElementById("nomorTelepon").value = pelanggan.nomorTelepon;
  document.getElementById("kendaraanDisewa").value = pelanggan.kendaraanDisewa;
  document.getElementById("editIndex").value = index;

  document.getElementById("formTitle").textContent = "Edit Penyewaan";
  document.getElementById("btnSubmitText").textContent = "Update";
}

// SORTING
function sortTabel(field) {
  if (currentSortField === field) {
    sortAscending = !sortAscending;
  } else {
    currentSortField = field;
    sortAscending = true;
  }

  daftarPelanggan.sort((a, b) => {
    const valA = a[field].toLowerCase();
    const valB = b[field].toLowerCase();

    if (valA < valB) return sortAscending ? -1 : 1;
    if (valA > valB) return sortAscending ? 1 : -1;
    return 0;
  });

  tampilkanPelanggan();
}

// FORM SUBMIT
document.addEventListener("DOMContentLoaded", () => {
  const formPelanggan = document.getElementById("formPelanggan");
  const filterInput = document.getElementById("filterInput");

  if (!formPelanggan || !filterInput) return;

  formPelanggan.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const nomorTelepon = document.getElementById("nomorTelepon").value.trim();
    const kendaraanDisewa = document.getElementById("kendaraanDisewa").value;
    const editIndex = parseInt(document.getElementById("editIndex").value, 10);

    if (!nama || !nomorTelepon || !kendaraanDisewa) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editIndex === -1) {
      const pelangganBaru = new Pelanggan(nama, nomorTelepon, kendaraanDisewa);
      daftarPelanggan.push(pelangganBaru);
      alert(`✅ Penyewaan Berhasil!\n${nama} menyewa ${kendaraanDisewa}`);
    } else {
      daftarPelanggan[editIndex].nama = nama;
      daftarPelanggan[editIndex].nomorTelepon = nomorTelepon;
      daftarPelanggan[editIndex].kendaraanDisewa = kendaraanDisewa;
      alert(`✅ Data ${nama} berhasil diupdate!`);
    }

    saveToLocalStorage();
    tampilkanPelanggan();

    this.reset();
    document.getElementById("editIndex").value = -1;
    document.getElementById("formTitle").textContent = "Form Penyewaan";
    document.getElementById("btnSubmitText").textContent = "Sewa Sekarang";
  });

  filterInput.addEventListener("keyup", tampilkanPelanggan);

  tampilkanPelanggan(); // Inisialisasi data awal
});

// GRAFIK PENYEWAAN KENDARAAN
function updateChart() {
  const canvas = document.getElementById('chartPenyewaan');
  if (!canvas) {
    console.warn('Canvas chartPenyewaan tidak ditemukan.');
    return;
  }

  const ctx = canvas.getContext('2d');

  const dataMobil = daftarPelanggan.filter(p => p.kendaraanDisewa === 'Mobil').length;
  const dataMotor = daftarPelanggan.filter(p => p.kendaraanDisewa === 'Motor').length;
  const dataBus = daftarPelanggan.filter(p => p.kendaraanDisewa === 'Bus').length;
  const dataTruk = daftarPelanggan.filter(p => p.kendaraanDisewa === 'Truk').length;

  // Gradien warna (opsional)
  const gradientMobil = ctx.createLinearGradient(0, 0, 0, 400);
  gradientMobil.addColorStop(0, 'rgba(13, 110, 253, 0.8)');
  gradientMobil.addColorStop(1, 'rgba(13, 110, 253, 0.3)');

  const gradientMotor = ctx.createLinearGradient(0, 0, 0, 400);
  gradientMotor.addColorStop(0, 'rgba(25, 135, 84, 0.8)');
  gradientMotor.addColorStop(1, 'rgba(25, 135, 84, 0.3)');

  const gradientBus = ctx.createLinearGradient(0, 0, 0, 400);
  gradientBus.addColorStop(0, 'rgba(255, 193, 7, 0.8)');
  gradientBus.addColorStop(1, 'rgba(255, 193, 7, 0.3)');

  const gradientTruk = ctx.createLinearGradient(0, 0, 0, 400);
  gradientTruk.addColorStop(0, 'rgba(220, 53, 69, 0.8)');
  gradientTruk.addColorStop(1, 'rgba(220, 53, 69, 0.3)');

  const dataChart = {
    labels: ['Mobil', 'Motor', 'Bus', 'Truk'],
    datasets: [{
      label: 'Jumlah Penyewa',
      data: [dataMobil, dataMotor, dataBus, dataTruk],
      backgroundColor: [
        gradientMobil,
        gradientMotor,
        gradientBus,
        gradientTruk
      ],
      borderRadius: 10, // bikin rounded bar
      barPercentage: 0.6, // lebar bar
      borderSkipped: false, // hilangkan sisi flat di bar
      hoverBackgroundColor: [
        'rgba(13, 110, 253, 1)',
        'rgba(25, 135, 84, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(220, 53, 69, 1)'
      ]
    }]
  };

  if (chartPenyewaan) {
    chartPenyewaan.destroy();
  }

  chartPenyewaan = new Chart(ctx, {
    type: 'bar',
    data: dataChart,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Grafik Penyewaan Kendaraan',
          font: {
            size: 18,
            weight: 'bold'
          },
          color: '#333'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.raw} pelanggan`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Jenis Kendaraan',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            color: '#333'
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Jumlah Penyewa',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            precision: 0,
            color: '#333'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            borderDash: [5, 5]
          }
        }
      }
    }
  });
}
