// CONFIG: troque os dados abaixo
const WHATSAPP_NUMBER = "5562999999999";
const EMAIL_DESTINO = "contato@tripzo.com";

const $ = (id) => document.getElementById(id);

function waLink(message) {
  const base = "https://wa.me/" + WHATSAPP_NUMBER;
  if (!message) return base;
  return base + "?text=" + encodeURIComponent(message);
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
window.scrollToSection = scrollToSection;

function buildMessage() {
  const name = ($("clientName")?.value || "(nome não informado)").trim();
  const contact = ($("clientContact")?.value || "(contato não informado)").trim();
  const from = ($("from").value || "(origem)").trim();
  const to = ($("to").value || "(destino)").trim();
  const depart = $("depart").value || "(data)";
  const ret = $("return").value || "(data)";
  const pax = $("paxValue").textContent || "1";
  return [
    "Olá! Quero uma cotação de passagem aérea.",
    "Nome: " + name,
    "Contato: " + contact,
    "Trecho: " + from + " → " + to,
    "Ida: " + depart,
    "Volta: " + ret,
    "Passageiros: " + pax
  ].join(" | ");
}

function updateHiddenFields() {
  $("paxHidden").value = $("paxValue").textContent || "1";
  $("messageFull").value = buildMessage();
  $("cotacao").action = "https://formsubmit.co/" + EMAIL_DESTINO;
}

$("year").textContent = new Date().getFullYear();
$("btnTopWA").href = waLink("Olá! Quero uma cotação de passagem aérea.");
$("btnHeroWA").href = waLink("Olá! Quero tirar uma dúvida sobre passagens.");
$("btnServiceWA").href = waLink("Olá! Quero personalizar o site Tripzo com meus dados (nome, contatos e WhatsApp).");
$("btnContactWA").href = waLink("Olá! Quero uma cotação de passagem aérea.");

let pax = 1;
$("paxMinus").addEventListener("click", () => {
  pax = Math.max(1, pax - 1);
  $("paxValue").textContent = pax;
  updateButtons();
});

$("paxPlus").addEventListener("click", () => {
  pax = Math.min(9, pax + 1);
  $("paxValue").textContent = pax;
  updateButtons();
});

function updateButtons() {
  const msg = buildMessage();
  $("btnSendWA").href = waLink(msg);
  $("fabWA").href = waLink(msg);
  updateHiddenFields();
}

["from", "to", "depart", "return", "clientName", "clientContact"].forEach((id) => {
  $(id).addEventListener("input", updateButtons);
  $(id).addEventListener("change", updateButtons);
});

updateButtons();

$("btnCopy").addEventListener("click", async () => {
  const msg = buildMessage();
  try {
    await navigator.clipboard.writeText(msg);
    const old = $("btnCopy").innerHTML;
    $("btnCopy").innerHTML = "Copiado ✅";
    setTimeout(() => ($("btnCopy").innerHTML = old), 1200);
  } catch (e) {
    alert("Não consegui copiar automaticamente. Copie manualmente:\n\n" + msg);
  }
});

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add("in");
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

window.addEventListener("load", () => {
  setTimeout(() => $("fabWA").classList.add("show"), 120);
});
