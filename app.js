// ======================= app.js =======================
// Chicos: lógica del "Hacer pedido" para *detailing automotriz*.
// Lee el formulario, calcula total (paquete * cantidad + extras + desplazamiento)
// y muestra un resumen. Está escrito paso a paso y con comentarios.

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
  return Number(num || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
  const raw = el?.dataset?.precio;
  return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos que usaremos:
  const form = document.getElementById('formPedido');          // (si tu HTML no lo tiene, puedes ignorar este bloque)
  const outNombre = document.getElementById('outNombre');
  const outLista  = document.getElementById('outLista');
  const outTotal  = document.getElementById('outTotal');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const confirmNombre = document.getElementById('confirmNombre');

  // Toast UX (aviso corto)
  const toastBtn = document.getElementById('btnToast');
  const toastEl  = document.getElementById('toastAviso');
  const toast    = (typeof bootstrap !== 'undefined' && toastEl) ? bootstrap.Toast.getOrCreateInstance(toastEl) : null;
  toastBtn?.addEventListener('click', () => toast?.show());

  // Solo conectar si existe el form estructural de pedido avanzado
  form?.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // 1) Leemos campos base
    const nombre = document.getElementById('nombreCliente')?.value.trim();
    const selModelo = document.getElementById('selModelo');
    const selTalla  = document.getElementById('selTalla'); // en detailing puedes omitirlo si no existe
    const selColor  = document.getElementById('selColor');
    const cantidadEl  = document.getElementById('inpCantidad');
    const cantidad  = Number(cantidadEl?.value || 0);

    // Validación mínima:
    if (!nombre || !selModelo?.value || !selColor?.value || cantidad < 1) {
      alert('Completa nombre, paquete, color y cantidad (mínimo 1).');
      return;
    }

    // 2) Precios base
    const optModelo = selModelo.options[selModelo.selectedIndex];
    const precioModelo = getPrecioFromDataset(optModelo) || 799; // precio unitario estimado del paquete
    let total = precioModelo * cantidad;

    // 3) Extras / servicios adicionales por auto
    const chkNombreNumero = document.getElementById('chkNombreNumero'); // Descontaminación férrica
    const chkParcheLiga   = document.getElementById('chkParcheLiga');   // Sellado cerámico rápido

    const extrasSeleccionados = [];
    if (chkNombreNumero?.checked) {
      total += getPrecioFromDataset(chkNombreNumero) || (250 * cantidad);
      extrasSeleccionados.push('Descontaminación férrica');
    }
    if (chkParcheLiga?.checked) {
      total += getPrecioFromDataset(chkParcheLiga) || (400 * cantidad);
      extrasSeleccionados.push('Sellado cerámico rápido');
    }

    // Campos condicionales
    const inpNombre = document.getElementById('inpNombre')?.value.trim(); // Placas
    const inpNumero = document.getElementById('inpNumero')?.value.trim(); // Fragancia

    // 4) Desplazamiento e instrucciones
    const selEnvio = document.getElementById('selEnvio');
    const optEnvio = selEnvio ? selEnvio.options[selEnvio.selectedIndex] : null;
    const costoEnvio = getPrecioFromDataset(optEnvio) || 100;
    total += costoEnvio;

    const txtInstr = document.getElementById('txtInstrucciones')?.value.trim() || document.getElementById('txtNotas')?.value.trim();

    // 5) Pintamos resumen (si existen los nodos de salida)
    if (outNombre) outNombre.textContent = nombre;

    if (outLista) {
      outLista.innerHTML = `
        <li><strong>Paquete:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
        ${selTalla?.value ? `<li><strong>Tipo de vehículo:</strong> ${selTalla.value}</li>` : ''}
        <li><strong>Color exterior:</strong> ${selColor.value}</li>
        <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
        ${inpNombre || inpNumero ? `<li><strong>Detalles:</strong> ${inpNombre ? 'Placas: ' + inpNombre : ''} ${inpNumero ? ' | Fragancia: ' + inpNumero : ''}</li>` : ''}
        ${selEnvio ? `<li><strong>Desplazamiento:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>` : ''}
        ${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
      `;
    }

    if (outTotal) outTotal.textContent = toMXN(total);

    // Habilitamos confirmar y pasamos nombre al modal
    if (btnConfirmar) btnConfirmar.disabled = false;
    if (confirmNombre) confirmNombre.textContent = nombre;
  });

  // Reset: limpiar también el resumen
  form?.addEventListener('reset', () => {
    setTimeout(() => {
      if (outNombre) outNombre.textContent = '—';
      if (outLista) outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido de detailing.</li>';
      if (outTotal) outTotal.textContent = '$0';
      if (btnConfirmar) btnConfirmar.disabled = true;
    }, 0);
  });
});
// ===================== /app.js ======================

