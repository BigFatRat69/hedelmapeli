let rahaElementti = document.getElementById('raha');
let panosElementti = document.getElementById('panos');
let viestiElementti = document.getElementById('viesti');
let raha = 50;
let panos = 0;

const rullat = [
    document.getElementById("rulla1"),
    document.getElementById("rulla2"),
    document.getElementById("rulla3"),
    document.getElementById("rulla4"),
];

let lukitutRullat = {
    rulla1: false,
    rulla2: false,
    rulla3: false,
    rulla4: false
};

const lockButtons = document.querySelectorAll('.lock-button');

document.getElementById("panos1").addEventListener("click", () => asetaPanos(1));
document.getElementById("panos2").addEventListener("click", () => asetaPanos(2));
document.getElementById("panos3").addEventListener("click", () => asetaPanos(3));

lockButtons.forEach(button => {
    button.addEventListener('click', () => {
        const rullaId = button.getAttribute('data-id');
        lukitutRullat[rullaId] = !lukitutRullat[rullaId];
        button.textContent = lukitutRullat[rullaId] ? 'Vapauta' : 'Lukitse';
    });
});

function asetaPanos(maara) {
    if (raha >= maara) {
        panos = maara;
        panosElementti.textContent = panos;
        naytaViesti(`Panos asetettu: ${panos}€`);
    } else {
        naytaViesti("Ei tarpeeksi rahaa panoksen asettamiseen.");
    }
}

function pelaa() {
    if (panos === 0) {
        naytaViesti("Aseta ensin panos!");
        return;
    }
    if (raha < panos) {
        naytaViesti("Ei tarpeeksi rahaa pyöräyttämiseen!");
        return;
    }
    raha -= panos;
    paivitaRaha();
    pyoraytaRullat();

    let tulokset = [];
    rullat.forEach(rulla => {
        tulokset.push(rulla.textContent);
    });

    let voitto = tarkistaVoitto(tulokset);
    if (voitto > 0) {
        lisaaVoitto(voitto);
        naytaViesti(`Voitit ${voitto} euroa!`);
        vapautaKaikkiRullat();
        lukitsePainikkeet(true);
    } else {
        naytaViesti("Ei voittoa tällä kierroksella. Voit lukita haluamasi rullat ja yrittää uudelleen.");
        lukitsePainikkeet(false);
    }
}

function tarkistaVoitto(tulokset) {
    let voitto = 0;
    const seiskat = tulokset.filter(symboli => symboli === "7️⃣").length;

    if (seiskat === 4) {
        voitto = panos * 10; 
    } else if (seiskat === 3) {
        voitto = panos * 5;
    } else if (JSON.stringify(tulokset) === JSON.stringify(["🍎", "🍎", "🍎", "🍎"])) {
        voitto = panos * 6;
    } else if (JSON.stringify(tulokset) === JSON.stringify(["🍉", "🍉", "🍉", "🍉"])) {
        voitto = panos * 5;
    } else if (JSON.stringify(tulokset) === JSON.stringify(["🍐", "🍐", "🍐", "🍐"])) {
        voitto = panos * 4;
    } else if (JSON.stringify(tulokset) === JSON.stringify(["🍒", "🍒", "🍒", "🍒"])) {
        voitto = panos * 3;
    }
    return voitto; 
}

function pyoraytaRullat() {
    const symbolit = ["🍎", "🍉", "🍐", "🍒", "7️⃣"];
    rullat.forEach(rulla => {
        if (!lukitutRullat[rulla.id]) {
            const satunnainenSymboli = symbolit[Math.floor(Math.random() * symbolit.length)];
            //const satunnainenSymboli = symbolit[4]
            rulla.textContent = satunnainenSymboli;
        }
    });
}

function paivitaRaha() {
    rahaElementti.textContent = raha;
}

function lisaaVoitto(summa) {
    raha += summa;
    paivitaRaha();
}

function vapautaKaikkiRullat() {
    lockButtons.forEach(button => {
        const rullaId = button.getAttribute('data-id');
        lukitutRullat[rullaId] = false;
        button.textContent = 'Lukitse';
    });
}

function naytaViesti(teksti) {
    viestiElementti.textContent = teksti;
}

function lukitsePainikkeet(tila) {
    lockButtons.forEach(button => {
        button.disabled = tila; 
    });
}

document.getElementById('tarkistaBtn').addEventListener('click', huijausMenu);

function huijausMenu() {
    const annettuSalasana = document.getElementById('salasana').value;
    const oikeaSalasana = "1234";

    if (annettuSalasana === oikeaSalasana) {
        const buttonContainer = document.getElementById('buttonContainer');
        const uusiNappi1 = document.createElement('button');
        uusiNappi1.textContent = "Lisää rahaa";
        uusiNappi1.onclick = function() {
            raha += 100000;
            paivitaRaha()
        };
        buttonContainer.appendChild(uusiNappi1);
    }
}