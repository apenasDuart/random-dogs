const API = "https://dog.ceo/api/breeds/image/random";

const btn = document.getElementById("newDogBtn");
const img = document.getElementById("dogImg");
const errorEl = document.getElementById("errorText");
const breedText = document.getElementById("breedText");

function extractBreedFromUrl(url){
  try{
    const parts = new URL(url).pathname.split("/");
    const idx = parts.indexOf("breeds");
    if (idx !== -1 && parts.length > idx + 1){
      const raw = parts[idx + 1];
      return raw
        .split("-")
        .map(s => s[0]?.toUpperCase() + s.slice(1))
        .join(" ");
    }
  }catch(e){}
  return "";
}

async function fetchDog(){
  errorEl.style.display = "none";
  btn.disabled = true;
  btn.textContent = "Carregando...";

  try {
    const res = await fetch(API, { cache: "no-store" });
    if(!res.ok) throw new Error("Erro: " + res.status);

    const data = await res.json();

    if(data.status === "success"){
      img.src = data.message;

      const breedName = extractBreedFromUrl(data.message);
      img.alt = "Foto de " + (breedName || "cachorro");
      breedText.textContent = breedName ? `Raça: ${breedName}` : "";
    } else {
      throw new Error("Resposta inesperada");
    }
  } catch(err){
    console.error(err);
    errorEl.style.display = "block";
    errorEl.textContent = "Erro ao carregar a imagem — tente novamente.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Mostrar outro cachorro";
  }
}

window.addEventListener("load", fetchDog);
btn.addEventListener("click", fetchDog);