// ================== Actividades DOM (Banner, Testimonios, Contacto) ==================
document.addEventListener('DOMContentLoaded', () => {
  // -------- Actividad 1: Banner con getElementById --------
  const banner = document.getElementById('banner');
  const btnPromo = document.getElementById('btnPromo');

  btnPromo?.addEventListener('click', () => {
    banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
    banner.classList.add('bg-warning');
    banner.classList.remove('text-white');
    banner.classList.add('text-dark');
  });

  // -------- Actividad 2: Testimonios --------
  const vipItems = document.getElementsByClassName('testimonio-vip');
  for (const item of vipItems) {
    item.classList.add('text-primary');
  }

  // Conservamos la demostración de DOM (párrafos en rojo)
  const allParagraphs = document.getElementsByTagName('p');
  // const allParagraphs = document.querySelectorAll('#testimonios p');
  for (const p of allParagraphs) {
    p.classList.add('text-danger');
  }

  // -------- Actividad 3: Formulario de contacto --------
  const firstTextInput = document.querySelector('#formContacto input[type="text"]');
  firstTextInput?.classList.add('bg-success', 'bg-opacity-10');

  const contactoButtons = document.querySelectorAll('#formContacto button');
  contactoButtons.forEach(btn => {
    btn.classList.remove('btn-primary', 'btn-outline-secondary');
    btn.classList.add('btn-danger');
  });

  const nombreInputs = document.getElementsByName('nombre');
  if (nombreInputs.length > 0) {
    const nombreInput = nombreInputs[0];
    nombreInput.classList.add('text-warning');
    const label = document.querySelector('label[for="cNombre"]');
    label?.classList.add('text-warning');
  }
});

// ======= WhatsApp flotante: mostrar tras scroll + mensaje por horario =======
document.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.querySelector('.whatsapp-float');
  if (!waBtn) return;

  // 1) Mensaje dinámico según hora local (9 a 18 h "en línea")
  const h = new Date().getHours();
  const enHorario = h >= 9 && h < 18;
  const msg = enHorario ? '¡Respondo ahora!' : 'Fuera de horario, te contesto pronto';
  waBtn.title = `WhatsApp — ${msg}`;
  waBtn.setAttribute('aria-label', `Chatea por WhatsApp — ${msg}`);

  // Prefill del texto en el chat
  const telefono = '527221234567'; // 52 + 10 dígitos (México)
  const texto = encodeURIComponent('Hola, vengo del sitio. Me interesa un servicio de detailing (paquete, tipo de vehículo y zona).');
  waBtn.href = `https://wa.me/${telefono}?text=${texto}`;

  // 2) Mostrar/ocultar por scroll (aparece al bajar 300px)
  const UMBRAL = 300;
  const toggleWA = () => {
    if (window.scrollY > UMBRAL) {
      waBtn.classList.add('show');
    } else {
      waBtn.classList.remove('show');
    }
  };

  toggleWA();
  window.addEventListener('scroll', toggleWA, { passive: true });
});
